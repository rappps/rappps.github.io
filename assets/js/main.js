/* ==========================================================
   MAIN JS
   1. Menu show / hide
   2. Skills accordion
   3. Scroll: active link, header shadow, scroll-up button
   4. Dark / light theme
   5. Scroll reveal
   6. Projects filter
   7. Love toggle
   ========================================================== */

/* ---------- 1. MENU SHOW / HIDE ---------- */
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
    navToggle.classList.add("is-hidden");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
    navToggle.classList.remove("is-hidden");
  });
}

// Tutup menu mobile saat link diklik
function linkAction() {
  navMenu.classList.remove("show-menu");
  navToggle.classList.remove("is-hidden");
}
document.querySelectorAll(".nav__link").forEach((n) => n.addEventListener("click", linkAction));

/* ---------- 2. SKILLS ACCORDION ---------- */
const skillsContent = document.getElementsByClassName("skills__content"),
  skillsHeader = document.querySelectorAll(".skills__header");

function toggleSkills() {
  const itemClass = this.parentNode.className;

  for (let i = 0; i < skillsContent.length; i++) {
    skillsContent[i].className = "skills__content skills__close";
  }
  if (itemClass === "skills__content skills__close") {
    this.parentNode.className = "skills__content skills__open";
  }
  setSkillHeights();
}

// Set tinggi persis agar animasi buka/tutup halus
function setSkillHeights() {
  document.querySelectorAll(".skills__content").forEach((content) => {
    const isOpen = content.classList.contains("skills__open");
    content.querySelectorAll(".skills__box").forEach((box) => {
      box.style.maxHeight = isOpen ? box.scrollHeight + "px" : "0px";
    });
  });
}

setSkillHeights();
window.addEventListener("resize", () => {
  document.querySelectorAll(".skills__open .skills__box").forEach((box) => {
    box.style.maxHeight = box.scrollHeight + "px";
  });
});

skillsHeader.forEach((el) => el.addEventListener("click", toggleSkills));

/* ---------- 3. SCROLL ---------- */
const sections = document.querySelectorAll("section[id]");

// Active link sesuai section yang terlihat
function scrollActive() {
  const scrollY = window.pageYOffset;
  // Desktop: navbar di atas -> offset = tinggi navbar; mobile: navbar di bawah
  const header = document.getElementById("header");
  const offset = header.getBoundingClientRect().top < 10 ? header.offsetHeight + 20 : 50;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - offset;
    const sectionId = current.getAttribute("id");
    const link = document.querySelector(".nav__menu a[href*=" + sectionId + "]");
    if (!link) return;

    // Mentok di bawah halaman -> section terakhir yang aktif
    const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    const isLast = current === sections[sections.length - 1];
    const inView = scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;

    if (atBottom ? isLast : inView) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

// Shadow header saat scroll > 80px
function scrollHeader() {
  const nav = document.getElementById("header");
  if (window.scrollY >= 80) nav.classList.add("scroll-header");
  else nav.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

// Tampilkan tombol scroll-up saat scroll > 560px
function scrollUp() {
  const scrollUpBtn = document.getElementById("scroll-up");
  if (window.scrollY >= 560) scrollUpBtn.classList.add("show-scroll");
  else scrollUpBtn.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);

// Klik tombol scroll-up -> kembali ke Home dengan smooth (tanpa reload / ubah URL)
document.getElementById("scroll-up").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- 4. DARK / LIGHT THEME ---------- */
const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const iconTheme = "uil-sun";

const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () => (document.body.classList.contains(darkTheme) ? "dark" : "light");
const getCurrentIcon = () => (themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun");

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme);
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](iconTheme);
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});

/* ---------- 5. SCROLL REVEAL ---------- */
const sr = ScrollReveal({
  origin: "left",
  distance: "60px",
  duration: 2500,
  delay: 400,
  // reset: true /* ulangi animasi */
});

sr.reveal(`.section__title, .section__subtitle, .contact__title`, { origin: "top" });
sr.reveal(`.home__social`);
sr.reveal(`.home__data`, { delay: 1100, interval: 100 });
sr.reveal(`.home__img`, { delay: 1100, interval: 100, origin: "right" });
sr.reveal(`.about__data, .qualification__content:nth-child(1)`, { origin: "left" });
sr.reveal(`.about__info, .qualification__content:nth-child(2)`, { origin: "right" });
sr.reveal(`.projects__container`, { origin: "top" });
sr.reveal(`.skills__content, .contact__card, .contact__form-div, .contact__send`, { interval: 100, origin: "top" });
sr.reveal(`.footer__title, .footer__description, .footer__social`, { interval: 100, origin: "top" });
sr.reveal(`.footer__copy`, { origin: "bottom" });

/* ---------- 6. PROJECTS (filter dropdown + list/detail) ---------- */
const projectFilter = document.getElementById("project-filter"),
  projectItems = document.querySelectorAll(".project__item"),
  desktopQuery = window.matchMedia("(min-width: 1023px)");

function setActiveProject(item) {
  projectItems.forEach((it) => {
    const active = it === item;
    it.classList.toggle("is-active", active);
    it.querySelector(".project__head").setAttribute("aria-expanded", active);
  });
}

projectItems.forEach((item) => {
  item.querySelector(".project__head").addEventListener("click", () => {
    // Mobile: klik item yang sedang terbuka = tutup (accordion)
    // Desktop: selalu ada satu project yang tampil di panel detail
    if (item.classList.contains("is-active") && !desktopQuery.matches) {
      setActiveProject(null);
    } else {
      setActiveProject(item);
    }
  });
});

if (projectFilter) {
  projectFilter.addEventListener("change", () => {
    const filter = projectFilter.value;
    let firstVisible = null;

    projectItems.forEach((item) => {
      const show = filter === "all" || item.dataset.client === filter;
      item.hidden = !show;
      if (show && !firstVisible) firstVisible = item;
    });

    document.getElementById("project-list").scrollTop = 0;
    setActiveProject(firstVisible);
  });
}

// Pindah dari mobile ke desktop tanpa project aktif -> buka yang pertama terlihat
desktopQuery.addEventListener("change", (e) => {
  if (e.matches && !document.querySelector(".project__item.is-active")) {
    setActiveProject([...projectItems].find((it) => !it.hidden) || null);
  }
});

/* ---------- 6b. PROJECT IMAGES ---------- */
// Gambar yang gagal dimuat disembunyikan; jika semua gagal, tampilkan placeholder
function markMissing(img) {
  img.classList.add("is-missing");
  const gallery = img.closest(".project__gallery");
  if (!gallery) return;
  if (!gallery.querySelector(".project__img:not(.is-missing)")) {
    gallery.classList.add("is-empty");
  }
  layoutGallery(gallery);
}

/* Layout gallery mobile: baris seimbang, maksimal 3 gambar per baris
   1 -> 1 | 2 -> 2 | 3 -> 3 | 4 -> 2+2 | 5 -> 3+2 | 6 -> 3+3 | 7 -> 3+2+2 ...
   Grid mobile punya 6 kolom: 1 gambar/baris = span 6, 2 = span 3, 3 = span 2 */
function layoutGallery(gallery) {
  const imgs = [...gallery.querySelectorAll(".project__img:not(.is-missing)")];
  const n = imgs.length;
  if (!n) return;

  const rows = Math.ceil(n / 3);
  const base = Math.floor(n / rows);
  const extra = n % rows; // baris awal mendapat 1 gambar tambahan

  let i = 0;
  for (let r = 0; r < rows; r++) {
    const perRow = base + (r < extra ? 1 : 0);
    for (let k = 0; k < perRow; k++, i++) {
      imgs[i].style.setProperty("--span", 6 / perRow);
    }
  }
}

document.querySelectorAll(".project__gallery").forEach(layoutGallery);

document.querySelectorAll(".project__img").forEach((img) => {
  if (img.complete && img.naturalWidth === 0) markMissing(img);
  img.addEventListener("error", () => markMissing(img));
});

// Lightbox: klik gambar untuk memperbesar, klik di mana saja / Esc untuk menutup
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close">&times;</button><img class="lightbox__img" alt="" />';
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector(".lightbox__img");

function closeLightbox() {
  lightbox.classList.remove("show");
  lightboxImg.src = "";
}

document.querySelectorAll(".project__img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("show");
  });
});

lightbox.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("show")) closeLightbox();
});

/* ---------- 7. LOVE TOGGLE ---------- */
// Garis (Unicons uil-heart) <-> penuh (Boxicons bxs-heart)
const loveIcon = document.getElementById("love-icon");

function toggleLove() {
  const liked = loveIcon.classList.toggle("liked");
  loveIcon.classList.toggle("uil", !liked);
  loveIcon.classList.toggle("uil-heart", !liked);
  loveIcon.classList.toggle("bx", liked);
  loveIcon.classList.toggle("bxs-heart", liked);
  loveIcon.setAttribute("aria-pressed", liked);
}

if (loveIcon) {
  loveIcon.addEventListener("click", toggleLove);
  loveIcon.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleLove();
    }
  });
}
