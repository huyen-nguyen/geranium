import numpy as np
import os,sys
sys.path.append(os.getcwd())
from utils.constants import *
from utils.helpers import *

def fact_format(fact):
    """
        Formatting the input fact according to rules
    """
    new_fact = {}
    new_fact['fact_type'] = fact['fact_type']
    new_fact['chart_type'] = fact['chart_type']
    # breakdown
    if fact['breakdown']:
        new_fact['breakdown'] = {}
        if len(fact['breakdown']) == 1:
            new_fact['breakdown']['len'] = "1"
        else:
            new_fact['breakdown']['len'] = '>1'
        new_fact['breakdown']['field'] = fact['breakdown'][0]['type']
    else:
        new_fact['breakdown'] = None
    # measure
    if fact['measure']:
        new_fact['measure'] = {}
        if len(fact['measure']) == 1:
            new_fact['measure']['len'] = "1"
        else:
            new_fact['measure']['len'] = '>1'
        new_fact['measure']['field'] = fact['measure'][0]['type']
        new_fact['measure']['aggregate'] = fact['measure'][0]['aggregate']
        if 'subtype' in fact['measure'][0].keys():
            temp_subtype=fact['measure'][0]['subtype']
            if temp_subtype=="none":
                new_fact['measure']['subtype'] = None
            else:
                new_fact['measure']['subtype'] = temp_subtype
        else:
            new_fact['measure']['subtype'] = None
    else:
        new_fact['measure'] = None
    # subspace
    if fact['subspace']:
        new_fact['subspace'] = {}
        if len(fact['subspace']) == 1:
            new_fact['subspace']['len'] = "1"
            new_fact['subspace']['field'] = fact['subspace'][0]['type']
        else:
            new_fact['subspace']['len'] = '>1'
            new_fact['subspace']['field'] = 'multiple'
    else:
        new_fact['subspace'] = None
    # focus
    if fact['focus']:
        new_fact['focus'] = {}
        if len(fact['focus']) == 1:
            new_fact['focus']['len'] = "1"
        else:
            new_fact['focus']['len'] = '>1'
        new_fact['focus']['field'] = fact['focus'][0]['type']
    else:
        new_fact['focus'] = None
    return new_fact

def get_rules(node, parentkey, rules):
    current_rule = parentkey + ' -> ' + ' "+" '.join(sorted(node.keys()))
    rules.append(current_rule)
    for k in sorted(node.keys()):
        v = node[k]
        if type(v) is dict:
            get_rules(v, k, rules)
        else:
            temp_rule=k + ' -> ' + '"' + str(v) + '"'
            if temp_rule not in rules:
                rules.append(temp_rule)

def get_total_rules():
    """
        Get all the rules.
        Return:
            `rules`: list of all rules.
            `rule2index`: the index corresponding to each rule.
    """
    rule_path=os.path.join(os.path.dirname(__file__),'structural_rules.txt')
    rules = []
    with open(rule_path, 'r') as inputs:
        for line in inputs:
            line = line.strip()
            rules.append(line)
    rule2index = {}
    for i, r in enumerate(rules):
        rule2index[r] = i
    return rules,rule2index


def extract_structual_info(fact):
    """
        Extract the structure information in Chart fact and represent the rules in the structure as one-hot vectors.
    """
    total_rules,rule2index=get_total_rules()
    fact_rules= [] 
    fact=fact_format(fact)
    get_rules(fact, 'root', fact_rules)
    
    one_hot = np.zeros((MAX_STRUCT_FEATURE_LEN, len(total_rules)), dtype=np.float32)
    indices = [rule2index[r] for r in fact_rules]
    one_hot[np.arange(len(indices)), indices] = 1
    one_hot[np.arange(len(indices), MAX_STRUCT_FEATURE_LEN), -1] = 1

    return one_hot

extract_structual_info(fact)