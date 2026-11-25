/* ==========================================================
   LANGUAGE SWITCH (EN / ID) + TYPED TEXT
   Butuh: Typed.js (CDN), i18n.js (I18N_ID, TYPED_STRINGS),
          main.js (setSkillHeights)
   ========================================================== */

const langButton = document.getElementById("lang-button");
const langLabel = document.getElementById("lang-label");
const normText = (t) => t.replace(/\s+/g, " ").trim();

/* ---------- TYPED TEXT ---------- */
let typed = null;

function startTyped(lang) {
  if (typeof Typed === "undefined") return;
  if (typed) {
    try { typed.destroy(); } catch (e) {}
  }
  const span = document.querySelector(".auto-type");
  if (span) span.textContent = "";
  typed = new Typed(".auto-type", {
    strings: TYPED_STRINGS[lang],
    typeSpeed: 100,
    backSpeed: 0,
    backDelay: 1000,
    loop: true,
  });
}

/* ---------- KUMPULKAN TEKS YANG BISA DITERJEMAHKAN (sumber = English) ---------- */
const i18nNodes = [];
const i18nAttrs = [];

function translateNode(it, lang) {
  if (lang === "en") {
    it.node.nodeValue = it.en;
    return;
  }
  const tr = I18N_ID[normText(it.en)];
  if (tr !== undefined) {
    const lead = it.en.match(/^\s*/)[0];
    const trail = it.en.match(/\s*$/)[0];
    it.node.nodeValue = lead + tr + trail;
  }
}

function translateAttr(it, lang) {
  const tr = lang === "en" ? it.en : I18N_ID[normText(it.en)];
  it.el.setAttribute(it.attr, tr !== undefined ? tr : it.en);
}

// Daftarkan teks di dalam `root`. Dipanggil sekali untuk body,
// dan dipanggil lagi oleh projects.js setelah list project dirender.
function i18nRegister(root, applyNow = true) {
  const newNodes = [];
  const newAttrs = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const el = n.parentElement;
    if (!el || el.closest("script, style, .auto-type, .typed-cursor, #lang-button")) continue;
    if (!n.nodeValue.trim()) continue;
    newNodes.push({ node: n, en: n.nodeValue });
  }

  [root, ...root.querySelectorAll("[placeholder], [title]")].forEach((el) => {
    if (el.id === "lang-button") return;
    ["placeholder", "title"].forEach((attr) => {
      if (el.hasAttribute(attr)) newAttrs.push({ el, attr, en: el.getAttribute(attr) });
    });
  });

  i18nNodes.push(...newNodes);
  i18nAttrs.push(...newAttrs);

  if (applyNow && currentLang !== "en") {
    newNodes.forEach((it) => translateNode(it, currentLang));
    newAttrs.forEach((it) => translateAttr(it, currentLang));
  }
}

i18nRegister(document.body, false);

/* ---------- TERAPKAN BAHASA ---------- */
function applyLanguage(lang) {
  i18nNodes.forEach((it) => translateNode(it, lang));
  i18nAttrs.forEach((it) => translateAttr(it, lang));

  document.documentElement.lang = lang;
  langLabel.textContent = lang.toUpperCase();
  const next = lang === "en" ? "Bahasa Indonesia" : "English";
  langButton.setAttribute("aria-label", "Change language to " + next);
  langButton.setAttribute("title", "Change language to " + next);

  startTyped(lang);
  if (typeof setSkillHeights === "function") setSkillHeights();
}

/* ---------- INIT ---------- */
let currentLang = "en"; // default: English
try {
  if (localStorage.getItem("selected-lang") === "id") currentLang = "id";
} catch (e) {}

if (currentLang === "en") startTyped("en");
else applyLanguage(currentLang);

langButton.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "id" : "en";
  applyLanguage(currentLang);
  try { localStorage.setItem("selected-lang", currentLang); } catch (e) {}
});
