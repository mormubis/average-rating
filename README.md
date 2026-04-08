# Average Rating

[![npm](https://img.shields.io/npm/v/@echecs/average-rating)](https://www.npmjs.com/package/@echecs/average-rating)
[![Coverage](https://codecov.io/gh/mormubis/average-rating/branch/main/graph/badge.svg)](https://codecov.io/gh/mormubis/average-rating)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Average Rating** is a TypeScript library implementing the Average Rating of
Opponents tiebreaks for chess tournaments, following the
[FIDE Tiebreak Regulations](https://handbook.fide.com/chapter/TieBreakRegulations032026)
(sections 10.1 and 10.6). Zero runtime dependencies.

## Installation

```bash
npm install @echecs/average-rating
```

## Quick Start

### Main export — `@echecs/average-rating`

```typescript
import { averageRatingOfOpponents } from '@echecs/average-rating';
import type { Game, GameKind } from '@echecs/average-rating';

const players = [
  { id: 'A', rating: 1800 },
  { id: 'B', rating: 1600 },
  { id: 'C', rating: 1700 },
  { id: 'D', rating: 1900 },
];
// games[n] = round n+1; Game has no `round` field
const games: Game[][] = [
  [{ black: 'B', result: 1, white: 'A' }], // round 1
  [{ black: 'C', result: 0.5, white: 'A' }], // round 2
  [{ black: 'A', result: 0, white: 'D' }], // round 3
  // Byes excluded from ARO regardless of kind
  [{ black: '', kind: 'half-bye', result: 0.5, white: 'A' }], // round 4
];

const avg = averageRatingOfOpponents('A', games, players);
// Returns Math.round((1600 + 1700 + 1900) / 3) = 1733
```

### Cut-1 subpath — `@echecs/average-rating/cut1`

```typescript
import { averageRatingOfOpponentsCut1 } from '@echecs/average-rating/cut1';

const avg = averageRatingOfOpponentsCut1('A', games, players);
// Returns Math.round((1700 + 1900) / 2) = 1800
// (lowest-rated opponent, B at 1600, is excluded)
```

## API

All functions share the same signature:

```typescript
(playerId: string, games: Game[][], players: Player[]): number
```

They require a `players` array whose entries carry a `rating` field. They return
`0` when no rated opponents have been faced. Round is determined by array
position: `games[0]` = round 1, `games[1]` = round 2, etc. The `Game` type has
no `round` field. The optional `kind?: GameKind` field on `Game` classifies
unplayed rounds; byes are excluded from all ARO calculations.

### `@echecs/average-rating`

#### `averageRatingOfOpponents(playerId, games, players)`

**FIDE section 10.1** — Average FIDE rating of all opponents faced by
`playerId`. Byes are excluded. Opponents not found in `players` or without a
`rating` are skipped. Returns the rounded integer average.

```typescript
import { averageRatingOfOpponents } from '@echecs/average-rating';
```

### `@echecs/average-rating/cut1`

#### `averageRatingOfOpponentsCut1(playerId, games, players)`

**FIDE section 10.6** — Average rating of opponents minus the lowest-rated one.
Collects all opponent ratings, removes the single lowest, then returns the
rounded integer average of the remainder. Returns `0` if only one rated opponent
was faced.

```typescript
import { averageRatingOfOpponentsCut1 } from '@echecs/average-rating/cut1';
```

## Contributing

Contributions are welcome. Please open an issue at
[github.com/mormubis/average-rating/issues](https://github.com/mormubis/average-rating/issues).
