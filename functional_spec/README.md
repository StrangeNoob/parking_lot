# Functional Tests

This directory contains the functional test suite for the parking lot system.
Each scenario is a pair of files: an input command file and the expected STDOUT output.

## Structure

```
functional_spec/
├── inputs/                          # Command files fed to bin/parking_lot
│   ├── scenario_01_example.txt      # Problem statement example (verbatim)
│   ├── scenario_02_single_slot.txt  # Edge case: lot with one slot
│   ├── scenario_03_nearest_slot.txt # Nearest-slot re-allocation after leaves
│   └── scenario_04_not_found.txt    # Colour / registration queries with no match
└── expected_output/                 # Expected STDOUT for each matching input
    ├── scenario_01_example.txt
    ├── scenario_02_single_slot.txt
    ├── scenario_03_nearest_slot.txt
    └── scenario_04_not_found.txt
```

## Running the Functional Tests

From the project root:

```bash
bin/run_functional_tests
```

The runner:
1. Iterates over every `*.txt` file in `functional_spec/inputs/`
2. Runs `bin/parking_lot <input_file>` and captures STDOUT
3. Diffs the output against the matching file in `functional_spec/expected_output/`
4. Reports PASS / FAIL per scenario and exits non-zero on any failure

## Adding a New Scenario

1. Create `functional_spec/inputs/scenario_NN_description.txt` with your commands.
2. Run `bin/parking_lot functional_spec/inputs/scenario_NN_description.txt` and verify the output looks correct.
3. Save that output to `functional_spec/expected_output/scenario_NN_description.txt`.
4. Re-run `bin/run_functional_tests` to confirm it passes.
