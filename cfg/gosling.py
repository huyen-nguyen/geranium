import json
import csv

def get_rules(node, parent_key, rules, grandparent_key="root"):
    ARRAY_PROPERTIES = [
        'assembly', 'attributesToFields', 'categories', 'customFields', 'dashed', 'domain[color]', 
        'domain[row]', 'domain[stroke]', 'domain[y]', 'exonIntervalFields', 'fields', 'genomicFields', 
        'genomicFieldsToConvert', 'headerNames', 'inRange', 'interval', 'oneOf', 'range[color]', 
        'range[geneLabelColor]', 'range[size]', 'range[strandColor]', 'range[stroke]', 'range[y]', 
        'replace', 'responsiveSpec', 'tooltip', 'valueFields', 'values', 'visibility', 'zoomLimits']
    
    NUMBER_PROPERTIES = [
        'backgroundOpacity', 'binSize', 'centerRadius', 'dx', 'dy', 'height', 'maxInsertSize', 'maxRows', 
        'opacity', 'outlineWidth', 'padding', 'sampleLength', 'size', 'spacing', 'strokeWidth', 'textFontSize', 
        'textStrokeWidth', 'value[flag]', 'value[geneHeight]', 'value[geneLabelFontSize]', 
        'value[geneLabelOpacity]', 'value[geneLabelStrokeThickness]', 'value[opacity]', 'value[size]', 
        'value[strokeWidth]', 'value[y]', 'width', 'xOffset', 'yOffset']

    STRING_PROPERTIES = [
        'background', 'baseGenomicField', 'baseline', 'chromosome', 'chromosomeField', 'chromosomePrefix', 
        'color', 'column', 'description', 'end', 'endField', 'field', 'genomicField', 'genomicLengthField', 
        'groupMarksByField', 'id', 'include', 'indexUrl', 'legendTitle', 'linkingId', 'longToWideId', 
        'newField', 'outline', 'range[color]', 'row', 'separator', 'start', 'startField', 'stroke', 
        'subtitle', 'template', 'title', 'url', 'value[color]', 'value[data]', 'value[flag]', 
        'value[geneLabelStroke]', 'value[stainStroke]', 'value[stroke]', 'value[text]']

    KEYS_WITH_GRANDPARENTS = ["domain", "range", "type", "value"]
    
    # Adjust the key if it belongs to "KEYS_WITH_GRANDPARENTS"
    adjusted_key = f"{parent_key}[{grandparent_key}]" if parent_key in KEYS_WITH_GRANDPARENTS else parent_key # LHS
    rhs = ' "+" '.join(sorted(node.keys()))  # Construct RHS

    this_rule = adjusted_key + ' -> ' + rhs
    rules.append(this_rule)

    # Recursively process child nodes
    for k in sorted(node.keys()):
        v = node[k]
        new_parent = f"{k}[{parent_key}]" if k in KEYS_WITH_GRANDPARENTS else k
            
        if isinstance(v, dict):
            # Recurse if the value is a dictionary (JS object)
            get_rules(v, new_parent, rules, parent_key)
        
        elif isinstance(v, list):
            # Handle list (JS array)
            if new_parent in ARRAY_PROPERTIES:
                rules.append(new_parent + ' -> ARRAY')  
            elif k in ["tracks", "views"]: # Special handling for tracks, views, dataTransform
                for index, item in enumerate(v):
                    if isinstance(item, dict):               # Ensure it's a dictionary before recursion
                        get_rules(item, k[:-1], rules, parent_key)             # Convert "tracks" -> "track" etc.
                    else:
                        rules.append(k[:-1] + ' -> ' + '"' + str(item) + '"')  # Terminal rule
            else:
                rules.append(new_parent + ' -> ' + str(v))   # Keep other lists as is
        else:
            # Handle terminal rules
            if new_parent in NUMBER_PROPERTIES and isinstance(v, (int, float)):
                rules.append(new_parent + ' -> NUMBER')
            elif new_parent in STRING_PROPERTIES and isinstance(v, str):
                rules.append(new_parent + ' -> STRING')
            else:
                rules.append(new_parent + ' -> ' + '"' + str(v) + '"')

def extract_rules(input_file, output_file, output_tsv):
    specs = []

    # Read and parse JSON specs
    with open(input_file, 'r') as inputs:
        for line in inputs:
            try:
                spec = json.loads(line)
                rename_data_transform(spec) # Rename "dataTransform" to "dataTransforms"
                specs.append(spec)
            except Exception as e:
                print(f"Error parsing JSON: {e}")

    print(f'Total specs: {len(specs)}')
    if not specs:
        print("No valid JSON objects found in the input file.")
        return

    all_rules = {}
    max_rule_len = 0

    # Generate rules from specs
    for spec in specs:
        rules = []
        get_rules(spec, 'root', rules)
        
        for r in rules:
            all_rules[r] = all_rules.get(r, 0) + 1
        
        max_rule_len = max(max_rule_len, len(rules))

    print(f'Max rule length: {max_rule_len}')
    print(f'Total unique rules extracted: {len(all_rules)}')

    all_rules = sorted(all_rules.keys())
    all_rules.append('Nothing -> None')  # Placeholder for empty or default cases
    
    # Count distinct LHS
    lhs_set = {rule.split(' -> ', 1)[0] for rule in all_rules}
    print(f"Total distinct LHS count: {len(lhs_set)}")

    # Write rules to a text file
    with open(output_file, 'w') as outf:
        for r in all_rules:
            outf.write(r + '\n')

    print("Extraction complete. Rules written to file.")
    
    # Write rules to a TSV file
    with open(output_tsv, 'w', newline='') as tsv_file:
        writer = csv.writer(tsv_file, delimiter='\t')
        writer.writerow(["LHS", "->", "RHS"])
        for rule in all_rules:
            lhs, rhs = rule.split(' -> ', 1)
            writer.writerow([lhs, "->", rhs])

    print(f"Rules saved in TSV format to {output_tsv}")

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

# Extract rules from input file
extract_rules('gosling-specs.txt', 'gosling-cfg-rules.txt', 'gosling-cfg-rules.tsv')