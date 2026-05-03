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