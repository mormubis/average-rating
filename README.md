# Average Rating

[![npm](https://img.shields.io/npm/v/@echecs/average-rating)](https://www.npmjs.com/package/@echecs/average-rating)
[![Test](https://github.com/mormubis/average-rating/actions/workflows/test.yml/badge.svg)](https://github.com/mormubis/average-rating/actions/workflows/test.yml)
[![Coverage](https://codecov.io/gh/mormubis/average-rating/branch/main/graph/badge.svg)](https://codecov.io/gh/mormubis/average-rating)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Average Rating** is a TypeScript library implementing the Average Rating of
Opponents tiebreaks for chess tournaments, following the
[FIDE Tiebreak Regulations](https://handbook.fide.com/chapter/TieBreakRegulations032026)
(section 10.1). Zero runtime dependencies.

## Installation

```bash
npm install @echecs/average-rating
```

## Quick Start

```typescript
import { averageRatingOfOpponents } from '@echecs/average-rating';

const players = [
  { id: 'A', rating: 1800 },
  { id: 'B', rating: 1600 },
  { id: 'C', rating: 1700 },
  { id: 'D', rating: 1900 },
];
// games[n] = round n+1; Game has no `round` field
const games = [
  [{ blackId: 'B', result: 1, whiteId: 'A' }], // round 1
  [{ blackId: 'C', result: 0.5, whiteId: 'A' }], // round 2
  [{ blackId: 'A', result: 0, whiteId: 'D' }], // round 3
];

const avg = averageRatingOfOpponents('A', games, players);
// Returns Math.round((1600 + 1700 + 1900) / 3) = 1733
```

## API

All functions require a `players` array whose entries carry a `rating` field.
They return `0` when no rated opponents have been faced. Round is determined by
array position: `games[0]` = round 1, `games[1]` = round 2, etc. The `Game` type
has no `round` field.

### `averageRatingOfOpponents(playerId, games, players)`

**FIDE section 10.1** — Average FIDE rating of all opponents faced by
`playerId`. Byes are excluded. Opponents not found in `players` or without a
`rating` are skipped. Returns the rounded integer average.

```typescript
averageRatingOfOpponents(playerId: string, games: Game[][], players: Player[]): number
```

### `averageRatingOfOpponentsCut1(playerId, games, players)`

**FIDE section 10.6** — Average rating of opponents minus the lowest-rated one.
Collects all opponent ratings, removes the single lowest, then returns the
rounded integer average of the remainder. Returns `0` if only one rated opponent
was faced.

```typescript
averageRatingOfOpponentsCut1(playerId: string, games: Game[][], players: Player[]): number
```

## Contributing

Contributions are welcome. Please open an issue at
[github.com/mormubis/average-rating/issues](https://github.com/mormubis/average-rating/issues).
