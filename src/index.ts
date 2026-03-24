import { BYE_SENTINEL, gamesForPlayer } from './utilities.js';

import type { Game, Player } from './types.js';

function averageRatingOfOpponents(
  player: string,
  games: Game[][],
  players: Player[],
): number {
  const opponentRatings: number[] = [];
  for (const g of gamesForPlayer(player, games)) {
    if (g.black === BYE_SENTINEL || g.white === BYE_SENTINEL) {
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
  const sum = opponentRatings.reduce((accumulator, r) => accumulator + r, 0);
  return Math.round(sum / opponentRatings.length);
}

export { averageRatingOfOpponents, averageRatingOfOpponents as tiebreak };

export { type GameKind, type Result, type Game, type Player } from './types.js';
