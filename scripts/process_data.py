import json
import shutil
from pathlib import Path

import pandas as pd
import numpy as np

from build_type_matchups import (
    build_type_chart,
    get_type_multiplier,
    summarize_defensive_matchups,
    calculate_defensive_matchups,
    calculate_offensive_coverage,
)

ROOT_DIR = Path(__file__).resolve().parents[1]

RAW_DATA_DIR = ROOT_DIR / "data" / "raw"
PROCESSED_DATA_DIR = ROOT_DIR / "data" / "processed"
PUBLIC_DATA_DIR = ROOT_DIR / "public" / "data"

POKEMON_CSV = RAW_DATA_DIR / "pokemon_complete.csv"
TYPES_CSV = RAW_DATA_DIR / "pokemon_types.csv"

STAT_COLS = ["hp", "attack", "defense", "sp_attack", "sp_defense", "speed"]

IMPORTANT_COLS = [
    "pokedex_number",
    "name",
    "type_1",
    "type_2",
    "hp",
    "attack",
    "defense",
    "sp_attack",
    "sp_defense",
    "speed",
    "base_stat_total",
    "height_m",
    "weight_kg",
    "is_legendary",
    "base_experience",
    "abilities",
    "hidden_abilities",
    "generation",
    "is_mythical",
    "is_baby",
    "color",
    "shape",
    "habitat",
    "growth_rate",
    "capture_rate",
    "base_happiness",
    "genus",
    "evolution_chain_id",
    "flavor_text",
    "sprite_url",
]


def ensure_directories():
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)


def clean_string(value):
    if pd.isna(value):
        return None

    text = str(value).strip()

    if text == "":
        return None

    return text


def normalize_types(value):
    if pd.isna(value):
        return None

    text = str(value).strip().lower()

    if text == "" or text == "nan":
        return None

    return text


def parse_pipe_string(value):
    if pd.isna(value):
        return []

    text = str(value).strip()

    if not text:
        return []

    return [item.strip() for item in text.split("|") if item.strip()]


def clean_pokemon_data(df):
    """
    Basic cleaning for pokemon_complete.csv.
    """
    df = df.copy()

    # Keep known important columns only.
    existing_cols = [col for col in IMPORTANT_COLS if col in df.columns]
    df = df[existing_cols]

    # Normalize text fields.
    df["name"] = df["name"].apply(clean_string)
    df["type_1"] = df["type_1"].apply(normalize_types)
    df["type_2"] = df["type_2"].apply(normalize_types)

    # Convert pipe-separated strings into arrays.
    if "abilities" in df.columns:
        df["abilities"] = df["abilities"].apply(parse_pipe_string)

    if "egg_groups" in df.columns:
        df["egg_groups"] = df["egg_groups"].apply(parse_pipe_string)

    # Boolean columns.
    boolean_cols = ["is_legendary", "is_mythical", "is_baby"]
    for col in boolean_cols:
        if col in df.columns:
            df[col] = df[col].astype(bool)

    # Numeric columns.
    numeric_cols = [
        "pokedex_number",
        "hp",
        "attack",
        "defense",
        "sp_attack",
        "sp_defense",
        "speed",
        "base_stat_total",
        "height_m",
        "weight_kg",
        "base_experience",
        "generation",
        "capture_rate",
        "base_happiness",
        "evolution_chain_id",
    ]

    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    return df


def add_stat_features(df):
    """
    Add derived stat features.
    """
    df = df.copy()

    df["offense_score"] = df[["attack", "sp_attack"]].max(axis=1)
    df["defense_score"] = df[["defense", "sp_defense"]].max(axis=1)
    df["bulk_score"] = df[["hp", "defense", "sp_defense"]].mean(axis=1).round(2)
    df["speed_score"] = df["speed"]
    df["physical_special_gap"] = (df["attack"] - df["sp_attack"]).abs()

    df["primary_attack_style"] = np.where(
        df["attack"] >= df["sp_attack"], "physical", "special"
    )

    return df


def classify_role(row):
    """
    Simple explainable role classification based on base stats.

    This is intentionally rule-based, not ML.
    The goal is to support team recommendation logic transparently.
    """
    hp = row["hp"]
    attack = row["attack"]
    defense = row["defense"]
    sp_attack = row["sp_attack"]
    sp_defense = row["sp_defense"]
    speed = row["speed"]

    offense = max(attack, sp_attack)
    bulk = np.mean([hp, defense, sp_defense])
    defensive_power = max(defense, sp_defense)

    stat_values = np.array([hp, attack, defense, sp_attack, sp_defense, speed])
    stat_std = stat_values.std()

    if speed >= 100 and attack >= sp_attack and attack >= 90:
        return "Physical Sweeper"

    if speed >= 100 and sp_attack > attack and sp_attack >= 90:
        return "Special Sweeper"

    if offense >= 110 and bulk < 75:
        return "Glass Cannon"

    if hp >= 80 and defense >= 90 and defense >= sp_defense:
        return "Physical Tank"

    if hp >= 80 and sp_defense >= 90 and sp_defense > defense:
        return "Special Tank"

    if defensive_power >= 100 and speed < 70:
        return "Defensive Wall"

    if stat_std <= 18 and row["base_stat_total"] >= 430:
        return "Balanced Fighter"

    if speed >= 95:
        return "Speed Utility"

    if offense >= 90:
        return "Attacker"

    if bulk >= 80:
        return "Bulky Support"

    return "Generalist"


def add_role_features(df):
    df = df.copy()

    df["role"] = df.apply(classify_role, axis=1)

    return df


def add_matchup_features(df, type_chart):
    """
    Add weakness, resistance, immunity, and offensive coverage features.
    """
    df = df.copy()

    all_types = sorted(type_chart.keys())

    defensive_matchups = []
    defensive_summaries = []
    offensive_coverages = []

    for _, row in df.iterrows():
        defensive = calculate_defensive_matchups(
            type_1=row["type_1"],
            type_2=row["type_2"],
            all_types=all_types,
            type_chart=type_chart,
        )

        defensive_summary = summarize_defensive_matchups(defensive)

        offensive = calculate_offensive_coverage(
            type_1=row["type_1"],
            type_2=row["type_2"],
            all_types=all_types,
            type_chart=type_chart,
        )

        defensive_matchups.append(defensive)
        defensive_summaries.append(defensive_summary)
        offensive_coverages.append(offensive)

    df["defensive_matchups"] = defensive_matchups
    df["weaknesses_4x"] = [item["weaknesses_4x"] for item in defensive_summaries]
    df["weaknesses_2x"] = [item["weaknesses_2x"] for item in defensive_summaries]
    df["resistances_0.5x"] = [item["resistances_0.5x"] for item in defensive_summaries]
    df["resistances_0.25x"] = [
        item["resistances_0.25x"] for item in defensive_summaries
    ]
    df["immunities_0x"] = [item["immunities_0x"] for item in defensive_summaries]
    df["offensive_coverage"] = offensive_coverages

    df["weakness_count"] = df["weaknesses_4x"].apply(len) + df["weaknesses_2x"].apply(
        len
    )
    df["resistance_count"] = df["resistances_0.5x"].apply(len) + df[
        "resistances_0.25x"
    ].apply(len)
    df["immunity_count"] = df["immunities_0x"].apply(len)
    df["offensive_coverage_count"] = df["offensive_coverage"].apply(
        lambda x: len(x["super_effective_against"])
    )

    return df


def validate_data(df):
    """
    Basic validation before export.
    """
    required_cols = [
        "name",
        "type_1",
        "hp",
        "attack",
        "defense",
        "sp_attack",
        "sp_defense",
        "speed",
        "base_stat_total",
    ]

    missing_required = [col for col in required_cols if col not in df.columns]

    if missing_required:
        raise ValueError(f"Missing required columns: {missing_required}")

    if df["name"].isna().any():
        raise ValueError("Some Pokemon rows have missing names.")

    if df["type_1"].isna().any():
        raise ValueError("Some Pokemon rows have missing primary type.")

    stat_missing = df[STAT_COLS].isna().sum()

    if stat_missing.sum() > 0:
        print("Warning: Missing stat values found:")
        print(stat_missing[stat_missing > 0])


def export_json(data, path):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)


def main():
    ensure_directories()

    print("Loading raw data...")
    pokemon_df = pd.read_csv(POKEMON_CSV)
    types_df = pd.read_csv(TYPES_CSV)

    print(f"Pokemon raw shape: {pokemon_df.shape}")
    print(f"Types raw shape: {types_df.shape}")

    print("Building type chart...")
    type_chart = build_type_chart(types_df)

    print("Cleaning Pokemon data...")
    pokemon_clean = clean_pokemon_data(pokemon_df)

    print("Adding stat features...")
    pokemon_features = add_stat_features(pokemon_clean)

    print("Adding role features...")
    pokemon_features = add_role_features(pokemon_features)

    print("Adding matchup features...")
    pokemon_final = add_matchup_features(pokemon_features, type_chart)

    print("Validating final data...")
    validate_data(pokemon_final)

    print("Exporting JSON files...")

    # 1. Basic Pokemon data.
    pokemon_basic_cols = [
        "pokedex_number",
        "name",
        "type_1",
        "type_2",
        "hp",
        "attack",
        "defense",
        "sp_attack",
        "sp_defense",
        "speed",
        "base_stat_total",
        "generation",
        "is_legendary",
        "is_mythical",
        "is_baby",
        "sprite_url",
    ]

    pokemon_basic_cols = [
        col for col in pokemon_basic_cols if col in pokemon_final.columns
    ]

    pokemon_basic = (
        pokemon_final[pokemon_basic_cols]
        .replace({np.nan: None})
        .to_dict(orient="records")
    )

    # 2. Full Pokemon data with matchups.
    pokemon_full = pokemon_final.replace({np.nan: None}).to_dict(orient="records")

    # 3. Type chart.
    type_chart_data = type_chart

    export_json(pokemon_basic, PROCESSED_DATA_DIR / "pokemon.json")

    export_json(type_chart_data, PROCESSED_DATA_DIR / "type_chart.json")

    export_json(pokemon_full, PROCESSED_DATA_DIR / "pokemon_with_matchups.json")

    # Copy to public/data so React can fetch it.
    shutil.copy(PROCESSED_DATA_DIR / "pokemon.json", PUBLIC_DATA_DIR / "pokemon.json")

    shutil.copy(
        PROCESSED_DATA_DIR / "type_chart.json", PUBLIC_DATA_DIR / "type_chart.json"
    )

    shutil.copy(
        PROCESSED_DATA_DIR / "pokemon_with_matchups.json",
        PUBLIC_DATA_DIR / "pokemon_with_matchups.json",
    )

    print("Done.")
    print(f"Exported to: {PROCESSED_DATA_DIR}")
    print(f"Copied to: {PUBLIC_DATA_DIR}")
    print(f"Final Pokemon rows: {len(pokemon_final)}")
    print(f"Final Pokemon columns: {len(pokemon_final.columns)}")

    print("\nSample output:")
    print(
        pokemon_final[
            [
                "name",
                "type_1",
                "type_2",
                "role",
                "weaknesses_4x",
                "weaknesses_2x",
                "resistances_0.5x",
                "resistances_0.25x",
                "immunities_0x",
                "offensive_coverage_count",
            ]
        ].head()
    )


if __name__ == "__main__":
    main()
