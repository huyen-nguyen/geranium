#!/bin/sh

SCALE="0.7;1.0;1.2"
SCALEWIDTH="0.7;1.0;1.2"

# Iterate over all JSON files in the geranium_seeds directory
for json_file in ./rerun_specs/*.json; do
    python generate_specs.py -f "$json_file" -cc -s $SCALE -sw $SCALEWIDTH
done