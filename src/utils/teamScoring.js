// src/utils/teamScoring.js

import {
  getAllWeaknesses,
  getAllResistances,
  uniqueArray,
  countSharedItems,
  filterPlayablePokemon,
} from "./pokemonHelpers";

function calculateDefensiveSupportScore(basePokemon, candidatePokemon) {
  const baseWeaknesses = getAllWeaknesses(basePokemon);
  const candidateResistances = getAllResistances(candidatePokemon);

  let score = 0;

  baseWeaknesses.forEach((weakness) => {
    if (candidateResistances.includes(weakness)) {
      score += 10;
    }
  });

  return score;
}

function calculateOffensiveCoverageScore(team) {
  const coverage = team.flatMap((pokemon) => {
    return pokemon.offensive_coverage?.super_effective_against || [];
  });

  return uniqueArray(coverage).length * 4;
}

function calculateSharedWeaknessPenalty(team) {
  const weaknesses = team.flatMap((pokemon) => getAllWeaknesses(pokemon));
  const weaknessCount = countSharedItems(weaknesses);

  let penalty = 0;

  Object.values(weaknessCount).forEach((count) => {
    if (count === 2) penalty += 10;
    if (count >= 3) penalty += 25;
  });

  return penalty;
}

function calculateRoleBalanceScore(team) {
  const roles = uniqueArray(team.map((pokemon) => pokemon.role).filter(Boolean));

  return roles.length * 8;
}

function calculateStatBalanceScore(team) {
  const avgStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    sp_attack: 0,
    sp_defense: 0,
    speed: 0,
  };

  team.forEach((pokemon) => {
    avgStats.hp += Number(pokemon.hp || 0);
    avgStats.attack += Number(pokemon.attack || 0);
    avgStats.defense += Number(pokemon.defense || 0);
    avgStats.sp_attack += Number(pokemon.sp_attack || 0);
    avgStats.sp_defense += Number(pokemon.sp_defense || 0);
    avgStats.speed += Number(pokemon.speed || 0);
  });

  Object.keys(avgStats).forEach((key) => {
    avgStats[key] = avgStats[key] / team.length;
  });

  const hasGoodSpeed = avgStats.speed >= 70;
  const hasGoodBulk = (avgStats.hp + avgStats.defense + avgStats.sp_defense) / 3 >= 70;
  const hasGoodOffense = Math.max(avgStats.attack, avgStats.sp_attack) >= 80;

  let score = 0;

  if (hasGoodSpeed) score += 8;
  if (hasGoodBulk) score += 8;
  if (hasGoodOffense) score += 8;

  return score;
}

function calculateLegendaryPenalty(team) {
  const legendaryCount = team.filter((pokemon) => pokemon.is_legendary || pokemon.is_mythical).length;

  return legendaryCount * 8;
}

export function calculateTeamScore(team, options = {}) {
  const { applyLegendaryPenalty = true } = options;

  if (!team || team.length === 0) {
    return {
      totalScore: 0,
      offensiveCoverageScore: 0,
      roleBalanceScore: 0,
      statBalanceScore: 0,
      sharedWeaknessPenalty: 0,
      legendaryPenalty: 0,
      sharedWeaknesses: {},
      offensiveCoverage: [],
    };
  }

  const offensiveCoverageScore = calculateOffensiveCoverageScore(team);
  const roleBalanceScore = calculateRoleBalanceScore(team);
  const statBalanceScore = calculateStatBalanceScore(team);
  const sharedWeaknessPenalty = calculateSharedWeaknessPenalty(team);
  const legendaryPenalty = applyLegendaryPenalty ? calculateLegendaryPenalty(team) : 0;

  const weaknesses = team.flatMap((pokemon) => getAllWeaknesses(pokemon));
  const sharedWeaknesses = Object.entries(countSharedItems(weaknesses))
    .filter(([, count]) => count > 1)
    .reduce((acc, [type, count]) => {
      acc[type] = count;
      return acc;
    }, {});

  const offensiveCoverage = uniqueArray(
    team.flatMap((pokemon) => pokemon.offensive_coverage?.super_effective_against || [])
  );

  const totalScore =
    offensiveCoverageScore +
    roleBalanceScore +
    statBalanceScore -
    sharedWeaknessPenalty -
    legendaryPenalty;

  return {
    totalScore,
    offensiveCoverageScore,
    roleBalanceScore,
    statBalanceScore,
    sharedWeaknessPenalty,
    legendaryPenalty,
    sharedWeaknesses,
    offensiveCoverage,
  };
}

export function recommendTeam(basePokemon, pokemonList, options = {}) {
  if (!basePokemon || !pokemonList?.length) return null;

  const {
    excludeLegendary = false,
    excludeMythical = false,
    generation = "all",
    limit = 10,
  } = options;

  const candidates = filterPlayablePokemon(pokemonList, {
    excludeLegendary,
    excludeMythical,
    generation,
  }).filter((pokemon) => pokemon.name !== basePokemon.name);

  const pairScores = [];

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const candidateA = candidates[i];
      const candidateB = candidates[j];

      const team = [basePokemon, candidateA, candidateB];

      const supportScore =
        calculateDefensiveSupportScore(basePokemon, candidateA) +
        calculateDefensiveSupportScore(basePokemon, candidateB);

      const teamScore = calculateTeamScore(team);

      pairScores.push({
        team,
        score: teamScore.totalScore + supportScore,
        detail: {
          ...teamScore,
          defensiveSupportScore: supportScore,
        },
      });
    }
  }

  return pairScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}