import { useMemo, useState } from "react"
import PokemonCard from "./PokemonCard"
import PokemonSelect from "./PokemonSelect"
import { calculateTeamScore, recommendTeam } from "../utils/teamScoring"

function TeamBuilder({ pokemonList }) {
  const [baseName, setBaseName] = useState("")
  const [excludeLegendary, setExcludeLegendary] = useState(true)
  const [excludeMythical, setExcludeMythical] = useState(true)
  const [generation, setGeneration] = useState("all")

  const allGenerations = useMemo(() => {
    return [...new Set(pokemonList.map((pokemon) => pokemon.generation).filter(Boolean))].sort((a, b) => a - b)
  }, [pokemonList])

  const basePokemon = useMemo(() => pokemonList.find((pokemon) => pokemon.name === baseName), [pokemonList, baseName])

  const recommendations = useMemo(() => {
    if (!basePokemon) return []
    return recommendTeam(basePokemon, pokemonList, {
      excludeLegendary,
      excludeMythical,
      generation,
      limit: 3,
    })
  }, [basePokemon, pokemonList, excludeLegendary, excludeMythical, generation])

  const bestTeam = recommendations[0]?.team || []
  const bestScore = bestTeam.length > 0 ? calculateTeamScore(bestTeam) : null

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Team Builder</h2>
        <p>Pilih satu core Pokemon, lalu dapat rekomendasi 3-mon team yang balance.</p>
      </div>

      <div className="controls-row">
        <PokemonSelect
          pokemonList={pokemonList}
          value={baseName}
          onChange={setBaseName}
          placeholder="Pick your core Pokemon"
        />
        <select className="poke-select" value={generation} onChange={(event) => setGeneration(event.target.value)}>
          <option value="all">All Generations</option>
          {allGenerations.map((gen) => (
            <option key={gen} value={gen}>
              Gen {gen}
            </option>
          ))}
        </select>
      </div>

      <div className="toggle-row">
        <label>
          <input type="checkbox" checked={excludeLegendary} onChange={(event) => setExcludeLegendary(event.target.checked)} />
          Exclude Legendary
        </label>
        <label>
          <input type="checkbox" checked={excludeMythical} onChange={(event) => setExcludeMythical(event.target.checked)} />
          Exclude Mythical
        </label>
      </div>

      {bestScore && (
        <div className="score-card">
          <h3>Best Team Score: {bestScore.totalScore}</h3>
          <p>
            Coverage: {bestScore.offensiveCoverageScore} • Role: {bestScore.roleBalanceScore} • Stats:{" "}
            {bestScore.statBalanceScore}
          </p>
          <p>
            Weakness Penalty: {bestScore.sharedWeaknessPenalty} • Legendary Penalty: {bestScore.legendaryPenalty}
          </p>
        </div>
      )}

      <div className="cards-grid">
        {bestTeam.map((pokemon) => (
          <PokemonCard key={`team-${pokemon.name}`} pokemon={pokemon} />
        ))}
      </div>
    </section>
  )
}

export default TeamBuilder
