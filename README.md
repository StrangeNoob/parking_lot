# Parking Lot

An automated parking lot ticketing system implemented in TypeScript / Node.js.

## Requirements

- Node.js >= 24.0.0 (LTS)
- npm

## Setup

Install dependencies, build, and run all tests:

```bash
bin/setup
```

## Running the Program

**File mode** — reads commands from a file and writes output to STDOUT:

```bash
bin/parking_lot file_inputs.txt
```

**Interactive shell** — accepts commands from STDIN line by line:

```bash
bin/parking_lot
```

Type `exit` to quit the interactive shell.

## Commands

| Command | Description |
|---|---|
| `create_parking_lot <n>` | Create a lot with `n` slots |
| `park <reg_no> <colour>` | Park a car; allocates the nearest free slot |
| `leave <slot_no>` | Free a slot |
| `status` | Print all occupied slots |
| `registration_numbers_for_cars_with_colour <colour>` | List registration numbers by colour |
| `slot_numbers_for_cars_with_colour <colour>` | List slot numbers by colour |
| `slot_number_for_registration_number <reg_no>` | Find slot for a registration number |
| `exit` | Quit the interactive shell |

## Example

```
$ bin/parking_lot file_inputs.txt
Created a parking lot with 6 slots
Allocated slot number: 1
Allocated slot number: 2
...
```

## Running Tests

```bash
npm test
```

For watch mode during development:

```bash
npm run test:watch
```

## Docker

Run the project without a local Node.js install:

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

## Project Structure

```
parking_lot/
├── bin/
│   ├── setup               # Install + build + run tests
│   ├── parking_lot         # Run the program
│   └── run_functional_tests # Functional test runner
├── src/
│   ├── MinHeap.ts          # Min-heap for O(log n) nearest-slot allocation
│   ├── ParkingLot.ts       # Core domain class
│   ├── CommandHandler.ts   # Command parsing and output formatting
│   └── index.ts            # Entry point (file mode / interactive shell)
├── dist/                   # Compiled JS output (git-ignored)
├── tests/
│   ├── MinHeap.test.ts
│   ├── ParkingLot.test.ts
│   └── CommandHandler.test.ts
├── file_inputs.txt         # Sample input
├── tsconfig.json
├── package.json
└── README.md
```

## Design Decisions

- **MinHeap for slot allocation** — guarantees the nearest (lowest-numbered) available slot is always found and restored in O(log n), making `park` and `leave` efficient even for large lots.
- **Separation of concerns** — `ParkingLot` holds only domain logic and returns plain result objects; `CommandHandler` owns all parsing and output formatting; `index.ts` owns all I/O.
- **1-indexed slots** — slots are numbered 1..n as per the spec; the internal array is 1-indexed with index 0 unused, keeping slot arithmetic direct and readable.
- **Case-insensitive colour lookup** — the spec examples use consistent casing, but the implementation normalises to lowercase for robustness.
- **No external runtime dependencies** — only TypeScript, Jest, and ts-jest are used, and only for development.
