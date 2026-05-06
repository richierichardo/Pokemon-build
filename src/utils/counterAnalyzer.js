// src/utils/counterAnalyzer.js

import {
  getAllWeaknesses,
  getAllResistances,
  countSharedItems,
  filterPlayablePokemon,
} from "./pokemonHelpers";

export function analyzeEnemyTeam(enemyTeam) {
  if (!enemyTeam || enemyTeam.length === 0) {
    return {
      enemyWeaknessCount: {},
      enemySharedWeaknesses: [],
      recommendedAttackTypes: [],
    };
  }

  const allWeaknesses = enemyTeam.flatMap((pokemon) => getAllWeaknesses(pokemon));
  const enemyWeaknessCount = countSharedItems(allWeaknesses);

  const enemySharedWeaknesses = Object.entries(enemyWeaknessCount)
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count }));

  const recommendedAttackTypes = Object.entries(enemyWeaknessCount)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count }));

  return {
    enemyWeaknessCount,
    enemySharedWeaknesses,
    recommendedAttackTypes,
  };
}

function calculateCounterScore(candidate, enemyTeam) {
  const candidateCoverage = candidate.offensive_coverage?.super_effective_against || [];
  const candidateWeaknesses = getAllWeaknesses(candidate);
  const candidateResistances = getAllResistances(candidate);

  let offensiveScore = 0;
  let defensiveScore = 0;
  let riskPenalty = 0;

  enemyTeam.forEach((enemy) => {
    const enemyTypes = [enemy.type_1, enemy.type_2].filter(Boolean);
    const enemyWeaknesses = getAllWeaknesses(enemy);

    enemyWeaknesses.forEach((weakness) => {
      if (candidateCoverage.includes(weakness)) {
        offensiveScore += 8;
      }
    });

    enemyTypes.forEach((enemyType) => {
      if (candidateResistances.includes(enemyType)) {
        defensiveScore += 6;
      }

      if (candidateWeaknesses.includes(enemyType)) {
        riskPenalty += 8;
      }
    });
  });

  const statScore =
    Number(candidate.base_stat_total || 0) >= 500
      ? 10
      : Number(candidate.base_stat_total || 0) >= 430
        ? 6
        : 2;

  const speedScore = Number(candidate.speed || 0) >= 90 ? 6 : 0;

  const legendaryPenalty = candidate.is_legendary || candidate.is_mythical ? 10 : 0;

  const totalScore =
    offensiveScore +
    defensiveScore +
    statScore +
    speedScore -
    riskPenalty -
    legendaryPenalty;

  return {
    totalScore,
    offensiveScore,
    defensiveScore,
    statScore,
    speedScore,
    riskPenalty,
    legendaryPenalty,
  };
}

export function recommendCounters(enemyTeam, pokemonList, options = {}) {
  if (!enemyTeam || enemyTeam.length === 0 || !pokemonList?.length) return [];

  const {
    excludeLegendary = false,
    excludeMythical = false,
    generation = "all",
    limit = 12,
  } = options;

  const enemyNames = enemyTeam.map((pokemon) => pokemon.name);

  const candidates = filterPlayablePokemon(pokemonList, {
    excludeLegendary,
    excludeMythical,
    generation,
  }).filter((pokemon) => !enemyNames.includes(pokemon.name));

  return candidates
    .map((candidate) => {
      const scoreDetail = calculateCounterScore(candidate, enemyTeam);

      return {
        pokemon: candidate,
        score: scoreDetail.totalScore,
        detail: scoreDetail,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function buildCounterTeam(enemyTeam, pokemonList, options = {}) {
  const counterCandidates = recommendCounters(enemyTeam, pokemonList, {
    ...options,
    limit: 30,
  });

  const selectedTeam = [];

  for (const candidate of counterCandidates) {
    if (selectedTeam.length >= 3) break;

    const candidateTypes = [candidate.pokemon.type_1, candidate.pokemon.type_2].filter(Boolean);

    const selectedTypes = selectedTeam.flatMap((item) => [
      item.pokemon.type_1,
      item.pokemon.type_2,
    ]).filter(Boolean);

    const hasTypeOverlap = candidateTypes.some((type) => selectedTypes.includes(type));

    if (!hasTypeOverlap || selectedTeam.length === 0) {
      selectedTeam.push(candidate);
    }
  }

  while (selectedTeam.length < 3 && counterCandidates.length > selectedTeam.length) {
    const nextCandidate = counterCandidates.find(
      (candidate) =>
        !selectedTeam.some((selected) => selected.pokemon.name === candidate.pokemon.name)
    );

    if (!nextCandidate) break;

    selectedTeam.push(nextCandidate);
  }

  return selectedTeam;
}