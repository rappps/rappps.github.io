# Rafyandi Portfolio

## Struktur folder

```
rafyandi-portfolio/
├── index.html                 # Markup saja, tanpa <style>/<script> inline
├── README.md
└── assets/
    ├── css/
    │   ├── style.css          # Variabel, base, layout, section utama, media queries
    │   └── components.css     # Komponen baru: tombol bahasa, Projects, tombol love
    ├── js/
    │   ├── scrollreveal.min.js  # Library ScrollReveal (vendor)
    │   ├── i18n.js            # Data terjemahan ID + teks Typed (EN/ID)
    │   ├── main.js            # Menu, skills, scroll, tema, scroll reveal, filter project, love
    │   └── language.js        # Logika ganti bahasa EN/ID + inisialisasi Typed
    ├── img/                   # test.png, rafyandi.png, about.jpg  (dari project lama)
    │   └── projects/          # gambar tiap project (lihat bagian di bawah)
    └── pdf/                   # resume-rafyandi.pdf                (dari project lama)
```

## Urutan load script (penting)

1. Typed.js (CDN)
2. `scrollreveal.min.js`
3. `i18n.js` — mendefinisikan `I18N_ID` dan `TYPED_STRINGS`
4. `main.js` — mendefinisikan `setSkillHeights()`
5. `language.js` — memakai semua di atas

## Dependensi eksternal (CDN)

- Unicons v4.0.0 — `https://unicons.iconscout.com/release/v4.0.0/css/line.css`
- Boxicons 2.1.1 — `https://unpkg.com/boxicons@2.1.1/css/boxicons.min.css`
- Typed.js 2.0.12 — `https://cdn.jsdelivr.net/npm/typed.js@2.0.12`
- Google Font Outfit — di-`@import` dari `style.css`

## Menambah terjemahan

Tambahkan pasangan `"Teks English": "Teks Indonesia"` di `assets/js/i18n.js`.
Key harus sama persis dengan teks di HTML (spasi berlebih diabaikan).

## Gambar project

Letakkan gambar di `assets/img/projects/` dengan nama file berikut (format `.jpg`,
rasio 16:9 disarankan, mis. 1280x720). Jika file belum ada, otomatis tampil
placeholder "No image yet". Klik gambar untuk memperbesar.

- `ellipse-cloud-migration.jpg`
- `data-warehouse-and-hpp-asset-management-dashboard.jpg`
- `chart-of-account-coa-restructuring.jpg`
- `technical-training.jpg`
- `deadstock-dashboard-and-recommended-order-monitoring.jpg`
- `fixed-asset-fiscal-data-migration-and-audit-adjustment.jpg`
- `inventory-dashboard-improvement.jpg`
- `inventory-category-implementation.jpg`
- `ellipse-update-patches-9-0-46.jpg`
- `laju-dinamika-utama-ellipse-9-implementation.jpg`
- `mitrabara-finance-digitalization.jpg`
- `ellipse-roll-out-operation-at-baramulti-terminal-service-bts.jpg`
- `ellipse-mine-operation-optimization-baramulti-mmm.jpg`
- `baramulti-marine-group-ellipse-9-implementation.jpg`
- `data-warehouse-implementation-at-pt-agm-and-pt-bssr.jpg`
- `pt-bukit-multi-investama-bmi-ellipse-9-finance-implementation.jpg`
- `mitra-karya-prima-ellipse-9-upgrade.jpg`
- `pt-darma-henwa-scm-and-fa-ellipse-9-enhancement.jpg`
- `indexim-kmia-ellipse-smart-mining-implementation.jpg`

Mau pakai `.png` atau lebih dari 1 gambar? Ubah/tambah `<img>` di dalam
`<div class="project__gallery">` pada project terkait di `index.html`:

```html
<div class="project__gallery">
  <img src="assets/img/projects/nama-1.png" alt="..." class="project__img" loading="lazy" />
  <img src="assets/img/projects/nama-2.png" alt="..." class="project__img" loading="lazy" />
  <span class="project__img-empty"><i class="uil uil-image"></i> No image yet</span>
</div>
```
