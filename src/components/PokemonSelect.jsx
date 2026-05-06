import { useMemo } from "react"

function PokemonSelect({ pokemonList, value, onChange, placeholder = "Select Pokemon", excludeNames = [] }) {
  const sortedOptions = useMemo(() => {
    return [...pokemonList]
      .filter((pokemon) => !excludeNames.includes(pokemon.name))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [pokemonList, excludeNames])

  return (
    <select className="poke-select" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {sortedOptions.map((pokemon) => (
        <option key={pokemon.name} value={pokemon.name}>
          {pokemon.name}
        </option>
      ))}
    </select>
  )
}

export default PokemonSelect
