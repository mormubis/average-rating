import { gamesForPlayer } from './utilities.js';

import type { Game, Player } from './types.js';

function averageRatingOfOpponentsCut1(
  player: string,
  games: Game[][],
  players: Player[],
): number {
  const opponentRatings: number[] = [];
  for (const g of gamesForPlayer(player, games)) {
    if (g.black === g.white) {
      continue;
    }
    const opponentId = g.white === player ? g.black : g.white;
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

export {
  averageRatingOfOpponentsCut1,
  averageRatingOfOpponentsCut1 as tiebreak,
};

export { type GameKind, type Result, type Game, type Player } from './types.js';
