import pandas as pd

def parse_pipe_list(value):
    if pd.isna(value) or value == "":
        return []
    
    return [
        item.strip().lower() 
        for item in value.split('|')
        if item.strip()
    ]

def build_type_chart(types_df):
    """
    Build type chart dictionary from pokemon_types.csv.

    Output example:
    {
        "fire": {
            "double_damage_to": ["grass", "ice", "bug", "steel"],
            "half_damage_to": ["fire", "water", "rock", "dragon"],
            ...
        }
    }
    """
    type_chart = {}
    
    for _, row in types_df.iterrows():
        type_name = row['type'].strip().lower()
        
        type_chart[type_name] = {
            "double_damage_to": parse_pipe_list(row.get('double_damage_to', '')),
            "half_damage_to": parse_pipe_list(row.get('half_damage_to', '')),
            "no_damage_to": parse_pipe_list(row.get('no_damage_to', '')),
            "double_damage_from": parse_pipe_list(row.get('double_damage_from', '')),
            "half_damage_from": parse_pipe_list(row.get('half_damage_from', '')),
            "no_damage_from": parse_pipe_list(row.get('no_damage_from', '')),
        }
    
    return type_chart

def get_type_multiplier(attacking_type, defending_type, type_chart):
    """
    Calculate damage multiplier from one attacking type to one or two defending types.

    Example:
    Electric attacking Water/Flying:
    Electric -> Water = 2x
    Electric -> Flying = 2x
    Total = 4x
    """
    attacking_type = attacking_type.strip().lower()

    defending_types = [
        str(t).strip().lower()
        for t in defending_type
        if pd.notna(t) and str(t).strip()
    ]

    if attacking_type not in type_chart:
        return 1.0  # Assume normal damage if type is unknown

    multiplier = 1.0
    attack_profile = type_chart[attacking_type]

    for defending_type in defending_types:
        if defending_type in attack_profile["no_damage_to"]:
            multiplier *= 0
        elif defending_type in attack_profile["double_damage_to"]:
            multiplier *= 2
        elif defending_type in attack_profile["half_damage_to"]:
            multiplier *= 0.5
        else:
            multiplier *= 1  # Normal damage
    
    return multiplier

def calculate_defensive_matchups(type_1, type_2, all_types, type_chart):
    """
    Calculate how much damage a Pokemon receives from each attacking type.
    """
    defending_types = [type_1]

    if pd.notna(type_2) and str(type_2).strip():
        defending_types.append(type_2)
    
    matchups = {}

    for attacking_type in all_types:
        multiplier = get_type_multiplier(
            attacking_type=attacking_type,
            defending_type=defending_types,
            type_chart=type_chart
        )
        matchups[attacking_type] = multiplier
    
    return matchups

def summarize_defensive_matchups(matchups):
    """
    Convert matchup multiplier dictionary into weakness/resistance/immunity groups.
    """

    return {
        "weaknesses_4x": sorted([t for t, m in matchups.items() if m == 4]),
        "weaknesses_2x": sorted([t for t, m in matchups.items() if m == 2]),
        "neutral_1x": sorted([t for t, m in matchups.items() if m == 1]),
        "resistances_0.5x": [t for t, m in matchups.items() if m == 0.5],
        "resistances_0.25x": [t for t, m in matchups.items() if m == 0.25],
        "immunities_0x": [t for t, m in matchups.items() if m == 0],
    }

def calculate_offensive_coverage(type_1, type_2, all_types, type_chart):
    """
    Calculate which defending types can be hit super effectively by the Pokemon's own type(s).

    This is simplified because it only uses the Pokemon's own type as attacking coverage,
    not actual moveset data.
    """
    attacking_types = [type_1]

    if pd.notna(type_2) and str(type_2).strip():
        attacking_types.append(type_2)
    
    coverage = {
        "super_effective_against": set(),
        "not_very_effective_against": set(),
        "no_effect_against": set()
    }

    for attacking_type in attacking_types:
        attacking_type = str(attacking_type).strip().lower()

        if attacking_type not in type_chart:
            continue

        coverage["super_effective_against"].update(type_chart[attacking_type]["double_damage_to"])
        coverage["not_very_effective_against"].update(type_chart[attacking_type]["half_damage_to"])
        coverage["no_effect_against"].update(type_chart[attacking_type]["no_damage_to"])
    
    return {
        "super_effective_against": sorted(coverage["super_effective_against"]),
        "not_very_effective_against": sorted(coverage["not_very_effective_against"]),
        "no_effect_against": sorted(coverage["no_effect_against"])
    }