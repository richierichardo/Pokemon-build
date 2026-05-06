// src/utils/pokemonHelpers.js

export function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

export function getPokemonTypes(pokemon) {
  if (!pokemon) return [];

  return [pokemon.type_1, pokemon.type_2].filter(Boolean);
}

export function getAllWeaknesses(pokemon) {
  if (!pokemon) return [];

  return [
    ...(pokemon.weaknesses_4x || []),
    ...(pokemon.weaknesses_2x || []),
  ];
}

export function getAllResistances(pokemon) {
  if (!pokemon) return [];

  const halfResistances = pokemon["resistances_0.5x"] || pokemon.resistances_0_5x || [];

  return [
    ...halfResistances,
    ...(pokemon.resistances_0_25x || []),
    ...(pokemon.immunities_0x || []),
  ];
}

export function countSharedItems(items) {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
}

export function uniqueArray(array) {
  return [...new Set(array)];
}

export function formatType(type) {
  if (!type) return "";

  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getPokemonDisplayName(pokemon) {
  if (!pokemon) return "";

  return pokemon.name || "Unknown Pokémon";
}

export function filterPlayablePokemon(pokemonList, options = {}) {
  const {
    excludeLegendary = false,
    excludeMythical = false,
    generation = "all",
  } = options;

  return pokemonList.filter((pokemon) => {
    if (excludeLegendary && pokemon.is_legendary) return false;
    if (excludeMythical && pokemon.is_mythical) return false;

    if (generation !== "all") {
      return Number(pokemon.generation) === Number(generation);
    }

    return true;
  });
}