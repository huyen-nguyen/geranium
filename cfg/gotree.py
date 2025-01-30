import simplejson as json
import os, sys
import re

def get_rules(node, parentkey, rules):
    thisrule = parentkey + ' -> ' + ' "+" '.join(sorted(node.keys()))
    rules.append(thisrule)

    for k in sorted(node.keys()):
        v = node[k]
        if type(v) is dict:
            get_rules(v, k, rules)
        else:
            rules.append(k + ' -> ' + '"' + str(v) + '"')

def extract_rules(inputfile, outputfile):
    specs = []
    with open(inputfile, 'r') as inputs:
        for line in inputs:
            try:
                specs.append(json.loads(line))
            except Exception as e:
                print(line, e)

    print('length', len(specs))
    allrules = {}

    max_rulelen = 0
    for spec in specs:
        rules = []
        get_rules(spec, 'root', rules)
        for r in rules:
            if not r in allrules:
                allrules[r] = 0
            allrules[r] += 1
        max_rulelen = max(max_rulelen, len(rules))

    print('max len: %d' % max_rulelen)
    print(allrules)
    allrules = sorted(allrules.keys())
    allrules.append('Nothing -> None')

    with open(outputfile, 'w') as outf:
        for r in allrules:
            outf.write(r + '\n')
            
extract_rules('gotree.txt', 'gotree-rules-cfg.txt')