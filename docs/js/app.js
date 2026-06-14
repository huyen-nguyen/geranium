/* ==================================================================
   app.js — builds the page from CONFIG (see config.js) and wires up
   the interactions. You normally don't need to edit this file.
   ================================================================== */
(function () {
  "use strict";

  var C = (typeof CONFIG !== "undefined" && CONFIG) ? CONFIG : (window.CONFIG || {});
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- tiny helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function setText(sel, value) { $all(sel).forEach(function (n) { n.textContent = value || ""; }); }
  function has(v) { return typeof v === "string" ? v.trim() !== "" : !!v; }
  // wire an anchor to a link key; hide the anchor if the link is empty
  function wireLink(node, url) {
    if (!node) return;
    if (has(url)) { node.setAttribute("href", url); node.hidden = false; }
    else { node.hidden = true; }
  }
  function safe(fn) { try { fn(); } catch (e) { console.error("[render]", e); } }

  /* ---------- theme: colors + fonts ---------- */
  safe(function () {
    var t = C.theme || {};
    var root = document.documentElement.style;
    if (has(t.colorMain))   root.setProperty("--primary", t.colorMain);
    if (has(t.colorMainDark))   root.setProperty("--primary-dark", t.colorMainDark);
    if (has(t.colorSecondary))   root.setProperty("--secondary", t.colorSecondary);
    if (has(t.colorAccent)) root.setProperty("--accent", t.colorAccent);

    var defaults = { fontDisplay: "Fraunces", fontBody: "Spline Sans", fontMono: "IBM Plex Mono" };
    var toLoad = [];
    [["fontDisplay", "--font-display", ", Georgia, serif"],
      ["fontBody",    "--font-body",    ", system-ui, sans-serif"],
      ["fontMono",    "--font-mono",    ", ui-monospace, monospace"]
    ].forEach(function (spec) {
      var fam = t[spec[0]];
      if (!has(fam)) return;
      fam = fam.trim();
      root.setProperty(spec[1], '"' + fam + '"' + spec[2]);
      if (fam !== defaults[spec[0]]) toLoad.push(fam);   // only fetch non-default families
    });
    if (toLoad.length) {
      var url = "https://fonts.googleapis.com/css2?" +
          toLoad.map(function (f) { return "family=" + encodeURIComponent(f).replace(/%20/g, "+") + ":wght@400;500;600;700"; }).join("&") +
          "&display=swap";
      var link = document.createElement("link");
      link.rel = "stylesheet"; link.href = url;
      document.head.appendChild(link);
    }
  });

  /* ---------- brand logo ---------- */
  safe(function () {
    var lg = C.brandLogo || {};
    if (has(lg.src)) {
      $all(".nav__mark").forEach(function (mark) {
        var img = document.createElement("img");
        img.className = "brand-logo"; img.src = lg.src;
        img.alt = lg.alt || C.brand || "Logo";
        mark.replaceWith(img);
      });
    }
    var brand = $(".nav__brand");
    if (brand && has(lg.link)) brand.setAttribute("href", lg.link);
  });

  /* ---------- meta / brand / hero text ---------- */
  safe(function () {
    setText("[data-brand]", C.brand);
    setText("[data-badge]", C.badge);
    setText("[data-title]", C.title);
    var em = $("[data-title-em]");
    if (em) { if (has(C.titleEm)) { em.textContent = C.titleEm; } else { em.remove(); } }
    setText("[data-tagline]", C.tagline);
    setText("[data-tagline-short]", C.tagline);

    var meta = $("#heroMeta");
    if (meta) {
      meta.innerHTML = "";
      meta.appendChild(document.createTextNode((C.venue || "") + "  ·  " + (C.year || "") + "  ·  DOI "));
      var a = el("a"); a.textContent = C.doi || ""; a.href = doiUrl(C.doi); meta.appendChild(a);
    }
  });

  function doiUrl(doi) { return has(doi) ? ("https://doi.org/" + doi) : "#"; }

  /* ---------- author byline (hero) with Nature-style popovers ---------- */
  safe(function () {
    var line = $("#authorline");
    if (!line || !Array.isArray(C.authors)) return;

    function closeAll() {
      $all(".byline-author.is-open").forEach(function (sp) {
        sp.classList.remove("is-open");
        var b = $(".byline-author__name", sp), p = $(".author-pop", sp);
        if (b) b.setAttribute("aria-expanded", "false");
        if (p) p.hidden = true;
      });
    }

    C.authors.forEach(function (au, i) {
      var span = el("span", "byline-author");

      // clickable name (button → toggles the card instead of navigating)
      var btn = el("button", "byline-author__name");
      btn.type = "button";
      btn.textContent = au.name;
      btn.setAttribute("aria-expanded", "false");
      span.appendChild(btn);

      // superscript affiliation numbers
      if (Array.isArray(au.aff) && au.aff.length) {
        var sup = el("sup"); sup.textContent = au.aff.join(","); span.appendChild(sup);
      }

      // popover card
      var pop = el("div", "author-pop");
      pop.hidden = true;

      var close = el("button", "author-pop__close", "&times;");
      close.type = "button"; close.setAttribute("aria-label", "Close");
      pop.appendChild(close);

      pop.appendChild(el("h3", "author-pop__name", escapeHtml(au.name)));

      // full affiliation names, looked up from C.affiliations
      var affNames = (au.aff || []).map(function (n) { return (C.affiliations || [])[n - 1]; }).filter(Boolean);
      if (affNames.length) {
        var affBox = el("div", "author-pop__affs");
        affNames.forEach(function (name) { affBox.appendChild(el("div", "author-pop__aff", escapeHtml(name))); });
        pop.appendChild(affBox);
      }

// Website + ORCID on one row (each shown only if provided)
      var profBits = [];
      if (has(au.website)) profBits.push(["Website", au.website]);
      if (has(au.orcid))   profBits.push(["View ORCID profile", au.orcid]);
      if (profBits.length) {
        var profBox = el("div", "author-pop__links");
        profBits.forEach(function (b, idx) {
          var a = el("a", null, b[0]); a.href = b[1]; a.target = "_blank"; a.rel = "noopener";
          profBox.appendChild(a);
          if (idx < profBits.length - 1) profBox.appendChild(document.createTextNode("  ·  "));
        });
        pop.appendChild(profBox);
      }

      // "Find author on:" row — PubMed + Google Scholar
      var search = el("div", "author-pop__search");
      search.appendChild(document.createTextNode("Find author on: "));
      var bits = [
        ["PubMed", "https://pubmed.ncbi.nlm.nih.gov/?term=" + encodeURIComponent(au.name)],
        ["Google Scholar", has(au.scholar) ? au.scholar
            : "https://scholar.google.com/scholar?q=" + encodeURIComponent(au.name)]
      ];
      bits.forEach(function (b, idx) {
        var a = el("a", null, b[0]); a.href = b[1]; a.target = "_blank"; a.rel = "noopener";
        search.appendChild(a);
        if (idx < bits.length - 1) search.appendChild(document.createTextNode("  ·  "));
      });
      pop.appendChild(search);

      span.appendChild(pop);

      // toggle
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = !span.classList.contains("is-open");
        closeAll();
        if (willOpen) {
          span.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
          pop.hidden = false;
          // keep the card within the viewport, and keep the arrow under the name
          pop.style.left = "0px";
          pop.style.setProperty("--arrow-left", "22px");
          var rect = pop.getBoundingClientRect();
          var over = rect.right - (window.innerWidth - 12);
          if (over > 0) {
            pop.style.left = (-over) + "px";
            pop.style.setProperty("--arrow-left", (22 + over) + "px");
          }
        }
      });
      close.addEventListener("click", function (e) { e.stopPropagation(); closeAll(); });
      pop.addEventListener("click", function (e) { e.stopPropagation(); });

      line.appendChild(span);
      if (i < C.authors.length - 1) line.appendChild(document.createTextNode(", "));
    });

    // click anywhere else / Escape closes
    document.addEventListener("click", closeAll);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
  });

  /* ---------- nav + hero CTA links ---------- */
  safe(function () {
    var L = C.links || {};
    $all('[data-link="pdf"]').forEach(function (n) { wireLink(n, L.pdf); });
    $all('[data-link="code"]').forEach(function (n) { wireLink(n, L.code); });
  });

  /* ---------- quick-link chips ---------- */
  safe(function () {
    var box = $("#chips"); if (!box) return;
    var L = C.links || {};
    var demoHref = (C.demo && (has(C.demo.youtubeId) || (C.demo.gifs || []).length)) ? "#demo" : "";

    // Resolve a chip's icon. `icon` may be:
    //   • a name from icons.js  (e.g. "youtube", "video", "website")
    //   • raw inline SVG markup (anything starting with "<")
    //   • "" / omitted          (renders the chip with no icon)
    function chipIcon(icon) {
      if (!has(icon)) return "";
      if (/^\s*</.test(icon)) return icon;                         // raw SVG passed inline
      return (typeof ICONS !== "undefined" && ICONS[icon]) || ""; // named icon from icons.js
    }

    var defs = [
      { icon: "demo",    label: "Demo",          href: demoHref },
      { icon: "results", label: "PubMed",        href: L.pubmed },
      { icon: "arxiv",   label: "IEEE Xplore",   href: L.ieeexplore },
      { icon: "poster",  label: "ISMB",          href: L.ismb },
      { icon: "slides",  label: "IEEE VIS 2026", href: L.ieeevis },
    ];

    // User-defined chips from config (e.g. a YouTube link). Inserted before the
    // accent "Cite" chip so that stays last. Each item: { icon, label, href, accent }.
    (C.customChips || []).forEach(function (c) { if (c) defs.push(c); });

    defs.push({ icon: "cite", label: "Cite", href: "#cite", accent: true });

    defs.forEach(function (d) {
      if (!has(d.href)) return;
      var a = el("a", "chip" + (d.accent ? " chip--accent" : ""));
      a.href = d.href;
      // Open external links (http/https) in a new tab; keep in-page #anchors local.
      if (/^https?:/i.test(d.href)) { a.target = "_blank"; a.rel = "noopener"; }
      // icon (named or raw) + escaped label
      a.innerHTML = chipIcon(d.icon) + escapeHtml(d.label || "");
      box.appendChild(a);
    });
  });

  /* ---------- abstract ---------- */
  safe(function () {
    var body = $("#abstractBody"); if (!body) return;
    var paras = C.abstract || [];
    // First paragraph is always visible. On phones the rest collapse behind a
    // "Show more" toggle (CSS handles the breakpoint); on larger screens they
    // are all shown and the toggle stays hidden.
    paras.forEach(function (p, i) {
      body.appendChild(el("p", i === 0 ? null : "abstract__extra", escapeHtml(p)));
    });
    if (paras.length > 1) {
      var btn = el("button", "abstract__toggle", "Show more");
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function () {
        var open = body.classList.toggle("is-expanded");
        btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? "Show less" : "Show more";
      });
      body.appendChild(btn);
    }
  });

  /* ---------- citation (formatted + BibTeX) ---------- */
  safe(function () {
    var fmt = $("#citationText");
    if (fmt) {
      var names = (C.authors || []).map(function (a) { return a.name; });
      var authorStr = joinAuthors(names);
      fmt.innerHTML =
          escapeHtml(authorStr) + " &ldquo;" + escapeHtml(C.title + (C.titleEm ? " " + C.titleEm : "")) +
          ".&rdquo; <em>" + escapeHtml(C.venue) + "</em>, " + escapeHtml(C.year) +
          '. DOI: <a href="' + doiUrl(C.doi) + '">' + escapeHtml(C.doi) + "</a>.";
    }
    var bib = $("#bibtex");
    if (bib) bib.textContent = C.bibtex || "";
  });

  function joinAuthors(names) {
    if (!names.length) return "";
    if (names.length === 1) return names[0] + ".";
    if (names.length === 2) return names[0] + " and " + names[1] + ".";
    return names.slice(0, -1).join(", ") + ", and " + names[names.length - 1] + ".";
  }

  /* ---------- highlights ---------- */
  safe(function () {
    var grid = $("#highlights"); if (!grid) return;
    (C.highlights || []).forEach(function (h, i) {
      var card = el("article", "card reveal");
      card.appendChild(el("span", "card__num", String(i + 1).padStart(2, "0")));
      card.appendChild(el("h3", "card__title", escapeHtml(h.title)));
      card.appendChild(el("p", null, escapeHtml(h.text)));
      grid.appendChild(card);
    });
  });

  /* ---------- teaser figure (under highlights) ---------- */
  safe(function () {
    var fig = $("#teaser"); if (!fig) return;
    var t = C.teaser || {};
    if (!has(t.src)) { fig.hidden = true; return; }   // no image -> hide figure
    var img = $("#teaserImg");
    if (img) {
      img.src = t.src;
      img.alt = has(t.alt) ? t.alt : "";
    }
    var cap = $("#teaserCaption");
    if (cap) cap.textContent = has(t.caption) ? t.caption : "";
    fig.hidden = false;
  });

  /* ---------- demo (video + gifs) ---------- */
  safe(function () {
    var d = C.demo || {};
    var wrap = $("#videoWrap"), frame = $("#video");
    if (frame && has(d.youtubeId)) {
      frame.src = "https://www.youtube-nocookie.com/embed/" + d.youtubeId;
      if (wrap) wrap.hidden = false;
    }
    var gbox = $("#gifs");
    if (gbox && Array.isArray(d.gifs)) {
      d.gifs.forEach(function (g) {
        if (!has(g.src)) return;
        var fig = el("figure", "gif reveal");
        var img = el("img"); img.src = g.src; img.alt = g.caption || "Demo animation"; img.loading = "lazy";
        img.onerror = function () { fig.classList.add("gif--empty"); };
        var ph = el("span", "gif__placeholder", escapeHtml(g.src));
        fig.appendChild(img); fig.appendChild(ph);
        if (has(g.caption)) fig.appendChild(el("figcaption", null, escapeHtml(g.caption)));
        gbox.appendChild(fig);
      });
    }
    // hide the whole demo section if there's nothing in it
    var section = $("#demo");
    var hasVideo = frame && has(d.youtubeId);
    var hasGifs = gbox && gbox.children.length;
    if (section && !hasVideo && !hasGifs) section.hidden = true;
  });

  /* ---------- PDF preprint viewer ---------- */
  safe(function () {
    var section = $("#preprint");
    if (!section) return;
    var L = C.links || {};

    // What the "Open in new tab" / download buttons point at (human-facing page).
    var openUrl = has(L.pdf) ? L.pdf : (has(L.preprintPdf) ? L.preprintPdf : (C.preprintPdf || ""));
    // What actually gets embedded. Prefer an explicit override (e.g. a local
    // "assets/preprint.pdf"); otherwise derive it from links.pdf.
    var rawSrc = has(L.preprintPdf) ? L.preprintPdf
        : (has(C.preprintPdf) ? C.preprintPdf : L.pdf);

    if (!has(rawSrc)) { section.hidden = true; return; }  // nothing to show -> hide section

    var engine = String(C.preprintViewer || "auto").toLowerCase();
    var embedSrc = resolvePreprint(rawSrc, engine);

    var frame = $("#preprintFrame");
    var openBtn = $("#preprintOpen");
    var fbLink = $("#preprintFallbackLink");

    var human = has(openUrl) ? openUrl : rawSrc;
    if (openBtn) openBtn.href = human;
    if (fbLink)  fbLink.href = human;
    // Note: a cross-origin frame blocked by X-Frame-Options / CSP does NOT fire
    // a reliable "error" event, so we can't auto-detect a failed embed. The
    // always-visible "Open in new tab" button + fallback link are the escape hatch.
    if (frame) frame.src = embedSrc;
    var wrap = $("#preprintWrap");
    if (wrap) wrap.hidden = false;
  });

  // Turn a user-supplied PDF / landing-page URL into something embeddable.
  //   • arxiv abs|pdf links        -> direct https://arxiv.org/pdf/<id>  (frames natively)
  //   • OSF preprint/landing links -> Google Docs Viewer wrapping the OSF /download URL
  //       (OSF forces a file download and blocks framing, so a bare iframe shows
  //        nothing; the Docs Viewer renders it server-side in a frame-friendly page)
  //   • local files / direct .pdf  -> used as-is (frames natively)
  // engine: "auto" (default) | "direct" (always native iframe) | "google" (always Docs Viewer)
  function resolvePreprint(url, engine) {
    var u = String(url).trim();

    // arxiv: normalise /abs/, /pdf/, versioned and .pdf forms to a direct pdf URL
    var ax = u.match(/arxiv\.org\/(?:abs|pdf)\/([^?#]+?)(?:\.pdf)?$/i);
    if (ax) u = "https://arxiv.org/pdf/" + ax[1];

    // OSF: build the canonical download URL from the (possibly versioned) guid
    var isOsf = /(?:\/\/|\.|^)osf\.io\//i.test(u);
    if (isOsf && !/\/download(\/|$|\?)/i.test(u)) {
      var guid = u.split(/[?#]/)[0].replace(/\/+$/, "").split("/").pop();
      if (guid) u = "https://osf.io/" + guid + "/download";
    }

    var useGoogle = engine === "google" || (engine === "auto" && isOsf);
    if (useGoogle) {
      return "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(u);
    }
    return u;  // native iframe — arxiv, local files, direct PDFs
  }

  /* ---------- authors + affiliations + logos ---------- */
  safe(function () {
    var list = $("#authorsList");
    if (list && Array.isArray(C.authors)) {
      C.authors.forEach(function (au) {
        var card = el("article", "author reveal");
        var initials = au.name.split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
        card.appendChild(el("div", "author__avatar", initials));
        var nameEl = el("h3", "author__name", escapeHtml(au.name));
        if (Array.isArray(au.aff) && au.aff.length) {
          nameEl.appendChild(el("sup", null, au.aff.join(",")));
        }
        card.appendChild(nameEl);
        var affNames = (au.aff || []).map(function (n) { return (C.affiliations || [])[n - 1]; }).filter(Boolean);
        card.appendChild(el("p", "author__aff", escapeHtml(affNames.join(" · "))));
        var links = el("div", "author__links");
        [["Website", au.website], ["Scholar", au.scholar], ["ORCID", au.orcid]].forEach(function (pair) {
          if (!has(pair[1])) return;
          var a = el("a", null, pair[0]); a.href = pair[1]; links.appendChild(a);
        });
        card.appendChild(links);
        list.appendChild(card);
      });
    }
    var aff = $("#afflist");
    if (aff && Array.isArray(C.affiliations)) {
      C.affiliations.forEach(function (name, i) {
        aff.appendChild(el("li", null, "<sup>" + (i + 1) + "</sup>" + escapeHtml(name)));
      });
    }
    var logos = $("#logos");
    if (logos) {
      if (Array.isArray(C.logos) && C.logos.length) {
        C.logos.forEach(function (lg) {
          var slot = el("div", "logos__slot");
          var img = el("img"); img.src = lg.src; img.alt = lg.alt || "Logo";
          if (has(lg.link)) {
            var a = el("a"); a.href = lg.link; a.target = "_blank"; a.rel = "noopener";
            a.appendChild(img); slot.appendChild(a);
          } else {
            slot.appendChild(img);
          }
          logos.appendChild(slot);
        });
      } else {
        for (var i = 0; i < 4; i++) logos.appendChild(el("div", "logos__slot", "Logo"));
      }
    }
  });

  /* ---------- footer ---------- */
  safe(function () {
    var L = C.links || {};
    var fl = $("#footerLinks");
    if (fl) {
      [["Preprint PDF", L.pdf], ["Source code", L.code], ["Demo video", "#demo"],
        ["PubMed", L.pubmed], ["IEEE Xplore", L.ieeexplore]].forEach(function (pair) {
        if (!has(pair[1])) return;
        var a = el("a", null, pair[0]); a.href = pair[1]; fl.appendChild(a);
      });
    }
    var fa = $("#footerAuthors");
    if (fa && Array.isArray(C.authors)) {
      C.authors.forEach(function (au) {
        var a = el("a", null, escapeHtml(au.name));
        a.href = has(au.website) ? au.website : (has(au.scholar) ? au.scholar : "#");
        fa.appendChild(a);
      });
    }
    var em = $("#footerEmail");
    if (em) { if (has(C.contactEmail)) { em.textContent = C.contactEmail; em.href = "mailto:" + C.contactEmail; } else { em.hidden = true; } }
    setText("#footerNote", C.contactNote);
    var year = C.year || new Date().getFullYear();
    var copy = $("#footerCopy");
    if (copy) {
      copy.innerHTML = "© " + escapeHtml(String(year)) + " " + escapeHtml(C.copyrightHolder || "") +
          ". Content under <a href=\"" + (has(C.links && C.links.license) ? C.links.license : "#") + "\">" +
          escapeHtml(C.licenseName || "CC BY 4.0") + "</a> unless noted.";
    }
    var conf = $("#footerConf");
    if (conf && has(C.conferenceName)) {
      conf.innerHTML = "Built for <a href=\"" + (has(C.links && C.links.ieeevis) ? C.links.ieeevis : "#") + "\">" + escapeHtml(C.conferenceName) + "</a>.";
    }
  });

  function escapeHtml(s) {
    return String(s == null ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ================= INTERACTIONS ================= */

  /* nav shadow on scroll */
  var nav = $(".nav");
  function onScroll() { if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* mobile menu */
  var toggle = $(".nav__toggle"), menu = $("#mobileMenu");
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    $all("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  }

  /* scroll reveal */
  var reveals = $all(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (e) { e.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (e) { io.observe(e); });
  }

  /* active nav link */
  var navLinks = $all(".nav__links a");
  var sections = navLinks.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* copy to clipboard */
  $all("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = $(btn.getAttribute("data-copy")); if (!target) return;
      var text = target.innerText, label = $(".btn--copy__text", btn), original = label ? label.textContent : null;
      var done = function () {
        btn.classList.add("is-copied"); if (label) label.textContent = "Copied!";
        setTimeout(function () { btn.classList.remove("is-copied"); if (label && original) label.textContent = original; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else { fallbackCopy(text, done); }
    });
  });
  function fallbackCopy(text, cb) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }
  /* ---------- force external links to open in a new tab ---------- */
  safe(function () {
    $all("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (/^https?:\/\//i.test(href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    });
  });
})();