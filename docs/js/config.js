/* ==================================================================
   ▸▸▸  EDIT ONLY THIS FILE  ◂◂◂
   This is the entire content of your page. Fill in your specifics
   below and the site builds itself. You shouldn't need to touch the
   HTML or CSS at all.

   RULES
   - Leave a value as an empty string ""  to HIDE it.
     (e.g. no PubMed entry yet?  pubmed: ""  → the button disappears)
   - Keep the quotes and commas exactly as shown.
   - Lists (authors, highlights, gifs) can have any number of items —
     just add or remove blocks following the same pattern.
   ================================================================== */

const CONFIG = {

  /* ---------- 0. LOOK & FEEL  (leave any value "" to keep the default) */
  theme: {
    colorMain:   "#458652",       // burgundy brand colour (matches site title)
    colorMainDark: "#2e5936",
    colorSecondary: "#a43471",
    colorAccent: "#c06c9b",       // hover/accent burgundy
  },

  /* ---------- 0b. BRAND LOGO  (optional) ------------------------------ */
  // Put an image in assets/ to replace the default coloured mark in the
  // header + footer. `link` is where clicking the logo/title takes you.
  brandLogo: {
    src:  "https://raw.githubusercontent.com/gosling-lang/geranium/614aa3b0521a36ef5dd5894d6b0b768ff521e5ef/assets/logo-mag.svg",            // e.g. "assets/logo.svg"   ("" keeps the default mark)
    link: "#top",        // e.g. "https://your-lab.org"  (default: back to top)
    alt:  "Geranium",
  },

  /* ---------- 1. PAPER ---------------------------------------- */
  brand:        "Geranium",                 // short name in nav + footer
  badge:        "IEEE TVCG 2026 · Presenting at IEEE VIS 2026", // small pill above title
  title:        "Geranium: Multimodal Retrieval of",          // first line of title
  titleEm:      "Genomics Data Visualizations",               // accented line (set "" to skip)
  tagline:      "A multimodal retrieval system that turns text, image, and code queries into reusable visualization templates, helping researchers quickly construct custom genomics charts for their own data.",
  venue:        "IEEE Transactions on Visualization and Computer Graphics",
  year:         "2026",
  doi:          "10.1109/TVCG.2026.3683429",

  /* ---------- 2. AUTHORS -------------------------------------- */
  // `aff` lists the affiliation numbers (see `affiliations` below).
  // Any link left "" is hidden for that author.
  authors: [
    { name: "Huyen N. Nguyen",   aff: [1],    website: "https://huyennguyen.com/", scholar: "https://scholar.google.com/citations?user=tsrO-ZgAAAAJ&hl=en", orcid: "https://orcid.org/0000-0001-6554-2327" },
    { name: "Sehi L'Yi",   aff: [1],    website: "https://sehilyi.com/", scholar: "", orcid: "" },
    { name: "Thomas C. Smits", aff: [1, 2], website: "", scholar: "", orcid: "" },
    { name: "Shanghua Gao", aff: [1],},
    { name: "Marinka Zitnik", aff: [1],},
    { name: "Nils Gehlenborg", aff: [1], website: "https://hidivelab.org/"},

  ],
  affiliations: [
    "Dept. of Biomedical Informatics, Harvard Medical School, Harvard University",   // 1
    "Radboud University Medical Center in Nijmegen, the Netherlands",  // 2
  ],

  /* ---------- 3. LINKS  (leave "" to hide the button) --------- */
  links: {
    // The main preprint link used by the "Download preprint" buttons AND, by
    // default, by the PDF Preprint viewer below. It can be:
    //   • an arxiv link   -> "https://arxiv.org/pdf/2407.20571"  (embeds natively)
    //   • an OSF link     -> "https://osf.io/preprints/osf/zatw9_v7"  (see note in §10)
    //   • a local file    -> "assets/preprint.pdf"
    pdf:        "https://osf.io/preprints/osf/zatw9_v7",
    code:       "https://github.com/gosling-lang/geranium",   // GitHub repository
    pubmed:     "https://pubmed.ncbi.nlm.nih.gov/41973568/",   // PubMed entry
    ieeexplore: "https://ieeexplore.ieee.org/document/11480764",   // IEEE Xplore publication page
    ieeevis:    "https://ieeexplore.ieee.org/document/11480764",   // IEEE VIS 2026 presentation details

    // OPTIONAL override for ONLY the embedded viewer (the download buttons still
    // use `pdf` above). Set this to a local copy when the remote host won't embed
    // (e.g. OSF), e.g. "assets/preprint.pdf". Leave "" to just use `pdf`.
    preprintPdf: "assets/Geranium_Multimodal_Retrieval_of_Genomics_Data_Visualizations.pdf",
  },

  /* ---------- 3b. CUSTOM CHIPS  (extra quick-link buttons) ---- */
  // Add your own chips to the quick-links row (between the built-in links and
  // the "Cite" button). Each item: { icon, label, href }.
  //   icon  – an icon name from js/icons.js (e.g. "youtube", "video", "website",
  //           "blog", "dataset", "colab", "huggingface", "x", "email", "star"),
  //           OR raw inline SVG markup (anything starting with "<svg ...>"),
  //           OR "" for no icon.
  // Remove the examples or set the list to []  to show no custom chips.
  customChips: [
    { icon: "youtube", label: "Video", href: "https://www.youtube.com/watch?v=XXYk3Xz73Dk" },
    // { icon: "website", label: "Project page", href: "https://your-lab.org/project" },
    // List of icons: https://huyen-nguyen.github.io/iframe/icons
    // No matching icon in icons.js? Paste raw SVG instead:
    // { icon: "<svg viewBox='0 0 24 24' width='24' height='24'>...</svg>", label: "Custom", href: "#" },
  ],

  /* ---------- 4. ABSTRACT  (one string per paragraph) -------- */
  abstract: [
    "Effective visualization is essential for interpreting genomics data, yet researchers often face challenges in finding relevant, reusable examples. Existing tools offer limited support for searching the vast landscape of genomics visualizations, making the process of authoring new visualizations time-consuming and inefficient. To address this gap, we introduce Geranium, a data visualization retrieval system for searching and authoring genomics visualizations.",

    "Geranium supports multimodal retrieval, enabling users to query with images, text, or grammar-based specifications. Retrieved examples serve as scaffolds for authoring, providing templates that researchers can adapt with their own data, thereby streamlining the mechanics of visualization construction. Geranium integrates three embedding methods to combine specialized and general knowledge: grammar-based embeddings tailored to genomics visualizations, multimodal embeddings from a biomedical vision-language foundation model, and text embeddings from a fine-tuned large language model. For each visualization, we construct a multimodal representation that includes a Gosling specification, a pixel-based rendering, and natural language descriptions.",

    "We evaluate embedding strategies to maximize top-k retrieval accuracy and conduct user studies with domain collaborators to gather feedback on usability. Our collection comprises 3,200 visualizations across 50 categories, ranging from single-view to coordinated multi-view designs and supporting applications from single-cell epigenomics to structural variation analysis."],

  /* ---------- 5. CITATION ------------------------------------- */
  // The formatted citation is built automatically from the fields above.
  // Edit the BibTeX below directly (BibTeX needs "Last, First" name order).
  bibtex:
      `@ARTICLE{nguyen2026geranium,
  author={Nguyen, Huyen N. and L'Yi, Sehi and Smits, Thomas C. and Gao, Shanghua and Zitnik, Marinka and Gehlenborg, Nils},
  journal={IEEE Transactions on Visualization and Computer Graphics}, 
  title={Geranium: Multimodal Retrieval of Genomics Data Visualizations}, 
  year={2026},
  volume={},
  number={},
  pages={1-17},
  keywords={Feeds;Feedback;Circuits;Brushes;Filtering;Product development;Pixel;Internet;Communication systems;Graphical user interfaces;Visualization retrieval;multimodal retrieval;multimodal representation;visualization authoring;genomics data visualization},
  doi={10.1109/TVCG.2026.3683429}}
`,

  /* ---------- 6. HIGHLIGHTS  (cards; add/remove freely) ------- */
  highlights: [
    { title: "Multimodal search capabilities", text: "Researchers can query a curated collection of 3,200 genomics charts using example images, natural language descriptions, or Gosling grammar specifications." },
    { title: "Scaffold-driven authoring", text: "Retrieved visualizations serve as adaptable code templates, enabling users to plug in their own data and bypass building complex charts from scratch." },
    { title: "Validated with domain experts", text: "Combines specialized grammar and vision-language embeddings for accurate retrieval, validated through hands-on user studies with genomics experts." }
  ],

  /* ---------- 6b. TEASER FIGURE  (shown under Highlights) ----- */
  // A single overview / method figure. Drop the image in assets/.
  // Set src "" to hide the whole figure.
  teaser: {
    src:     "https://hidivelab.org/assets/img/publications/fullsize/nguyen-2026-multimodal-retrieval.png",   // e.g. "assets/teaser.png"   ("" hides it)
    alt:     "System overview of Geranium",
    caption: "Overview of the Geranium pipeline (top) and User interface (bottom).",
  },

  /* ---------- 7. DEMO ----------------------------------------- */
  demo: {
    youtubeId: "XXYk3Xz73Dk",     // just the id, e.g. "dQw4w9WgXcQ"  ("" hides the player)
    // gifs: [                    // drop files in assets/  ("" / empty list hides this row)
    //   { src: "assets/demo-1.gif", caption: "Fluid zoom & filter across a genomic region." },
    //   { src: "assets/demo-2.gif", caption: "Side-by-side multi-sample comparison." },
    // ],
  },

  /* ---------- 8. LOGOS  (institutional / conference) ---------- */
  // Add { src, alt, link } image objects (link is optional).
  // Empty list = show placeholder slots.
  logos: [
    { src: "https://hms.harvard.edu/themes/shared/harvardmedical/logo.svg", alt: "Harvard Medical School", link: "https://hms.harvard.edu/" },
    { src: "assets/hidivelogo.png", alt: "HIDIVE Lab", link: "https://hidivelab.org/" },

  ],

  /* ---------- 9. FOOTER / CONTACT ----------------------------- */
  contactEmail:    "huyen_nguyen@hms.harvard.edu",
  contactNote:     "Harvard Medical School",
  copyrightHolder: "The Authors",
  licenseName:     "CC BY 4.0",
  // conferenceName:  "IEEE VIS 2026",   // shown in footer ("Built for ...")

  /* ---------- 10. PDF PREPRINT VIEWER ------------------------- */
  // Controls how the "PDF Preprint" section (after the Demo) renders the file
  // from links.pdf (or links.preprintPdf if set). Options:
  //   "auto"   (default) – arxiv & local files embed directly; OSF links are
  //                        routed through Google's Docs Viewer so they display
  //                        instead of forcing a download.
  //   "direct" – always use a plain <iframe> (best quality; arxiv + local files).
  //   "google" – always route through Google's Docs Viewer (use for any host
  //              that refuses to be framed).
  //
  // NOTES
  //   • arxiv: works out of the box — paste either the /abs/ or /pdf/ link.
  //   • OSF:   paste the preprint page link (e.g.
  //              "https://osf.io/preprints/osf/zatw9_v7")
  //            and leave this on "auto". The viewer converts it to the OSF
  //            download URL and shows it via the Docs Viewer. This is best-effort
  //            (depends on Google's viewer + a public file). If it doesn't render,
  //            download the PDF into assets/ and set links.preprintPdf to it.
  preprintViewer: "auto",
};