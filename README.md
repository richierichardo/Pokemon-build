# Pokémon Team Builder & Counter Analyzer

An interactive Pokémon analytics and recommendation web app that helps users explore Pokémon data, build a balanced 3-Pokémon team, and find type-based counters against an opponent team.

This project transforms raw Pokémon datasets into a React-based interactive application using a Python data processing pipeline. The recommendation logic is based on Pokémon type effectiveness, defensive weaknesses, offensive coverage, and stat-based role classification.

---

## Project Overview

Many Pokémon dashboards only show general statistics such as type distribution, base stats, or legendary counts. This project goes further by turning the dataset into an interactive decision-support tool.

Users can:

- Search and explore Pokémon details
- Analyze Pokémon stats, types, weaknesses, resistances, and immunities
- Build a 3-Pokémon team based on type coverage and stat balance
- Input an opponent team and get recommended type-based counters
- Understand why a Pokémon is recommended through explainable scoring logic

The project is designed as a portfolio project that combines:

- Data cleaning
- Exploratory data analysis
- Feature engineering
- Rule-based recommendation logic
- Interactive frontend development

---

## Problem Statement

The main question behind this project is:

> How can raw Pokémon data be transformed into an interactive strategy assistant that helps users build better 3-Pokémon teams and find type-based counters?

This project focuses on two core problems:

1. **Team Building Problem**  
   How can users build a balanced 3-Pokémon team based on type coverage, defensive weaknesses, and stat roles?

2. **Counter Recommendation Problem**  
   How can users identify Pokémon that can counter an opponent team based on type advantage and defensive compatibility?

---

## Dataset

The project uses two raw CSV datasets:

```txt
data/raw/pokemon_complete.csv
data/raw/pokemon_types.csv
```

pokemon_complete.csv Contains Pokémon-level information such as:

- Pokédex number
- Name
- Type 1 and Type 2
- HP
- Attack
- Defense
- Special Attack
- Special Defense
- Speed
- Base stat total
- Abilities
- Hidden ability
- Generation
- Legendary / mythical / baby status
- Height and weight
- Habitat
- Evolution chain ID
- Sprite URL

pokemon_types.csv Contains Pokémon type effectiveness data such as:

- Double damage to
- Half damage to
- No damage to
- Double damage from
- Half damage from
- No damage from

This dataset is used to calculate type-based weaknesses, resistances, immunities, and offensive coverage.

---

## Project Structure
```txt
pokemon-team-builder/
├─ data/
│  ├─ raw/
│  │  ├─ pokemon_complete.csv
│  │  └─ pokemon_types.csv
│  ├─ processed/
│  │  ├─ pokemon.json
│  │  ├─ type_chart.json
│  │  └─ pokemon_with_matchups.json
│
├─ notebooks/
│  └─ 01_eda_pokemon.ipynb
│
├─ scripts/
│  ├─ process_data.py
│  ├─ build_type_matchups.py
│  └─ export_json.py
│
├─ src/
│  ├─ components/
│  ├─ pages/ or app/
│  ├─ data/
│  │  └─ pokemon_with_matchups.json
│  ├─ utils/
│  │  ├─ teamScoring.js
│  │  └─ counterAnalyzer.js
│
├─ public/
│  ├─ data/
│  │  ├─ pokemon.json
│  │  ├─ type_chart.json
│  │  └─ pokemon_with_matchups.json
│  └─ sprites/
│
├─ README.md
├─ package.json
├─ requirements.txt
└─ .gitignore
```

---

## Methodology

The project workflow consists of four main stages:
```txt
Raw CSV Data
→ Exploratory Data Analysis
→ Data Cleaning and Feature Engineering
→ JSON Export
→ React Interactive Application
```

---

## App Features

1. Pokémon Explorer

Allows users to search and inspect Pokémon details.

Main information shown:

- Name
- Type 1 and Type 2
- Base stats
- Role
- Abilities
- Generation
- Legendary / mythical status
- Weaknesses
- Resistances
- Immunities
- Sprite image

2. Team Builder

Allows users to build a 3-Pokémon team.

The team builder can recommend Pokémon based on:

- Type coverage
- Defensive compatibility
- Shared weakness reduction
- Stat balance
- Role diversity
- Optional legendary filtering

The goal is not to create a perfect competitive team, but to help users build a more balanced team using explainable rules.

3. Counter Analyzer

Allows users to input an opponent team of 3 Pokémon.

The system analyzes:

- Opponent type composition
- Shared weaknesses in the opponent team
- Types that are effective against the opponent
- Recommended counter Pokémon
- Defensive risks of the recommended counters

The counter logic is based on Pokémon type effectiveness only.

4. Interactive Dashboard

The dashboard provides high-level insights such as:

- Pokémon distribution by type
- Pokémon distribution by generation
- Top Pokémon by base stat total
- Top Pokémon by Attack, Defense, Special Attack, Special Defense, Speed, and HP
- Legendary vs non-legendary comparison
- Role distribution
- Weakness and resistance distribution