# Pokémon Team Builder

An interactive Pokémon web application that helps users explore Pokémon data, build a more balanced 3-Pokémon team, analyze type matchups, and find type-based counters against an opponent team.

This project transforms raw Pokémon datasets into a user-friendly strategy assistant using a Python data processing pipeline and a React frontend. The recommendation logic is explainable and based on Pokémon type effectiveness, defensive weaknesses, offensive coverage, and stat-based role classification.

---

## Project Purpose

Many Pokémon players have a favorite Pokémon, but they may not always know:

- What is this Pokémon strong against?
- What types can counter this Pokémon?
- Is this 3-Pokémon team balanced enough?
- What Pokémon should I use against a specific opponent team?

This project answers those questions through an interactive UI and rule-based recommendation logic that can explain why a Pokémon or team is recommended.

The goal is not only to build a dashboard, but also to turn raw Pokémon data into a practical and interactive decision-support tool.

---

## Main Features

### 1) Pokémon Explorer

The Pokémon Explorer allows users to browse and search Pokémon data.

Main features:

- Search Pokémon by name
- Filter Pokémon by type and generation
- View Pokémon type, role, base stat total, and basic stats
- Open a dedicated detail page for each Pokémon
- Explore Pokémon weaknesses, resistances, and immunities

---

### 2) Pokémon Detail Page

The Pokémon Detail Page provides a deeper view of each Pokémon.

Main information shown:

- Pokémon name
- Pokédex number
- Type 1 and Type 2
- Stat-based role
- Base stat total
- HP, Attack, Defense, Special Attack, Special Defense, and Speed
- Weaknesses
- Resistances
- Immunities
- Flavor text, if available
- Sprite image, if available
- Top counter Pokémon
- Pokémon that are likely weak against the selected Pokémon

If some fields are unavailable in the dataset, the app uses fallback text or empty-state UI instead of breaking the page.

---

### 3) Team Builder

The Team Builder allows users to choose one core Pokémon and generate recommended 3-Pokémon team combinations.

The recommendation considers:

- Type coverage
- Defensive compatibility
- Shared weakness reduction
- Role balance
- Stat balance
- Optional legendary and mythical filtering
- Optional generation filtering

The purpose of this feature is to help users create a more balanced team using clear and explainable logic.

---

### 4) Counter Analyzer

The Counter Analyzer allows users to input an opponent team of up to 3 Pokémon.

The system analyzes:

- Opponent type composition
- Shared weaknesses in the opponent team
- Recommended attack types
- Counter Pokémon candidates
- Defensive risks of recommended counters
- Counter score for each recommendation

The current counter logic is based on Pokémon type effectiveness and base stats only.

---

## How It Works

The project follows this workflow:

```txt
Raw Pokémon CSV Data
→ Python Data Processing
→ Feature Engineering
→ JSON Export
→ React Web Application
→ Interactive Team and Counter Recommendations
```

Simplified explanation:

1. Raw Pokémon data is processed using Python.
2. The processed data is exported into JSON files.
3. The React app loads the processed JSON data.
4. User interactions are handled in the frontend.
5. Recommendation logic inside `src/utils` calculates team scores and counter suggestions.
6. The results are displayed as cards, matchup summaries, and easy-to-read insights.

---

## Tech Stack

### Frontend

- **React** — for building the user interface
- **Vite** — for fast development and build tooling
- **React Router DOM** — for routing between pages
- **Custom CSS** — for modern UI styling with a Pokémon-inspired theme

### Data Processing

- **Python** — for processing raw datasets
- **Pandas** — for data cleaning and transformation
- **NumPy** — for numerical/stat-based calculations

Main data processing scripts:

```txt
scripts/process_data.py
scripts/build_type_matchups.py
```

### Recommendation Logic

The recommendation engine uses rule-based scoring located in:

```txt
src/utils/
```

Main utility files:

```txt
src/utils/pokemonHelpers.js
src/utils/teamScoring.js
src/utils/counterAnalyzer.js
src/utils/matchupInsights.js
```

Responsibilities:

- `pokemonHelpers.js`  
  General helper functions for Pokémon data, type handling, filtering, and route-safe names.

- `teamScoring.js`  
  Calculates team score, offensive coverage, defensive support, shared weakness penalties, role balance, and team recommendations.

- `counterAnalyzer.js`  
  Analyzes opponent teams and recommends type-based counter Pokémon.

- `matchupInsights.js`  
  Generates matchup insights for individual Pokémon detail pages, including top counters and weak matchups.

---

## Project Structure

```txt
pokemon-team-builder/
├─ data/
│  ├─ raw/
│  │  ├─ pokemon_complete.csv
│  │  └─ pokemon_types.csv
│  └─ processed/
│     ├─ pokemon.json
│     ├─ type_chart.json
│     └─ pokemon_with_matchups.json
│
├─ public/
│  ├─ data/
│  │  ├─ pokemon.json
│  │  ├─ type_chart.json
│  │  └─ pokemon_with_matchups.json
│  └─ icons.svg
│
├─ scripts/
│  ├─ process_data.py
│  └─ build_type_matchups.py
│
├─ src/
│  ├─ components/
│  │  ├─ PokemonExplorer.jsx
│  │  ├─ PokemonDetail.jsx
│  │  ├─ TeamBuilder.jsx
│  │  ├─ CounterAnalyzer.jsx
│  │  ├─ PokemonCard.jsx
│  │  ├─ PokemonSelect.jsx
│  │  ├─ TypeBadge.jsx
│  │  └─ StatBar.jsx
│  ├─ utils/
│  │  ├─ pokemonHelpers.js
│  │  ├─ teamScoring.js
│  │  ├─ counterAnalyzer.js
│  │  └─ matchupInsights.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
│
├─ notebooks/
│  └─ 01_eda_pokemon.ipynb
│
├─ index.html
├─ package.json
├─ requirements.txt
└─ README.md
```

---

## Dataset

This project uses two main raw datasets:

```txt
data/raw/pokemon_complete.csv
data/raw/pokemon_types.csv
```

### `pokemon_complete.csv`

Contains Pokémon-level information such as:

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
- Legendary, mythical, and baby status
- Height and weight
- Habitat
- Evolution chain ID
- Flavor text
- Sprite URL

### `pokemon_types.csv`

Contains Pokémon type effectiveness information such as:

- Double damage to
- Half damage to
- No damage to
- Double damage from
- Half damage from
- No damage from

This type chart is used to calculate weaknesses, resistances, immunities, and type-based offensive coverage.

---

## Processed Data Output

After running the Python data processing script, the project generates frontend-ready JSON files.

Output location:

```txt
data/processed/
```

Files generated:

```txt
pokemon.json
type_chart.json
pokemon_with_matchups.json
```

These files are also copied into:

```txt
public/data/
```

The React app reads the main dataset from:

```txt
public/data/pokemon_with_matchups.json
```

### Main Processed Fields

The processed Pokémon data includes original fields plus additional calculated fields, such as:

- `role`
- `offense_score`
- `defense_score`
- `bulk_score`
- `speed_score`
- `primary_attack_style`
- `defensive_matchups`
- `weaknesses_4x`
- `weaknesses_2x`
- `resistances_0_5x`
- `resistances_0_25x`
- `immunities_0x`
- `offensive_coverage`
- `weakness_count`
- `resistance_count`
- `immunity_count`
- `offensive_coverage_count`

---

## Feature Engineering

The project adds several derived features to make the dataset useful for the web app.

### Stat-Based Role Classification

Each Pokémon is classified into a role based on its base stats.

Example roles:

- Physical Sweeper
- Special Sweeper
- Glass Cannon
- Physical Tank
- Special Tank
- Defensive Wall
- Balanced Fighter
- Speed Utility
- Attacker
- Bulky Support
- Generalist

This classification is rule-based and designed to support team-building recommendations.

It is not an official competitive Pokémon role classification.

---

### Type Matchup Calculation

For each Pokémon, the system calculates:

- 4x weaknesses
- 2x weaknesses
- 0.5x resistances
- 0.25x resistances
- 0x immunities
- Offensive coverage based on Pokémon type

For example, a Fire/Flying Pokémon may have:

- 4x weakness to Rock
- 2x weakness to Water and Electric
- Immunity to Ground
- Offensive coverage against Grass, Bug, Ice, Steel, and Fighting

These calculations are used by both the Team Builder and Counter Analyzer.

---

## Recommendation Scope

The recommendation system is intentionally designed as a type-based and stat-based helper.

The current logic considers:

- Pokémon type
- Type weaknesses
- Type resistances
- Type immunities
- Base stats
- Stat-based role
- Offensive coverage based on Pokémon type
- Shared weaknesses between team members
- Legendary and mythical filtering

The current logic does not consider:

- Movesets
- Move power
- Move accuracy
- Move category
- Ability effects
- Held items
- Nature
- EV and IV
- Status moves
- Priority moves
- Weather
- Terrain
- Competitive battle formats
- Actual battle simulations

Because of these limitations, the recommendations should be understood as basic strategic suggestions, not guaranteed competitive battle advice.

---

## Why This Project Uses Rule-Based Logic Instead of Machine Learning

This project does not use machine learning as the main recommendation method because the available dataset does not contain a reliable target variable such as:

- Battle results
- Win/loss history
- Player ranking data
- Competitive usage data
- Moveset usage data
- Team performance data

Using machine learning without a meaningful target could make the model less relevant and harder to interpret.

Instead, this project uses rule-based scoring because Pokémon type effectiveness follows clear and explainable rules. This makes the recommendation logic easier to understand, debug, and explain.

---

## Team Scoring Logic

The Team Builder evaluates a team using a rule-based scoring approach.

The score considers:

```txt
Final Team Score =
Offensive Coverage Score
+ Defensive Support Score
+ Role Balance Score
+ Stat Balance Score
- Shared Weakness Penalty
- Legendary/Mythical Penalty
```

### Offensive Coverage Score

Measures how many Pokémon types can be hit super effectively by the team.

### Defensive Support Score

Measures whether recommended team members can cover the weaknesses of the selected core Pokémon.

### Role Balance Score

Rewards teams that include different stat-based roles.

### Stat Balance Score

Rewards teams that have a reasonable balance of offense, defense, bulk, and speed.

### Shared Weakness Penalty

Penalizes teams where two or more Pokémon share the same weakness.

For example:

```txt
If two Pokémon in the same team are weak to Rock-type attacks, the team receives a penalty.
```

### Legendary/Mythical Penalty

Optionally penalizes or excludes legendary and mythical Pokémon so that recommendations are more practical for casual team-building.

---

## Counter Analyzer Logic

The Counter Analyzer evaluates an opponent team by checking the weaknesses of each enemy Pokémon.

The system identifies:

- Common weaknesses across the opponent team
- Recommended attack types
- Pokémon that can hit those weaknesses
- Pokémon that resist or avoid opponent types
- Risk factors where a counter candidate is weak to the opponent's types

The output is a ranked list of counter candidates and a suggested counter team.

---

## Dataset Limitations

This project uses Pokémon datasets found for educational and portfolio purposes. Because of that, some information may be incomplete, inconsistent, or unavailable for certain Pokémon.

Known limitations include:

- Some Pokémon may not have complete image or sprite data.
- Some `flavor_text` values may be missing or unavailable.
- Some alternate forms, regional forms, mega evolutions, or special forms may not be fully standardized.
- The dataset may not fully represent the latest official Pokémon data.
- Type-based calculations depend on the available `pokemon_types.csv` data.
- The project does not validate every Pokémon entry against an official Pokédex source.

To handle missing data, the app uses fallback UI such as placeholder text, empty-state messages, or unavailable image states when certain fields are missing.

---

## Image and Sprite Notes

Some Pokémon images or sprites are loaded from the dataset through the available `sprite_url` field. Image availability depends on the completeness and validity of the dataset.

If a Pokémon does not have a valid sprite URL, the application will show a fallback state instead of breaking the UI.

This project does not claim ownership of Pokémon images, sprites, names, or related assets.

---

## Running the Project

### 1) Install frontend dependencies

```bash
npm install
```

### 2) Run the app in development mode

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Regenerate processed JSON data

This step is optional and only needed if the raw data or processing scripts are updated.

```bash
python scripts/process_data.py
```

---

## Development Notes

- The app reads its main data from `public/data/pokemon_with_matchups.json`.
- If the data pipeline is updated, run `python scripts/process_data.py` again.
- Recommendation logic is handled on the frontend through files in `src/utils`.
- The current recommendation system is rule-based, not machine learning based.
- The project is designed to be explainable and easy to inspect.

---

## Why This Project Is Useful

This project is useful for:

- Pokémon players who want to understand basic team synergy
- Users who want to explore Pokémon data interactively
- Beginners learning how raw data can become an interactive web app
- Portfolio demonstration for data processing and frontend development
- Showing how explainable logic can be used in a recommendation system

This project demonstrates:

- Data cleaning
- Feature engineering
- Exploratory data analysis
- Type matchup calculation
- Rule-based recommendation logic
- React component structure
- Frontend routing
- JSON-based data consumption
- Interactive UI development

---

## Future Improvements

Possible future improvements:

- Add a dashboard page with charts and summary insights.
- Add more complete Pokémon image handling.
- Add moveset data for more advanced counter analysis.
- Add ability effect data.
- Add item, nature, EV, and IV considerations.
- Add saved team feature.
- Add team export/import feature.
- Add Pokémon comparison mode.
- Add advanced filters by role, type, generation, and legendary status.
- Add backend API if the dataset or recommendation logic becomes larger.
- Add battle history or win-rate data if available in the future.
- Add machine learning only if meaningful battle outcome data becomes available.

---

## Project Status

Current status:

```txt
Python data processing pipeline completed
Processed JSON data generated
React frontend implemented
Pokémon Explorer implemented
Pokémon Detail Page implemented
Team Builder implemented
Counter Analyzer implemented
Rule-based recommendation logic implemented
```

---

## Disclaimer

This project is a fan-made educational and portfolio project.

Pokémon names, sprites, images, and related assets belong to Nintendo, Game Freak, and The Pokémon Company. This project is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, or The Pokémon Company.

The recommendation system is built for learning and demonstration purposes only.
