import { BYE_SENTINEL, gamesForPlayer } from './utilities.js';

import type { Game, Player } from './types.js';

function averageRatingOfOpponents(
  playerId: string,
  games: Game[][],
  players: Player[],
): number {
  const opponentRatings: number[] = [];
  for (const g of gamesForPlayer(playerId, games)) {
    if (g.blackId === BYE_SENTINEL || g.whiteId === BYE_SENTINEL) {
      continue;
    }
    const opponentId = g.whiteId === playerId ? g.blackId : g.whiteId;
    const opponent = players.find((p) => p.id === opponentId);
    if (opponent?.rating !== undefined) {
      opponentRatings.push(opponent.rating);
    }
  }
  if (opponentRatings.length === 0) {
    return 0;
  }
  const sum = opponentRatings.reduce((accumulator, r) => accumulator + r, 0);
  return Math.round(sum / opponentRatings.length);
}

function averageRatingOfOpponentsCut1(
  playerId: string,
  games: Game[][],
  players: Player[],
): number {
  const opponentRatings: number[] = [];
  for (const g of gamesForPlayer(playerId, games)) {
    if (g.blackId === BYE_SENTINEL || g.whiteId === BYE_SENTINEL) {
      continue;
    }
    const opponentId = g.whiteId === playerId ? g.blackId : g.whiteId;
    const opponent = players.find((p) => p.id === opponentId);
    if (opponent?.rating !== undefined) {
      opponentRatings.push(opponent.rating);
    }
  }
  if (opponentRatings.length === 0) {
    return 0;
  }
  const sorted = opponentRatings.toSorted((a, b) => a - b);
  const trimmed = sorted.slice(1);
  if (trimmed.length === 0) {
    return 0;
  }
  const sum = trimmed.reduce((accumulator, r) => accumulator + r, 0);
  return Math.round(sum / trimmed.length);
}

export { averageRatingOfOpponents, averageRatingOfOpponentsCut1 };

export type { Game, Player, Result } from './types.js';
