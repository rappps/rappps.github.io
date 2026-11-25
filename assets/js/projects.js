/* ==========================================================
   PROJECTS
   Data dibaca dari assets/data/projects.json, lalu dirender ke:
   - dropdown filter client (#project-filter)
   - list project (#project-list): list + detail (desktop) / accordion (mobile)
   Termasuk: filter, accordion, gallery dinamis, dan lightbox gambar.
   Butuh: i18n.js (I18N_ID), language.js (i18nRegister)
   ========================================================== */

const PROJECTS_URL = "assets/data/projects.json";

const projectFilter = document.getElementById("project-filter"),
  projectList = document.getElementById("project-list"),
  desktopQuery = window.matchMedia("(min-width: 1023px)");

let projectItems = [];

/* ---------- HELPER: buat elemen (pakai textContent agar aman dari HTML injection) ---------- */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  return el("i", "uil " + name);
}

/* ---------- RENDER: dropdown filter ---------- */
function renderFilter(data) {
  // Hitung jumlah project per client, urutkan terbanyak dulu (seri = urutan muncul)
  const counts = {};
  data.projects.forEach((p) => (counts[p.client] = (counts[p.client] || 0) + 1));
  const codes = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

  const total = data.projects.length;
  const allLabel = "All (" + total + ")";
  // Terjemahan dinamis untuk label "All (n)"
  if (typeof I18N_ID !== "undefined") I18N_ID[allLabel] = "Semua (" + total + ")";

  projectFilter.innerHTML = "";
  projectFilter.appendChild(Object.assign(el("option", "", allLabel), { value: "all" }));
  codes.forEach((code) => {
    const client = data.clients[code] || {};
    const label = (client.short || client.name || code) + " (" + counts[code] + ")";
    projectFilter.appendChild(Object.assign(el("option", "", label), { value: code }));
  });
}

/* ---------- RENDER: satu item project ---------- */
function renderProject(p, clients) {
  const clientName = (clients[p.client] || {}).name || p.client;
  const li = el("li", "project__item");
  li.dataset.client = p.client;

  // Header baris (judul, client, periode)
  const head = el("button", "project__head");
  head.type = "button";
  head.setAttribute("aria-expanded", "false");
  const headText = el("span", "project__head-text");
  const sub = el("span", "project__sub");
  sub.append(el("span", "", clientName), el("span", "project__dot", "•"), el("span", "", p.period));
  headText.append(el("span", "project__name", p.title), sub);
  head.append(headText, icon("uil-angle-right-b project__arrow"));

  // Detail
  const body = el("div", "project__body");

  const client = el("span", "project__client");
  client.append(icon("uil-building"), " ", el("span", "", clientName));

  const meta = el("div", "project__meta");
  const loc = el("span");
  loc.append(icon("uil-map-marker-alt"), " ", el("span", "", p.location));
  const per = el("span");
  per.append(icon("uil-calendar-alt"), " ", el("span", "", p.period));
  meta.append(loc, per);

  const tags = el("div", "project__tags");
  (p.tags || []).forEach((t) => tags.appendChild(el("span", "project__tag", t)));

  const resp = el("ol", "project__resp");
  (p.responsibilities || []).forEach((r) => resp.appendChild(el("li", "", r)));

  const gallery = el("div", "project__gallery");
  (p.images || []).forEach((src, i) => {
    const img = el("img", "project__img");
    img.alt = p.images.length > 1 ? p.title + " (" + (i + 1) + ")" : p.title;
    img.loading = "lazy";
    img.addEventListener("error", () => markMissing(img));
    img.addEventListener("click", () => openLightbox(img));
    img.src = src;
    gallery.appendChild(img);
  });
  const empty = el("span", "project__img-empty");
  empty.append(icon("uil-image"), " ", el("span", "", "No image yet"));
  gallery.appendChild(empty);
  if (!p.images || !p.images.length) gallery.classList.add("is-empty");

  body.append(
    client,
    el("h3", "project__title", p.title),
    meta,
    el("p", "project__desc", p.description),
    tags,
    el("h4", "project__resp-title", "Key responsibilities"),
    resp,
    gallery
  );

  li.append(head, body);

  head.addEventListener("click", () => {
    // Mobile: klik item yang sedang terbuka = tutup (accordion)
    // Desktop: selalu ada satu project yang tampil di panel detail
    if (li.classList.contains("is-active") && !desktopQuery.matches) setActiveProject(null);
    else setActiveProject(li);
  });

  layoutGallery(gallery);
  return li;
}

/* ---------- STATE: project aktif ---------- */
function setActiveProject(item) {
  projectItems.forEach((it) => {
    const active = it === item;
    it.classList.toggle("is-active", active);
    it.querySelector(".project__head").setAttribute("aria-expanded", active);
  });
}

/* ---------- FILTER ---------- */
projectFilter.addEventListener("change", () => {
  const filter = projectFilter.value;
  let firstVisible = null;

  projectItems.forEach((item) => {
    const show = filter === "all" || item.dataset.client === filter;
    item.hidden = !show;
    if (show && !firstVisible) firstVisible = item;
  });

  projectList.scrollTop = 0;
  setActiveProject(firstVisible);
});

// Pindah dari mobile ke desktop tanpa project aktif -> buka yang pertama terlihat
desktopQuery.addEventListener("change", (e) => {
  if (e.matches && !projectList.querySelector(".project__item.is-active")) {
    setActiveProject(projectItems.find((it) => !it.hidden) || null);
  }
});

/* ---------- GALLERY ---------- */
// Gambar yang gagal dimuat disembunyikan; jika semua gagal, tampilkan placeholder
function markMissing(img) {
  img.classList.add("is-missing");
  const gallery = img.closest(".project__gallery");
  if (!gallery) return;
  if (!gallery.querySelector(".project__img:not(.is-missing)")) gallery.classList.add("is-empty");
  layoutGallery(gallery);
}

/* Baris seimbang, maksimal 3 gambar per baris
   1 -> 1 | 2 -> 2 | 3 -> 3 | 4 -> 2+2 | 5 -> 3+2 | 6 -> 3+3 | 7 -> 3+2+2 ...
   Grid punya 6 kolom: 1 gambar/baris = span 6, 2 = span 3, 3 = span 2 */
function layoutGallery(gallery) {
  const imgs = [...gallery.querySelectorAll(".project__img:not(.is-missing)")];
  const n = imgs.length;
  if (!n) return;

  const rows = Math.ceil(n / 3);
  const base = Math.floor(n / rows);
  const extra = n % rows;

  let i = 0;
  for (let r = 0; r < rows; r++) {
    const perRow = base + (r < extra ? 1 : 0);
    for (let k = 0; k < perRow; k++, i++) imgs[i].style.setProperty("--span", 6 / perRow);
  }
}

/* ---------- LIGHTBOX ---------- */
const lightbox = el("div", "lightbox");
lightbox.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close">&times;</button><img class="lightbox__img" alt="" />';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector(".lightbox__img");

function openLightbox(img) {
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add("show");
}

function closeLightbox() {
  lightbox.classList.remove("show");
  lightboxImg.src = "";
}

lightbox.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("show")) closeLightbox();
});

/* ---------- LOAD DATA ---------- */
async function loadProjects() {
  try {
    const res = await fetch(PROJECTS_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    renderFilter(data);
    projectList.innerHTML = "";
    projectItems = data.projects.map((p) => renderProject(p, data.clients));
    projectList.append(...projectItems);
    setActiveProject(projectItems[0] || null);

    // Daftarkan teks baru ke sistem terjemahan EN/ID
    if (typeof i18nRegister === "function") {
      i18nRegister(projectFilter);
      i18nRegister(projectList);
    }
  } catch (err) {
    console.error("Gagal memuat " + PROJECTS_URL, err);
    projectList.innerHTML = "";
    projectList.appendChild(el("li", "projects__error", "Projects could not be loaded."));
  }
}

loadProjects();
