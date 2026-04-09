# AGENTS.md

Agent guidance for the `@echecs/average-rating` repository — a TypeScript
library implementing the Average Rating of Opponents tiebreaks following FIDE
Tiebreak Regulations (sections 10.1 and 10.6).

**See also:** [`REFERENCES.md`](REFERENCES.md) | [`SPEC.md`](SPEC.md)

See the root `AGENTS.md` for workspace-wide conventions.

**Backlog:** tracked in
[GitHub Issues](https://github.com/mormubis/average-rating/issues).

---

## Project Overview

Pure calculation library, no runtime dependencies. Exports two functions:

| Function                       | FIDE section | Description                                            |
| ------------------------------ | ------------ | ------------------------------------------------------ |
| `averageRatingOfOpponents`     | 10.1         | Average FIDE rating of all opponents faced             |
| `averageRatingOfOpponentsCut1` | 10.6         | Average rating of opponents minus the lowest-rated one |

All functions conform to the signature:

```ts
(playerId: string, games: Game[][], players: Player[]) => number;
```

`Game[][]` is a round-indexed structure: `games[0]` contains round-1 games,
`games[1]` contains round-2 games, and so on. The `Game` type no longer has a
`round` field — round is determined by array position.

The `Game` type carries an optional `kind?: GameKind` field. When present it
identifies the nature of an unplayed round (e.g. `'half-bye'`, `'full-bye'`,
`'forfeit-win'`, `'forfeit-loss'`, `'zero-bye'`, `'pairing-bye'`). Byes are
excluded from ARO calculations regardless of `kind`.

`Player` objects **must** carry a `rating` field (number). Functions return `0`
when the player has faced no rated opponents.

FIDE reference: https://handbook.fide.com/chapter/TieBreakRegulations032026
(sections 10.1 and 10.6 — Average Rating of Opponents)

All source lives in `src/index.ts`; tests in `src/__tests__/index.spec.ts`.

---

## Commands

### Build

```bash
pnpm run build          # bundle TypeScript → dist/ via tsdown
```

### Test

```bash
pnpm run test                          # run all tests once
pnpm run test:watch                    # watch mode
pnpm run test:coverage                 # with coverage report

# Run a single test file
pnpm run test src/__tests__/index.spec.ts

# Run a single test by name (substring match)
pnpm run test -- --reporter=verbose -t "averageRatingOfOpponents"
```

### Lint & Format

```bash
pnpm run lint           # ESLint + tsc type-check (auto-fixes style issues)
pnpm run lint:ci        # strict — zero warnings allowed, no auto-fix
pnpm run lint:style     # ESLint only (auto-fixes)
pnpm run lint:types     # tsc --noEmit type-check only
pnpm run format         # Prettier (writes changes)
pnpm run format:ci      # Prettier check only (no writes)
```

### Full pre-PR check

```bash
pnpm lint && pnpm test && pnpm build
```

---

## Architecture Notes

- Both functions look up each opponent in the `players` array by id and read
  their `rating`. Opponents not found in `players` (or with no rating) are
  skipped.
- A `Game` with `black: ''` (empty string) represents a **bye**. Byes are
  excluded from the average — there is no rated opponent.
- `averageRatingOfOpponentsCut1` collects all opponent ratings, removes the
  single lowest value, then returns the average of the remainder. If only one
  opponent was rated, the cut produces `0` (no opponents left to average).
- Ratings are averaged as-is; no minimum rating floor is applied by this
  library. If FIDE minimum-rating rules apply, the caller should pre-process the
  `players` array before passing it.
- **No runtime dependencies** — keep it that way.
- **ESM-only** — the package ships only ESM. Do not add a CJS build.

---

## Tiebreak Signature

All tiebreak functions consumed by `@echecs/tournament` must conform to:

```typescript
(playerId: string, games: Game[], players: Map<string, Player>) => number;
```

---

## Validation

Input validation is provided by TypeScript's strict type system at compile time.
There is no runtime validation library. Do not add runtime type-checking guards
unless there is an explicit trust boundary (user-supplied strings, external
data).

---

## Error Handling

All functions are pure calculations and do not throw. When no rated opponents
are found the functions return `0` rather than throwing.
