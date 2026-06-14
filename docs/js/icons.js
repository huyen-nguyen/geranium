/* ============================================================
   stroke icons: 1.8px round, currentColor, fill none.
   ============================================================ */
const S = (inner, fill) =>
    `<svg viewBox="0 0 24 24" width="24" height="24" fill="${fill?'currentColor':'none'}"`
    + (fill?'':` stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`)
    + ` aria-hidden="true">${inner}</svg>`;

const ICONS = {
    /* — publication — */
    pdf: S(`<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5"/><path d="M8.5 13.5h7M8.5 17h5"/>`),
    arxiv: S(`<path d="M8.5 4H17a2 2 0 0 1 2 2v12"/><rect x="5" y="7" width="11" height="13.5" rx="2"/><path d="M8 11.5h5M8 15h5"/>`),
    cite: S(`<path d="M8.5 6C5.7 7.1 4 9.5 4 12.7V18h6v-7H6.6C6.7 9.4 7.6 8.2 9.4 7.5zM18.5 6c-2.8 1.1-4.5 3.5-4.5 6.7V18h6v-7h-3.4c.1-1.6 1-2.8 2.8-3.5z"/>`, true),
    results: S(`<path d="M4 20h16"/><path d="M6.5 20v-6M11 20V8M15.5 20v-9M20 20V5"/>`),

    /* — code & reproducibility — */
    code: S(`<path d="M9 8l-4.5 4L9 16"/><path d="M15 8l4.5 4L15 16"/><path d="M13.2 5.5l-2.4 13"/>`),
    github: S(`<path d="M12 2.6a9.4 9.4 0 0 0-3 18.31c.47.09.64-.2.64-.45v-1.6c-2.62.57-3.17-1.26-3.17-1.26-.43-1.09-1.05-1.38-1.05-1.38-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.84 1.45 2.2 1.03 2.74.78.08-.61.33-1.03.6-1.27-2.09-.24-4.29-1.05-4.29-4.65 0-1.03.37-1.87.97-2.53-.1-.24-.42-1.2.09-2.5 0 0 .79-.25 2.59.97a9 9 0 0 1 4.71 0c1.8-1.22 2.59-.97 2.59-.97.51 1.3.19 2.26.09 2.5.6.66.97 1.5.97 2.53 0 3.61-2.2 4.4-4.3 4.64.34.29.64.87.64 1.76v2.6c0 .25.17.55.65.45A9.4 9.4 0 0 0 12 2.6z"/>`, true),
    colab: S(`<circle cx="9" cy="12" r="4.7"/><circle cx="15" cy="12" r="4.7"/>`),
    dataset: S(`<ellipse cx="12" cy="6" rx="6.5" ry="2.8"/><path d="M5.5 6v12c0 1.55 2.9 2.8 6.5 2.8s6.5-1.25 6.5-2.8V6"/><path d="M18.5 12c0 1.55-2.9 2.8-6.5 2.8S5.5 13.55 5.5 12"/>`),

    /* — media — */
    demo: S(`<rect x="3.5" y="4.5" width="17" height="13" rx="2"/><path d="M8.5 21h7M12 17.5V21"/><path d="M10.5 8.8l4 2.7-4 2.7z"/>`),
    video: S(`<circle cx="12" cy="12" r="8.5"/><path d="M10.3 8.6l5 3.4-5 3.4z"/>`),
    youtube: S(`<rect x="2.8" y="6" width="18.4" height="12" rx="3.4"/><path d="M10.3 9.4l4.6 2.6-4.6 2.6z"/>`),
    slides: S(`<rect x="3.5" y="4.5" width="17" height="11" rx="1.6"/><path d="M12 15.5v3.5M9 19h6"/><path d="M8.5 12V9.5M12 12V7.8M15.5 12v-1.5"/>`),
    poster: S(`<rect x="4" y="4" width="16" height="16" rx="2.2"/><circle cx="9" cy="9.2" r="1.5"/><path d="M5 16.5l4-3.8 3.2 3 3-3.6L20 16"/>`),

    /* — web & social — */
    website: S(`<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5z"/>`),
    blog: S(`<path d="M4.5 19.5h4l10-10a2.05 2.05 0 0 0-2.9-2.9l-10 10z"/><path d="M13.7 6.8l2.9 2.9"/><path d="M4.5 19.5l-.7 1.7 1.7-.7"/>`),
    email: S(`<rect x="3" y="5" width="18" height="14" rx="2.2"/><path d="M4 7.5l8 5.5 8-5.5"/>`),
    x: S(`<path d="M5 5l14 14M19 5L5 19"/>`),

    /* — status — */
    star: S(`<path d="M12 3.5l2.55 5.4 5.7.83-4.13 4.1.98 5.84L12 17l-5.08 2.7.98-5.83-4.13-4.1 5.7-.84z"/>`),
    license: S(`<circle cx="12" cy="9" r="5.2"/><path d="M9.1 13.3L7.4 21l4.6-2.6L16.6 21l-1.7-7.7"/>`),
    accepted: S(`<circle cx="12" cy="12" r="8.5"/><path d="M8.4 12.4l2.5 2.5 4.7-5.3"/>`),
    download: S(`<path d="M12 3.5v11m0 0l-4-4m4 4l4-4M5 20.5h14"/>`),
};

/* huggingface gets a couple of filled eyes + stroked face/hands */
ICONS.huggingface =
    `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">`
    + `<circle cx="12" cy="11" r="6.2"/>`
    + `<circle cx="9.7" cy="10.2" r=".95" fill="currentColor" stroke="none"/>`
    + `<circle cx="14.3" cy="10.2" r=".95" fill="currentColor" stroke="none"/>`
    + `<path d="M9.3 13.2c.8.9 1.7 1.35 2.7 1.35s1.9-.45 2.7-1.35"/>`
    + `<path d="M5.4 12.6c-1.2 0-2.1 1-2 2.2.08.9.8 1.2 1.4.7"/>`
    + `<path d="M18.6 12.6c1.2 0 2.1 1 2 2.2-.08.9-.8 1.2-1.4.7"/>`
    + `</svg>`;

/* ============================================================
   Gallery rendering
   ============================================================ */
const GROUPS = [
    ["Publication", ["pdf","arxiv","cite","results"]],
    ["Code & reproducibility", ["code","github","colab","dataset"]],
    ["Media", ["demo","video","slides","poster"]],
    ["Web & social", ["website","blog","email","x"]],
    ["Status & misc", ["star","license","accepted","download","huggingface"]],
];

const app = document.getElementById("app");
GROUPS.forEach(([title, keys]) => {
    const sec = document.createElement("section");
    sec.className = "group";
    sec.innerHTML = `<h2>${title}</h2><div class="plate"></div>`;
    const plate = sec.querySelector(".plate");
    keys.forEach(k => {
        const tile = document.createElement("button");
        tile.className = "chip";
        tile.type = "button";
        tile.innerHTML = ICONS[k] + `<span class="name">${k}</span><span class="copied">copied</span>`;
        tile.addEventListener("click", () => {
            navigator.clipboard?.writeText(ICONS[k]).catch(()=>{});
            tile.classList.add("is-copied");
            setTimeout(()=>tile.classList.remove("is-copied"), 1100);
        });
        plate.appendChild(tile);
    });
    app.appendChild(sec);
});

/* ============================================================
   DROP-IN for your config-driven chips.
   In your real code, expose ICONS and render #chips from config:
   ============================================================ */
function renderChips(target, resources){
    target.querySelectorAll(".pill").forEach(n => n.remove());
    resources.forEach(r => {
        const a = document.createElement(r.href ? "a" : "span");
        a.className = "pill";
        if (r.href){ a.href = r.href; a.target = "_blank"; a.rel = "noopener"; }
        a.innerHTML = (ICONS[r.icon] || "") + `<span>${r.label}</span>`;
        target.appendChild(a);
    });
}
/* demo of the helper using a sample config */
renderChips(document.getElementById("demoBar"), [
    { icon:"website", label:"Project page", href:"#" },
    { icon:"arxiv",   label:"arXiv",        href:"#" },
    { icon:"dataset", label:"Dataset",      href:"#" },
    { icon:"colab",   label:"Colab",        href:"#" },
    { icon:"slides",  label:"Slides",       href:"#" },
    { icon:"cite",    label:"BibTeX",       href:"#" },
]);