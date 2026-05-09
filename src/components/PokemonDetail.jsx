import { Link, useParams } from "react-router-dom";
import PokemonCard from "./PokemonCard";
import TypeBadge from "./TypeBadge";
import StatBar from "./StatBar";
import { findPokemonByRouteKey, getAllResistances, getAllWeaknesses, getPokemonTypes } from "../utils/pokemonHelpers";
import { getTopCounters, getTopWeakAgainst } from "../utils/matchupInsights";

function PokemonDetail({ pokemonList }) {
  const { pokemonName } = useParams();
  const pokemon = findPokemonByRouteKey(pokemonList, pokemonName);

  if (!pokemon) {
    return (
      <section className="panel detail-panel">
        <Link to="/" className="back-link">
          ← Back to Explorer
        </Link>
        <h2>Pokemon not found</h2>
        <p>Nama Pokemon tidak ditemukan di data yang tersedia.</p>
      </section>
    );
  }

  const weaknesses = getAllWeaknesses(pokemon);
  const resistances = getAllResistances(pokemon);
  const counters = getTopCounters(pokemon, pokemonList, 3);
  const weakAgainst = getTopWeakAgainst(pokemon, pokemonList, 3);

  return (
    <section className="panel detail-panel">
      <Link to="/" className="back-link">
        ← Back to Explorer
      </Link>

      <div className="detail-hero">
        <img src={pokemon.sprite_url} alt={pokemon.name} width={120} height={120} />
        <div>
          <h2>{pokemon.name}</h2>
          <div className="type-row">
            {getPokemonTypes(pokemon).map((type) => (
              <TypeBadge key={`${pokemon.name}-${type}`} type={type} />
            ))}
          </div>
          <p className="pokemon-meta">
            Gen {pokemon.generation ?? "?"} • {pokemon.role || "Generalist"} • BST {pokemon.base_stat_total || 0}
          </p>
        </div>
      </div>

      <div className="detail-two-col">
        <div className="detail-box">
          <h3>Base Stats</h3>
          <div className="stats-grid">
            <StatBar label="HP" value={pokemon.hp} />
            <StatBar label="ATK" value={pokemon.attack} />
            <StatBar label="DEF" value={pokemon.defense} />
            <StatBar label="SPA" value={pokemon.sp_attack} />
            <StatBar label="SPD" value={pokemon.sp_defense} />
            <StatBar label="SPE" value={pokemon.speed} />
          </div>
        </div>
        <div className="detail-box">
          <h3>Pokedex Notes</h3>
          <p>
            {pokemon.flavor_text?.trim()
              ? pokemon.flavor_text
              : "Flavor text belum tersedia di dataset saat ini."}
          </p>
          <p>
            <strong>Weak to:</strong> {weaknesses.join(", ") || "-"}
          </p>
          <p>
            <strong>Resist / Immune:</strong> {resistances.join(", ") || "-"}
          </p>
        </div>
      </div>

      <div className="detail-reco-grid">
        <div className="detail-box">
          <h3>Top 3 Counter Picks</h3>
          <div className="cards-grid">
            {counters.map((entry) => (
              <div key={`counter-${entry.pokemon.name}`}>
                <PokemonCard pokemon={entry.pokemon} compact clickable />
                <p className="counter-meta">Score: {entry.score.totalScore}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="detail-box">
          <h3>Top 3 Weak Matchups</h3>
          <div className="cards-grid">
            {weakAgainst.map((entry) => (
              <div key={`weak-${entry.pokemon.name}`}>
                <PokemonCard pokemon={entry.pokemon} compact clickable />
                <p className="counter-meta">Score: {entry.score.totalScore}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PokemonDetail;
