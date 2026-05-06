import { useEffect, useMemo, useState } from "react"
import PokemonExplorer from "./components/PokemonExplorer"
import TeamBuilder from "./components/TeamBuilder"
import CounterAnalyzer from "./components/CounterAnalyzer"

const TABS = {
  explorer: "Explorer",
  team: "Team Builder",
  counter: "Counter Analyzer",
}

function App() {
  const [pokemonList, setPokemonList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("explorer")

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        setLoading(true)
        const response = await fetch("/data/pokemon_with_matchups.json")
        if (!response.ok) {
          throw new Error("Failed to load pokemon_with_matchups.json")
        }
        const data = await response.json()
        if (isMounted) setPokemonList(data)
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load data")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const headerMeta = useMemo(() => {
    if (!pokemonList.length) return "Loading roster..."
    const legendaryCount = pokemonList.filter((pokemon) => pokemon.is_legendary || pokemon.is_mythical).length
    return `${pokemonList.length} Pokemon loaded • ${legendaryCount} Legendary/Mythical`
  }, [pokemonList])

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Pokemon Team Builder</h1>
        <p>Modern, fun, and practical helper for explore, build, and counter.</p>
        <span className="header-meta">{headerMeta}</span>
      </header>

      <nav className="tabs">
        {Object.entries(TABS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={activeTab === key ? "tab active" : "tab"}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      {loading && <p className="state-info">Loading Pokemon data...</p>}
      {error && <p className="state-info error">{error}</p>}

      {!loading && !error && (
        <>
          {activeTab === "explorer" && <PokemonExplorer pokemonList={pokemonList} />}
          {activeTab === "team" && <TeamBuilder pokemonList={pokemonList} />}
          {activeTab === "counter" && <CounterAnalyzer pokemonList={pokemonList} />}
        </>
      )}
    </main>
  )
}

export default App
