import json

def get_rules(node, parentkey, rules):
    thisrule = parentkey + ' -> ' + ' "+" '.join(sorted(node.keys()))
    rules.append(thisrule)

    for k in sorted(node.keys()):
        v = node[k]
        if isinstance(v, dict):  # If the value is a dictionary, recurse
            get_rules(v, k, rules)
        elif isinstance(v, list):  # If the value is a list
            if k in ["tracks", "views"]:  # Special handling for tracks and views
                for index, item in enumerate(v):
                    if isinstance(item, dict):  # Ensure it's a dictionary before recursion
                        get_rules(item, k[:-1], rules)  # Convert "tracks" -> "track"
                    else:
                        rules.append(k[:-1] + ' -> ' + '"' + str(item) + '"')
            else:
                rules.append(k + ' -> ' + str(v))  # Keep other lists as is
        else:
            rules.append(k + ' -> ' + '"' + str(v) + '"')

def extract_rules(inputfile, outputfile):
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

    allrules = sorted(allrules.keys())
    allrules.append('Nothing -> None')

    with open(outputfile, 'w') as outf:
        for r in allrules:
            outf.write(r + '\n')

    print("Extraction complete. Rules written to file.")


            
extract_rules('gosling.txt', 'gosling-rules-cfg.txt')