### data description

In this folder, there are several datasets.

- `autogosling`: Training dataset for autogosling, **7296 specs and images**, mutated scale, scale_width, view permutation
- `chromoscope`: Examples for chromoscope, 481 specs, already varied
- `gallery_p1`: Examples from gallery in the first cycle of this project, **340 specs and image**, mutated scale and scale_width
- `gallery_p2_raw`: Raw examples from gallery and docs in the second cycle of this project, **44 specs**
- `unified`: First unified dataset created from this project, all kinds of permutations (color included), **26k specs and 4456 images** (usable-ish, still contain bugs in categorical color map -- later fixed in [this commit](https://github.com/huyen-nguyen/geranium/commit/f49ad96670f9125804b40f9446a22f41164ed545)). The description for this dataset is in [this PR](https://github.com/huyen-nguyen/geranium/pull/7).
- `unified_v2`: Second unified dataset, categorized by whether it's from `gallery_p1` (only color change, since others already done), `gallery_p2_raw` (all kinds of permutations, if applicable), and a few examples from `autogosling` (heatmap and multiple circular ideogram) that usable in genomic data visualization. Further categorized by source example name. **2134 specs and images**
- `unified_v3`: Merged all categories in `unified_v2` PLUS `chromoscope`. This folder will later be named as `unified` to avoid confusion. **2615 specs and images** in total.