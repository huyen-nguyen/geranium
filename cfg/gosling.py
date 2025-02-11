import json
import re
import csv

# extracting CFG rules from a JSON structure by recursively processing each key-value pair
# parent_key -> child_keys

def get_rules(node, parentkey, rules):
    ignored_list = ["attributesToFields", "categories", "chromosomeField", "chromosomePrefix", "column", "customFields", "end", "exonIntervalFields", 
                "genomicFields", "genomicFieldsToConvert", "groupMarksByField", "headerNames", "id", "indexUrl", "loadMates", "longToWideId", 
                "maxInsertSize", "row", "separator", "size", "start", "url", "valueFields", "values", "visibility"]
    
    number_type_property = ['backgroundOpacity', 'binSize', 'centerRadius', 'height', 'sampleLength', 'spacing', 'width']
    
    string_type_property = ["background", "baseline", "chromosome", "color"]
        
    boolean_type_property = ["click", "dashed"]
    
    assembly_values = ["hg19","hg38","hg19","hg18","hg17","hg16","mm10","mm9"]

    
    thisrule = parentkey + ' -> ' + ' "+" '.join(sorted(node.keys()))
    
    lhs = thisrule.split(' -> ')[0]  # Extract LHS
    if lhs not in ignored_list:  # Skip if LHS is in ignored_list
        rules.append(thisrule)
    

    for k in sorted(node.keys()):
        v = node[k]
        lhs = k  # Left-hand side of the rule

        if lhs in ignored_list:  # Skip processing this key if in ignored_list
            continue
            
        if isinstance(v, dict):  # If the value is a dictionary, recurse
            get_rules(v, k, rules)
        elif isinstance(v, list):  # If the value is a list
            if k in boolean_type_property:
                rules.append(k + ' -> TRUE')  # Convert boolean properties correctly
            
            elif k in ["tracks", "views"]:  # Special handling for tracks and views
                for index, item in enumerate(v):
                    if isinstance(item, dict):  # Ensure it's a dictionary before recursion
                        get_rules(item, k[:-1], rules)  # Convert "tracks" -> "track"
                    else:
                        rules.append(k[:-1] + ' -> ' + '"' + str(item) + '"')  # Terminal rule
            else:
                rules.append(k + ' -> ' + str(v))  # Keep other lists as is
        else:
            # Special handling: Boolean values
            if k in boolean_type_property:
                rules.append(k + ' -> TRUE')
            
            # Special handling: replace value with "NUM"
            elif k in number_type_property and type(v) in (int, float):
                rules.append(k + ' -> NUM')
            
            # Special handling: replace value with "STR"
            elif k in string_type_property and isinstance(v, str):
                rules.append(k + ' -> STR')
            else:
                rules.append(k + ' -> ' + '"' + str(v) + '"')  # Terminal rule


def extract_rules(inputfile, outputfile, output_tsv):
    specs = []
    with open(inputfile, 'r') as inputs:
        for line in inputs:
            try:
                specs.append(json.loads(line))
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
        get_rules(spec, 'root', rules)
        print(f"Extracted rules for a spec: {rules}")  # Debugging line

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

    with open(outputfile, 'w') as outf:
        for r in allrules:
            outf.write(r + '\n')

    print("Extraction complete. Rules written to file.")
    
    # Count distinct LHS
    lhs_set = set()
    
    for rule in allrules:
        lhs, _ = rule.split(' -> ', 1)  # Extract LHS
        lhs_set.add(lhs)  # Store unique LHS
    
    print(f"Total distinct LHS count: {len(lhs_set)}")
    
    # Write to TSV file
    with open(output_tsv, 'w', newline='') as tsvfile:
        writer = csv.writer(tsvfile, delimiter='\t')
        writer.writerow(["LHS", "->", "RHS"])  # Header row
        for rule in allrules:
            lhs, rhs = rule.split(' -> ', 1)  # Split into left and right side
            writer.writerow([lhs, "->", rhs])

    print(f"Rules saved in TSV format to {output_tsv}")
            
extract_rules('gosling.txt', 'gosling-rules-cfg.txt', 'gosling-rules.tsv')