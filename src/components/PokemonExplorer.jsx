import { useMemo, useState } from "react"
import PokemonCard from "./PokemonCard"
import TypeBadge from "./TypeBadge"
import { normalizeText, getPokemonTypes } from "../utils/pokemonHelpers"

function PokemonExplorer({ pokemonList }) {
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [genFilter, setGenFilter] = useState("all")

  const allTypes = useMemo(() => {
    const set = new Set()
    pokemonList.forEach((pokemon) => getPokemonTypes(pokemon).forEach((type) => set.add(type)))
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [pokemonList])

  const allGenerations = useMemo(() => {
    return [...new Set(pokemonList.map((pokemon) => pokemon.generation).filter(Boolean))].sort((a, b) => a - b)
  }, [pokemonList])

  const filtered = useMemo(() => {
    const q = normalizeText(query)
    return pokemonList.filter((pokemon) => {
      const matchesName = !q || normalizeText(pokemon.name).includes(q)
      const matchesType = typeFilter === "all" || getPokemonTypes(pokemon).includes(typeFilter)
      const matchesGen = genFilter === "all" || Number(pokemon.generation) === Number(genFilter)
      return matchesName && matchesType && matchesGen
    })
  }, [pokemonList, query, typeFilter, genFilter])

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Pokemon Explorer</h2>
        <p>Cari Pokemon favorit, cek tipe, dan lihat stat cepat.</p>
      </div>
      <div className="controls-row">
        <input
          className="text-input"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name..."
        />
        <select className="poke-select" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="all">All Types</option>
          {allTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select className="poke-select" value={genFilter} onChange={(event) => setGenFilter(event.target.value)}>
          <option value="all">All Generations</option>
          {allGenerations.map((generation) => (
            <option key={generation} value={generation}>
              Gen {generation}
            </option>
          ))}
        </select>
      </div>
      <div className="inline-chips">
        {typeFilter !== "all" && <TypeBadge type={typeFilter} />}
        <span className="result-count">{filtered.length} result(s)</span>
      </div>
      <div className="cards-grid">
        {filtered.slice(0, 24).map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} compact />
        ))}
      </div>
    </section>
  )
}

export default PokemonExplorer
