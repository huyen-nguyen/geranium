# combine contents from multiple folders into one

# find ../../gosling-screenshot-bulk/output  -type f -exec cp {} ./output_merge \;

# find ../data/unified_v2/autogosling/specs ../data/unified_v2/gallery_p1/specs ../data/unified_v2/gallery_p2/specs -type f -exec cp {} ../data/unified_v3/specs \;

find ../data/chromoscope/imgs -type f -exec cp {} ../data/unified_v3/imgs \;