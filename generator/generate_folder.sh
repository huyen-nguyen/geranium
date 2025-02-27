#!/bin/sh

SCALE="0.7;1.0;1.2"
SCALEWIDTH="0.7;1.0;1.2"

# Iterate over all JSON files in the geranium_seeds directory
for json_file in chromoscope_specs/*.json; do
    # Call the Python script using each JSON file
    python generate_specs.py -f "$json_file" -pv -cc -s $SCALE -sw $SCALEWIDTH # full mutation besides change mark
done

# # Partial
# for json_file in geranium_seeds/full/*.json; do
#     # Call the Python script using each JSON file
#     python generate_specs.py -f "$json_file" -pv -s $SCALE -sw $SCALEWIDTH # full mutation besides change mark
# done

# # Iterate over all JSON files that ALREADY mutated sizes
# for json_file in ../data/chromoscope/specs/*.json; do
#     # Call the Python script using each JSON file
#     python generate_specs.py -f "$json_file" -cc # only color mutation
# done