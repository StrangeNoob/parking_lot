# CLAUDE.md — Parking Lot System

## Project Overview

Automated parking lot ticketing system in TypeScript / Node.js. Allocates the nearest available slot using a min-heap. Supports file-based and interactive (REPL) modes.

## Tech Stack

- **Language:** TypeScript (Node.js >= 24 LTS)
- **Package Manager:** npm
- **Test Framework:** Jest 29.7 + ts-jest
- **Runtime Dependencies:** None (only Node.js built-ins: `fs`, `readline`)

## Project Structure

```
src/
  index.ts            # Entry point (file mode / interactive REPL)
  ParkingLot.ts       # Core domain class (1-indexed slots, result objects)
  MinHeap.ts          # Min-heap for O(log n) slot allocation
  CommandHandler.ts   # Command parser and output formatter
dist/                 # Compiled JS output (git-ignored)
tests/
  MinHeap.test.ts
  ParkingLot.test.ts
  CommandHandler.test.ts
functional_spec/
  inputs/             # 4 scenario input files
  expected_output/    # 4 expected output files
bin/
  parking_lot         # Main executable
  setup               # Install + build + run all tests
  run_functional_tests # Functional test runner (diff-based)
```

## Common Commands

```bash
# Install dependencies
npm install

# Compile TypeScript to dist/
npm run build

# Run unit tests with coverage (builds first via pretest)
npm test

# Run tests in watch mode
npm run test:watch

# Run functional tests
bin/run_functional_tests

# Full setup (install + build + unit tests + functional tests)
bin/setup

# Run the program
bin/parking_lot file_inputs.txt   # File mode
bin/parking_lot                   # Interactive mode
```

## Architecture

- **ParkingLot** — Domain logic only. Returns plain `{success, slot, message}` result objects. No I/O.
- **CommandHandler** — Stateful parser/dispatcher. Translates text commands into ParkingLot method calls and formats output strings.
- **MinHeap** — Array-based binary min-heap. Guarantees lowest-numbered slot is always allocated first.
- **index.ts** — I/O orchestration. Delegates to CommandHandler.

## Code Conventions

- Semicolons required
- 2-space indentation
- **Classes:** PascalCase (`ParkingLot`, `MinHeap`)
- **Methods/variables:** camelCase (`slotNumberForRegistration`)
- **Private members:** `private` access modifier + leading underscore (`private _slots`, `private _bubbleUp`)
- **Constants:** UPPER_SNAKE_CASE
- JSDoc comments on public methods
- Section dividers: `// ─── Section Title ────────────`
- Strict TypeScript (`"strict": true` in tsconfig)
- ES module syntax (`import`/`export`), compiled to CommonJS
- No linter/formatter configured — style maintained manually

## Git Conventions

- **Main branch:** `main` (for PRs)
- **Commit style:** Conventional Commits — `<type>: <subject>`
  - `feat:` new features, `test:` test changes, `fix:` bug fixes, `refactor:` etc.

## Docker

```bash
# Build the production image
docker compose build app

# Run in file mode
docker compose run --rm app file_inputs.txt

# Run in interactive mode
docker compose run --rm -i app

# Run tests in watch mode (dev container)
docker compose run --rm dev

# Run tests once (dev container)
docker compose run --rm dev npm test

# Run functional tests (dev container)
docker compose run --rm dev bin/run_functional_tests
```

## Testing Notes

- Jest config lives in `package.json` (not a separate config file)
- Uses `ts-jest` preset to run TypeScript tests directly
- Test match pattern: `**/tests/**/*.test.ts`
- Coverage collected from `src/**/*.ts`
- `index.ts` has 0% unit coverage (I/O layer) — covered by functional tests
- Functional tests compare STDOUT against expected output files with whitespace normalization
