import { describe, expect, it } from 'vitest';

import {
  averageRatingOfOpponents,
  averageRatingOfOpponentsCut1,
} from '../index.js';

import type { Game, Player } from '../types.js';

// 4 players, 3 rounds with ratings:
// A(2400), B(2200), C(2000), D(2100)
// Round 1: A(W) 1-0 B, C(W) 0-1 D
// Round 2: A(W) 0.5-0.5 D, C(W) 0-1 B
// Round 3: A(W) 1-0 C, D(W) 1-0 B
const PLAYERS: Player[] = [
  { id: 'A', rating: 2400 },
  { id: 'B', rating: 2200 },
  { id: 'C', rating: 2000 },
  { id: 'D', rating: 2100 },
];

const GAMES: Game[][] = [
  [
    { blackId: 'B', result: 1, whiteId: 'A' },
    { blackId: 'D', result: 0, whiteId: 'C' },
  ],
  [
    { blackId: 'D', result: 0.5, whiteId: 'A' },
    { blackId: 'B', result: 0, whiteId: 'C' },
  ],
  [
    { blackId: 'C', result: 1, whiteId: 'A' },
    { blackId: 'B', result: 1, whiteId: 'D' },
  ],
];

describe('averageRatingOfOpponents', () => {
  it("returns average of OTB opponents' ratings rounded to nearest integer", () => {
    // A played B(2200), D(2100), C(2000) → (2200+2100+2000)/3 = 6300/3 = 2100
    expect(averageRatingOfOpponents('A', GAMES, PLAYERS)).toBe(2100);
  });

  it('handles player with no games', () => {
    expect(averageRatingOfOpponents('A', [], PLAYERS)).toBe(0);
  });
});

describe('averageRatingOfOpponentsCut1', () => {
  it('drops lowest-rated opponent and averages the rest', () => {
    // A played B(2200), D(2100), C(2000) → sorted: [2000, 2100, 2200]
    // drop lowest (2000) → (2100+2200)/2 = 4300/2 = 2150
    expect(averageRatingOfOpponentsCut1('A', GAMES, PLAYERS)).toBe(2150);
  });

  it('returns 0 when only one opponent (all cut)', () => {
    const games: Game[][] = [[{ blackId: 'B', result: 1, whiteId: 'A' }]];
    expect(averageRatingOfOpponentsCut1('A', games, PLAYERS)).toBe(0);
  });
});
