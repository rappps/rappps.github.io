/* ==========================================================
   PARALLAX (scroll + mouse)
   Atribut pada elemen:
   - data-parallax="<speed>" : geser vertikal saat SCROLL
       positif (0.3)  = lebih lambat dari scroll -> terasa jauh (latar)
       negatif (-0.1) = lebih cepat dari scroll  -> terasa dekat
   - data-depth="<px>"       : geser mengikuti KURSOR (desktop saja)
       positif (50)   = bergerak berlawanan arah kursor -> terasa jauh
       negatif (-12)  = bergerak searah kursor          -> terasa dekat
       nilainya = jarak geser maksimum saat kursor di tepi layar (dibagi 2)
   Memakai properti CSS `translate` (bukan `transform`) agar tidak bentrok
   dengan animasi ScrollReveal. Nonaktif jika "kurangi animasi" aktif.
   ========================================================== */

(function () {
  const items = [...document.querySelectorAll("[data-parallax], [data-depth]")].map((el) => ({
    el,
    speed: parseFloat(el.dataset.parallax) || 0,
    depth: parseFloat(el.dataset.depth) || 0,
    section: el.closest("section") || el.parentElement,
  }));
  if (!items.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Mouse parallax hanya untuk desktop dengan mouse (bukan layar sentuh)
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1023px)");

  let targetX = 0, targetY = 0; // posisi kursor (-0.5 .. 0.5)
  let curX = 0, curY = 0;       // posisi yang dihaluskan (easing)
  let rafId = null;

  function render() {
    const vh = window.innerHeight;

    items.forEach((it) => {
      if (reduceMotion.matches) {
        it.el.style.translate = "";
        return;
      }

      // Posisi dihitung dari section induk (tidak ikut bergeser) agar tidak "goyang"
      const rect = it.section.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return; // di luar layar, lewati

      // Scroll: section di awal halaman (Home) mulai dari 0 saat belum di-scroll
      const offset = it.section.offsetTop < vh ? -rect.top : vh / 2 - (rect.top + rect.height / 2);
      const scrollY = offset * it.speed;

      // Mouse
      const mouseX = -curX * it.depth;
      const mouseY = -curY * it.depth;

      it.el.style.translate = mouseX.toFixed(1) + "px " + (scrollY + mouseY).toFixed(1) + "px";
    });
  }

  // Loop animasi: haluskan gerakan mouse, berhenti sendiri jika sudah diam
  function loop() {
    curX += (targetX - curX) * 0.08;
    curY += (targetY - curY) * 0.08;
    render();

    if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  }

  function kick() {
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", kick);

  window.addEventListener(
    "mousemove",
    (e) => {
      if (!finePointer.matches || reduceMotion.matches) return;
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
      kick();
    },
    { passive: true }
  );

  // Kursor keluar jendela -> kembali ke posisi semula dengan halus
  document.documentElement.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
    kick();
  });

  finePointer.addEventListener("change", () => {
    targetX = 0;
    targetY = 0;
    kick();
  });
  reduceMotion.addEventListener("change", kick);

  render();
})();
