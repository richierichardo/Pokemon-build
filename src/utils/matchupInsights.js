import { getAllResistances, getAllWeaknesses, getPokemonTypes } from "./pokemonHelpers";

function calculateVsTargetScore(candidate, target) {
  const candidateCoverage = candidate.offensive_coverage?.super_effective_against || [];
  const targetWeaknesses = getAllWeaknesses(target);
  const targetTypes = getPokemonTypes(target);
  const candidateResistances = getAllResistances(candidate);
  const candidateWeaknesses = getAllWeaknesses(candidate);

  let offenseAdvantage = 0;
  let defenseSafety = 0;
  let riskPenalty = 0;

  targetWeaknesses.forEach((type) => {
    if (candidateCoverage.includes(type)) offenseAdvantage += 10;
  });

  targetTypes.forEach((type) => {
    if (candidateResistances.includes(type)) defenseSafety += 8;
    if (candidateWeaknesses.includes(type)) riskPenalty += 8;
  });

  const statBonus = Number(candidate.base_stat_total || 0) >= 500 ? 8 : 3;
  const legendaryPenalty = candidate.is_legendary || candidate.is_mythical ? 4 : 0;

  const totalScore = offenseAdvantage + defenseSafety + statBonus - riskPenalty - legendaryPenalty;

  return {
    totalScore,
    offenseAdvantage,
    defenseSafety,
    riskPenalty,
  };
}

function rankAgainstTarget(targetPokemon, pokemonList) {
  if (!targetPokemon || !pokemonList?.length) return [];

  return pokemonList
    .filter((candidate) => candidate.name !== targetPokemon.name)
    .map((candidate) => ({
      pokemon: candidate,
      score: calculateVsTargetScore(candidate, targetPokemon),
    }))
    .sort((a, b) => b.score.totalScore - a.score.totalScore);
}

export function getTopCounters(targetPokemon, pokemonList, limit = 3) {
  return rankAgainstTarget(targetPokemon, pokemonList).slice(0, limit);
}

export function getTopWeakAgainst(targetPokemon, pokemonList, limit = 3) {
  const ranked = rankAgainstTarget(targetPokemon, pokemonList);
  return ranked.slice(-limit).reverse();
}
