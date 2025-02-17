import json
import re
import csv

def get_rules(node, parentkey, rules, grandparent_key="root", spec=None):
    """Recursive function to extract the CFG rules: LHS -> RHS for each node encountered."""
    NUMBER_PROPERTIES = ['backgroundOpacity', 'binSize', 'centerRadius', 'dx', 'dy', 'height', "opacity", "outlineWidth", "padding",'sampleLength', 'spacing', 'strokeWidth', 'textFontSize', 'textStrokeWidth', 'width', 'value[geneHeight]', 'value[geneLabelFontSize]', 'value[geneLabelOpacity]', 'value[geneLabelStrokeThickness]', 'value[opacity]',  'value[strokeWidth]', 'value[y]', 'xOffset', 'yOffset',
                         # from ignore list
                         "maxInsertSize", "size", 
                        # extended from ignore
                         "value[size]"]
    
    STRING_PROPERTIES = ["background", "baseline", "chromosome", "color", "description", "field",  "legendTitle", "linkingId", "outline", "range[color]", "stroke", "subtitle", "template", "title", "value[color]", "value[data]", "value[geneLabelStroke]", "value[stainStroke]",  "value[stroke]", "value[text]", 
                         # from ignore list
                         "chromosomeField", "chromosomePrefix", "column", "end",  "groupMarksByField", "id", "indexUrl", "longToWideId", "row", "separator", "start", "url"]
    
    ARRAY_PROPERTIES = ["assembly", "dashed", "domain[color]", "domain[stroke]", "domain[y]", "interval", "range[color]", "range[geneLabelColor]", "range[strandColor]", "range[stroke]", "range[y]", "tooltip", "visibility", "zoomLimits",
                        # from ignore list
                        # A1, terminal symbol
                        "categories",  "customFields", "genomicFields", "headerNames", 
                        
                        # A2c, objects
                        "attributesToFields",  "exonIntervalFields", "genomicFieldsToConvert", "responsiveSpec", "valueFields", "values",
                        
                        # extended from ignore
                        "domain[row]", "range[size]"]
        
    KEYS_WITH_GRANDPARENTS = ["domain", "range", "type", "value"]
    
    # Adjust key if it is "type" or "value"
    adjusted_key = f"{parentkey}[{grandparent_key}]" if parentkey in KEYS_WITH_GRANDPARENTS else parentkey  # LHS
    rhs = ' "+" '.join(sorted(node.keys()))  # Construct RHS

    thisrule = adjusted_key + ' -> ' + rhs
    rules.append(thisrule)

    # Recursively process child nodes
    for k in sorted(node.keys()):
        v = node[k]

        lhs = k  # Left-hand side of the rule
        new_parent = f"{k}[{parentkey}]" if k in KEYS_WITH_GRANDPARENTS else k
            
        if isinstance(v, dict):  # If the value is a dictionary (object), recurse
            get_rules(v, new_parent, rules, parentkey)
        
        elif isinstance(v, list):  # If the value is a list (array)
            if new_parent in ARRAY_PROPERTIES:
                rules.append(new_parent + ' -> ARRAY')  
            elif k in ["tracks", "views"]:  # Special handling for tracks and views
                for index, item in enumerate(v):
                    if isinstance(item, dict):  # Ensure it's a dictionary before recursion
                        get_rules(item, k[:-1], rules, parentkey)  # Convert "tracks" -> "track"
                    else:
                        rules.append(k[:-1] + ' -> ' + '"' + str(item) + '"')  # Terminal rule
            elif k == "dataTransform":
                rules.append(new_parent + ' -> ' + extract_data_transform_types(v))
            else:
                rules.append(new_parent + ' -> ' + str(v))  # Keep other lists as is
        
        else:
            if new_parent in NUMBER_PROPERTIES and type(v) in (int, float):
                rules.append(new_parent + ' -> NUMBER')
            elif new_parent in STRING_PROPERTIES and isinstance(v, str):
                rules.append(new_parent + ' -> STRING')
            else:
                rules.append(new_parent + ' -> ' + '"' + str(v) + '"')  # Terminal rule



def extract_rules(inputfile, outputfile, output_tsv):
    specs = []
    with open(inputfile, 'r') as inputs:
        for line in inputs:
            try:
                specs.append(json.loads(line))
            except Exception as e:
                print(f"Error parsing JSON: {e}")

    print(f'Total specs: {len(specs)}')
    if not specs:
        print("No valid JSON objects found in the input file.")
        return

    allrules = {}
    max_rulelen = 0

    # Loop through all specs
    for spec in specs:
        rules = []
        get_rules(spec, 'root', rules)
        # print(f"Extracted rules for a spec: {rules}")  # Debugging line

        for r in rules:
            if r not in allrules:
                allrules[r] = 0
            allrules[r] += 1
        max_rulelen = max(max_rulelen, len(rules))

    print(f'Max rule length: {max_rulelen}')
    print(f'Total unique rules extracted: {len(allrules)}')

    allrules = sorted(allrules.keys())
    allrules.append('Nothing -> None') # Placeholder for empty or default cases
    
    # Count distinct LHS
    lhs_set = set()
    
    for rule in allrules:
        lhs, _ = rule.split(' -> ', 1)  # Extract LHS
        lhs_set.add(lhs)  # Store unique LHS
    
    print(f"Total distinct LHS count: {len(lhs_set)}")

    # Write to text file
    with open(outputfile, 'w') as outf:
        for r in allrules:
            outf.write(r + '\n')

    print("Extraction complete. Rules written to file.")
    
    # Write to TSV file
    with open(output_tsv, 'w', newline='') as tsvfile:
        writer = csv.writer(tsvfile, delimiter='\t')
        writer.writerow(["LHS", "->", "RHS"])  # Header row
        for rule in allrules:
            lhs, rhs = rule.split(' -> ', 1)  # Split into left and right side
            writer.writerow([lhs, "->", rhs])

    print(f"Rules saved in TSV format to {output_tsv}")
    

def extract_data_transform_types(data_transform):
    """
    Extracts the 'type' field from each dictionary in the given list and returns them as a comma-separated string.
    
    :param data_transform: List of dictionaries where each dictionary contains a 'type' key.
    :return: Comma-separated string of 'type' values.
    """
    if not isinstance(data_transform, list):
        return ""

    types = [item['type'] for item in data_transform if isinstance(item, dict) and 'type' in item]
    
    return ", ".join(types)
            
extract_rules('autogosling-specs.txt', 'autogosling-cfg-rules.txt', 'autogosling-cfg-rules.tsv')