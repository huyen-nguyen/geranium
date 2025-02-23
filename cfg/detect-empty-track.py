import json
import re
import csv

# This file is SPECIFICALLY to see a particular empty track

def get_rules(node, parent_key, rules, grandparent_key="root", spec=None):
    ARRAY_PROPERTIES = [
        'assembly', 'attributesToFields', 'categories', 'customFields', 'dashed', 'domain[color]', 
        'domain[row]', 'domain[stroke]', 'domain[y]', 'exonIntervalFields', 'fields', 'genomicFields', 
        'genomicFieldsToConvert', 'headerNames', 'inRange', 'interval', 'oneOf', 'range[color]', 
        'range[geneLabelColor]', 'range[size]', 'range[strandColor]', 'range[stroke]', 'range[y]', 
        'replace', 'responsiveSpec', 'tooltip', 'valueFields', 'values', 'visibility', 'zoomLimits'
    ]
    
    NUMBER_PROPERTIES = [
        'backgroundOpacity', 'binSize', 'centerRadius', 'dx', 'dy', 'height', 'maxInsertSize', 'maxRows', 
        'opacity', 'outlineWidth', 'padding', 'sampleLength', 'size', 'spacing', 'strokeWidth', 'textFontSize', 
        'textStrokeWidth', 'value[flag]', 'value[geneHeight]', 'value[geneLabelFontSize]', 
        'value[geneLabelOpacity]', 'value[geneLabelStrokeThickness]', 'value[opacity]', 'value[size]', 
        'value[strokeWidth]', 'value[y]', 'width', 'xOffset', 'yOffset'
    ]

    STRING_PROPERTIES = [
        'background', 'baseGenomicField', 'baseline', 'chromosome', 'chromosomeField', 'chromosomePrefix', 
        'color', 'column', 'description', 'end', 'endField', 'field', 'genomicField', 'genomicLengthField', 
        'groupMarksByField', 'id', 'include', 'indexUrl', 'legendTitle', 'linkingId', 'longToWideId', 
        'newField', 'outline', 'range[color]', 'row', 'separator', 'start', 'startField', 'stroke', 
        'subtitle', 'template', 'title', 'url', 'value[color]', 'value[data]', 'value[flag]', 
        'value[geneLabelStroke]', 'value[stainStroke]', 'value[stroke]', 'value[text]'
    ]

    KEYS_WITH_GRANDPARENTS = ["domain", "range", "type", "value"]
            
    # Adjust the key if it belongs to "KEYS_WITH_GRANDPARENTS": same key (parent), different grandparents
    adjusted_key = f"{parent_key}[{grandparent_key}]" if parent_key in KEYS_WITH_GRANDPARENTS else parent_key # LHS
    rhs = ' "+" '.join(sorted(node.keys()))  # RHS

    this_rule = adjusted_key + ' -> ' + rhs
    rules.append(this_rule)

    # Only detect and print **truly empty** RHS rules
    if not rhs:  
        print(f"\n🚨 Empty RHS detected for rule 1: {adjusted_key} -> [EMPTY]")
        if spec:  
            print("🔍 Full spec containing the empty rule:")
            print(json.dumps(spec, indent=2))

    # Recursively process child nodes
    for k in sorted(node.keys()):
        v = node[k]

        # Detect **actual** empty RHS
        if isinstance(v, dict) and not v:  # If v is an empty dict {}
            print(f"\n🚨 Empty RHS detected for rule 2: {k} -> [EMPTY]")
            if spec:
                print("🔍 Full spec containing the empty rule:")
                print(json.dumps(spec, indent=2))

        new_parent = f"{k}[{parent_key}]" if k in KEYS_WITH_GRANDPARENTS else k
            
        if isinstance(v, dict):
            # Recurse if the value is a dictionary (JS object)
            get_rules(v, new_parent, rules, parent_key, spec=spec)
        
        elif isinstance(v, list):
            # Handle list (JS array)
            if new_parent in ARRAY_PROPERTIES:
                rules.append(new_parent + ' -> ARRAY')  
            elif k in ["tracks", "views", "dataTransforms"]:                   # Special handling for tracks, views, dataTransform
                for index, item in enumerate(v):
                    if isinstance(item, dict):        # Ensure it's a dictionary before recursion
                        get_rules(item, k[:-1], rules, parent_key, spec=spec)             # Convert "tracks" -> "track" etc.
                    else:
                        rules.append(k[:-1] + ' -> ' + '"' + str(item) + '"')  # Terminal rule
            else:
                rules.append(new_parent + ' -> ' + str(v))   # Keep other lists as is
        else:
            # Handle terminal rules
            if isinstance(v, bool):            # Check boolean first, since True is treated as 1 in arithmetic operations
                rules.append(new_parent + ' -> ' + '"' + str(v) + '"')  # keep as is
            elif new_parent in NUMBER_PROPERTIES and isinstance(v, (int, float)):
                rules.append(new_parent + ' -> NUMBER')
            elif new_parent in STRING_PROPERTIES and isinstance(v, str):
                rules.append(new_parent + ' -> STRING')
            else:
                rules.append(new_parent + ' -> ' + '"' + str(v) + '"')



def extract_rules(inputfile):
# def extract_rules(inputfile, outputfile, output_tsv):
    specs = []
    with open(inputfile, 'r') as inputs:
        for line in inputs:
            try:
                spec = json.loads(line)
                specs.append(spec)
            except Exception as e:
                print(f"Error parsing JSON: {e}")

    print(f'Length of specs: {len(specs)}')
    if not specs:
        print("No valid JSON objects found in the input file.")
        return

    allrules = {}
    max_rulelen = 0

    for spec in specs:
        rules = []
        get_rules(spec, 'root', rules, spec=spec)  # Pass the full spec

        for r in rules:
            if r not in allrules:
                allrules[r] = 0
            allrules[r] += 1

        max_rulelen = max(max_rulelen, len(rules))

    print(f'Max rule length: {max_rulelen}')
    print(f'Total unique rules extracted: {len(allrules)}')
    

    # Save rules to output text file
    allrules = sorted(allrules.keys())
    allrules.append('Nothing -> None')

    # No need to write
#     with open(outputfile, 'w') as outf:
#         for r in allrules:
#             outf.write(r + '\n')

#     print("Extraction complete. Rules written to file.")
    
    # Count distinct LHS
    lhs_set = {rule.split(' -> ', 1)[0] for rule in allrules}
    print(f"Total distinct LHS count: {len(lhs_set)}")

    
    # No need to write
    # Write to TSV file
#     with open(output_tsv, 'w', newline='') as tsvfile:
#         writer = csv.writer(tsvfile, delimiter='\t')
#         writer.writerow(["LHS", "->", "RHS"])  # Header row
#         for rule in allrules:
#             lhs, rhs = rule.split(' -> ', 1)  # Split into left and right side
#             writer.writerow([lhs, "->", rhs])

#     print(f"Rules saved in TSV format to {output_tsv}")
    

def rename_data_transform(obj):
    # Recursively rename "dataTransform" to "dataTransforms"
    if isinstance(obj, dict):
        for key in list(obj.keys()):
            if key == "dataTransform":
                obj["dataTransforms"] = obj.pop("dataTransform")
            else:
                rename_data_transform(obj[key])
    elif isinstance(obj, list):
        for item in obj:
            rename_data_transform(item)
            
extract_rules('gosling-specs.txt')