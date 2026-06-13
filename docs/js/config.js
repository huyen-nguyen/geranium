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
    colorMainDark: "#295231",
    colorSecondary: "#a43471",
    colorAccent: "#c06c9b",       // hover/accent burgundy
  },

  /* ---------- 0b. BRAND LOGO  (optional) ------------------------------ */
  // Put an image in assets/ to replace the default coloured mark in the
  // header + footer. `link` is where clicking the logo/title takes you.
  brandLogo: {
    src:  "https://raw.githubusercontent.com/gosling-lang/geranium/614aa3b0521a36ef5dd5894d6b0b768ff521e5ef/assets/logo-mag.svg",            // e.g. "assets/logo.svg"   ("" keeps the default mark)
    link: "#top",        // e.g. "https://your-lab.org"  (default: back to top)
    alt:  "VizName",
  },

  /* ---------- 1. PAPER ---------------------------------------- */
  brand:        "Geranium",                 // short name in nav + footer
  badge:        "IEEE VIS 2026 · Bioinformatics & Visualization", // small pill above title
  title:        "Interactive Visualization for",          // first line of title
  titleEm:      "Genomic Data Exploration",               // accented line (set "" to skip)
  tagline:      "A scalable, open-source framework that turns millions of genomic features into interpretable visual insights, helping researchers find really cool patterns.",
  venue:        "IEEE Transactions on Visualization and Computer Graphics",
  year:         "2026",
  doi:          "10.0000/XXXXXXX",

  /* ---------- 2. AUTHORS -------------------------------------- */
  // `aff` lists the affiliation numbers (see `affiliations` below).
  // Any link left "" is hidden for that author.
  authors: [
    { name: "Author One",   aff: [1],    website: "#", scholar: "#", orcid: "#" },
    { name: "Author Two",   aff: [2],    website: "#", scholar: "#", orcid: "#" },
    { name: "Author Three", aff: [1, 3], website: "#", scholar: "#", orcid: "#" },
  ],
  affiliations: [
    "Dept. of Computational Biology, University A",   // 1
    "Institute of Data Visualization, University B",  // 2
    "Lab C, Research Center",                         // 3
  ],

  /* ---------- 3. LINKS  (leave "" to hide the button) --------- */
  links: {
    // The main preprint link used by the "Download preprint" buttons AND, by
    // default, by the PDF Preprint viewer below. It can be:
    //   • an arxiv link   -> "https://arxiv.org/pdf/2407.20571"  (embeds natively)
    //   • an OSF link     -> "https://osf.io/preprints/osf/zatw9_v7"  (see note in §10)
    //   • a local file    -> "assets/preprint.pdf"
    pdf:        "https://arxiv.org/pdf/2510.16662",
    code:       "https://github.com/huyen-nguyen/publication-template",   // GitHub repository
    pubmed:     "#",   // PubMed entry
    ieeexplore: "#",   // IEEE Xplore publication page
    ismb:       "#",   // ISMB presentation materials
    ieeevis:    "#",   // IEEE VIS 2026 presentation details
    license:    "#",   // license link used in footer

    // OPTIONAL override for ONLY the embedded viewer (the download buttons still
    // use `pdf` above). Set this to a local copy when the remote host won't embed
    // (e.g. OSF), e.g. "assets/preprint.pdf". Leave "" to just use `pdf`.
    preprintPdf: "",
  },

  /* ---------- 3b. CUSTOM CHIPS  (extra quick-link buttons) ---- */
  // Add your own chips to the quick-links row (between the built-in links and
  // the "Cite" button). Each item: { icon, label, href }.
  //   icon  – an icon name from js/icons.js (e.g. "youtube", "video", "website",
  //           "blog", "dataset", "colab", "huggingface", "x", "email", "star"),
  //           OR raw inline SVG markup (anything starting with "<svg ...>"),
  //           OR "" for no icon.
  //   href  – the URL. http(s) links open in a new tab. Leave "" to hide the chip.
  // Remove the examples or set the list to []  to show no custom chips.
  customChips: [
    // { icon: "youtube", label: "YouTube", href: "https://www.youtube.com/watch?v=VIDEO_ID" },
    // { icon: "website", label: "Project page", href: "https://your-lab.org/project" },
    { icon: "star", label: "Icons", href: "https://huyen-nguyen.github.io/iframe/icons" }
    // List of icons: https://huyen-nguyen.github.io/iframe/icons
    // No matching icon in icons.js? Paste raw SVG instead:
    // { icon: "<svg viewBox='0 0 24 24' width='24' height='24'>...</svg>", label: "Custom", href: "#" },
  ],

  /* ---------- 4. ABSTRACT  (one string per paragraph) -------- */
  abstract: [
    "Effective visualization retrieval necessitates a clear definition of similarity. Despite the growing body of work in specialized visualization retrieval systems, a systematic approach to understanding visualization similarity remains absent. We introduce the Similarity Framework for Visualization Retrieval (Safire), a conceptual model that frames visualization similarity along two dimensions: comparison criteria and representation modalities. Comparison criteria identify the aspects that make visualizations similar, which we divide into primary facets (data, visual encoding, interaction, style, metadata) and derived properties (data-centric and human-centric measures). ",
    "Safire connects what to compare with how comparisons are executed through representation modalities. We categorize existing representation approaches into four groups based on their levels of information content and visualization determinism: raster image, vector image, specification, and natural language description, together guiding what is computable and comparable. We analyze several visualization retrieval systems using Safire to demonstrate its practical value in clarifying similarity considerations. Our findings reveal how particular criteria and modalities align across different use cases. Notably, the choice of representation modality is not only an implementation detail but also an important decision that shapes retrieval capabilities and limitations. Based on our analysis, we provide recommendations and discuss broader implications for multimodal learning, AI applications, and visualization reproducibility.\n",
  ],

  /* ---------- 5. CITATION ------------------------------------- */
  // The formatted citation is built automatically from the fields above.
  // Edit the BibTeX below directly (BibTeX needs "Last, First" name order).
  bibtex:
      `@article{author2026vizname,
  title   = {Interactive Visualization for Genomic Data Exploration},
  author  = {One, Author and Two, Author and Three, Author},
  journal = {IEEE Transactions on Visualization and Computer Graphics},
  year    = {2026},
  doi     = {10.0000/XXXXXXX}
}`,

  /* ---------- 6. HIGHLIGHTS  (cards; add/remove freely) ------- */
  highlights: [
    { title: "Scales to millions of features", text: "GPU-accelerated rendering with level-of-detail aggregation keeps interaction fluid on datasets that overwhelm conventional tools." },
    { title: "Perceptually grounded encodings", text: "Color, position, and density mappings are chosen from perceptual research to minimise misreading and maximise signal." },
    { title: "Open & extensible", text: "A documented plugin API lets researchers add custom views and integrate VizName into existing analysis pipelines." },
    // { title: "Validated with experts", text: "A controlled study with domain scientists shows faster, more accurate pattern discovery versus baseline tools." },
  ],

  /* ---------- 6b. TEASER FIGURE  (shown under Highlights) ----- */
  // A single overview / method figure. Drop the image in assets/.
  // Set src "" to hide the whole figure.
  teaser: {
    src:     "https://huyennguyen.com/assets/images/papers/Dissertation.png",   // e.g. "assets/teaser.png"   ("" hides it)
    alt:     "System overview of VizName",
    caption: "Overview of the VizName pipeline — from raw multi-omic input to interactive visual exploration.",
  },

  /* ---------- 7. DEMO ----------------------------------------- */
  demo: {
    youtubeId: "VIDEO_ID",     // just the id, e.g. "dQw4w9WgXcQ"  ("" hides the player)
    gifs: [                    // drop files in assets/  ("" / empty list hides this row)
      { src: "assets/demo-1.gif", caption: "Fluid zoom & filter across a genomic region." },
      { src: "assets/demo-2.gif", caption: "Side-by-side multi-sample comparison." },
    ],
  },

  /* ---------- 8. LOGOS  (institutional / conference) ---------- */
  // Add { src, alt, link } image objects (link is optional).
  // Empty list = show placeholder slots.
  logos: [
    // { src: "assets/university-a.svg", alt: "University A", link: "https://university-a.edu" },
  ],

  /* ---------- 9. FOOTER / CONTACT ----------------------------- */
  contactEmail:    "contact@example.edu",
  contactNote:     "University A · University B",
  copyrightHolder: "The Authors",
  licenseName:     "CC BY 4.0",
  conferenceName:  "IEEE VIS 2026",   // shown in footer ("Built for ...")

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