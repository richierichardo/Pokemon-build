import TypeBadge from "./TypeBadge"
import StatBar from "./StatBar"
import { getPokemonTypes, getPokemonDisplayName } from "../utils/pokemonHelpers"

function PokemonCard({ pokemon, compact = false }) {
  if (!pokemon) return null

  const types = getPokemonTypes(pokemon)
  const name = getPokemonDisplayName(pokemon)
  const weaknesses = [...(pokemon.weaknesses_4x || []), ...(pokemon.weaknesses_2x || [])]
  const resistances = [
    ...(pokemon["resistances_0.5x"] || []),
    ...(pokemon.resistances_0_25x || []),
    ...(pokemon.immunities_0x || []),
  ]

  return (
    <article className="pokemon-card">
      <div className="pokemon-header">
        <img src={pokemon.sprite_url} alt={name} width={72} height={72} />
        <div>
          <h3>{name}</h3>
          <div className="type-row">
            {types.map((type) => (
              <TypeBadge key={`${name}-${type}`} type={type} />
            ))}
          </div>
          <p className="pokemon-meta">
            Gen {pokemon.generation ?? "?"} • {pokemon.role || "Generalist"} • BST{" "}
            {pokemon.base_stat_total || 0}
          </p>
        </div>
      </div>

      {!compact && (
        <>
          <div className="stats-grid">
            <StatBar label="HP" value={pokemon.hp} />
            <StatBar label="ATK" value={pokemon.attack} />
            <StatBar label="DEF" value={pokemon.defense} />
            <StatBar label="SPA" value={pokemon.sp_attack} />
            <StatBar label="SPD" value={pokemon.sp_defense} />
            <StatBar label="SPE" value={pokemon.speed} />
          </div>
          <div className="matchup-rows">
            <p>
              <strong>Weak to:</strong> {weaknesses.join(", ") || "-"}
            </p>
            <p>
              <strong>Resist / Immune:</strong> {resistances.join(", ") || "-"}
            </p>
          </div>
        </>
      )}
    </article>
  )
}

export default PokemonCard
