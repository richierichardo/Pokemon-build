import { useMemo, useState } from "react"
import PokemonCard from "./PokemonCard"
import PokemonSelect from "./PokemonSelect"
import { analyzeEnemyTeam, recommendCounters } from "../utils/counterAnalyzer"

function CounterAnalyzer({ pokemonList }) {
  const [enemyOne, setEnemyOne] = useState("")
  const [enemyTwo, setEnemyTwo] = useState("")
  const [enemyThree, setEnemyThree] = useState("")

  const enemyTeam = useMemo(() => {
    return [enemyOne, enemyTwo, enemyThree]
      .filter(Boolean)
      .map((name) => pokemonList.find((pokemon) => pokemon.name === name))
      .filter(Boolean)
  }, [enemyOne, enemyTwo, enemyThree, pokemonList])

  const enemyInsight = useMemo(() => analyzeEnemyTeam(enemyTeam), [enemyTeam])
  const counterOptions = useMemo(() => recommendCounters(enemyTeam, pokemonList, { limit: 6 }), [enemyTeam, pokemonList])

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Counter Analyzer</h2>
        <p>Masukkan tim lawan (maks 3), lalu lihat opsi counter paling aman dan efektif.</p>
      </div>

      <div className="controls-row triple">
        <PokemonSelect pokemonList={pokemonList} value={enemyOne} onChange={setEnemyOne} placeholder="Enemy slot 1" />
        <PokemonSelect
          pokemonList={pokemonList}
          value={enemyTwo}
          onChange={setEnemyTwo}
          placeholder="Enemy slot 2"
          excludeNames={[enemyOne]}
        />
        <PokemonSelect
          pokemonList={pokemonList}
          value={enemyThree}
          onChange={setEnemyThree}
          placeholder="Enemy slot 3"
          excludeNames={[enemyOne, enemyTwo]}
        />
      </div>

      <div className="score-card">
        <h3>Shared Enemy Weaknesses</h3>
        <p>
          {enemyInsight.enemySharedWeaknesses.length > 0
            ? enemyInsight.enemySharedWeaknesses.map((item) => `${item.type} (${item.count})`).join(", ")
            : "Belum ada overlap weakness yang signifikan."}
        </p>
      </div>

      <div className="cards-grid">
        {counterOptions.map((item) => (
          <div key={`counter-${item.pokemon.name}`}>
            <PokemonCard pokemon={item.pokemon} compact />
            <p className="counter-meta">
              Counter Score: {item.score} • Offense {item.detail.offensiveScore} • Defense {item.detail.defensiveScore}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CounterAnalyzer
