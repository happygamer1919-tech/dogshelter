/* -------------------------------------------
   Dalyan Dog - Front-end interactions
   ------------------------------------------- */

/* ---- utilities ---- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---- year in footer ---- */
$("#year").textContent = new Date().getFullYear();

/* ---- mobile nav ---- */
(() => {
  const btn  = $(".nav-toggle");
  const menu = $("#navMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("open", !open);
  });

  // close on click
  $$("#navMenu a").forEach(a => {
    a.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    });
  });
})();

/* ---- smooth scroll for anchor links ---- */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.getElementById(id.slice(1));
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ---- lazy load gallery images from assets/gallery/ ----
   - Lists a fixed set of common image names (you can rename later)
   - Any missing files are skipped gracefully                       */
(async function buildGallery() {
  const grid = $("#galleryGrid");
  if (!grid) return;

  // If you know exact filenames, list them here:
  const candidates = [
    "DSC04148.JPG","DSC04150.JPG","DSC04152.JPG","DSC04215.JPG",
    "DSC04219.JPG","DSC04222.JPG","DSC04223.JPG","DSC04229.JPG",
    // add more names as you upload
  ];

  // Create tiles & probe existence
  const checks = candidates.map(async (name) => {
    const url = `assets/gallery/${name}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) return null;
      const item = document.createElement("button");
      item.className = "g-item";
      item.setAttribute("type","button");
      item.setAttribute("aria-label","Open image");
      item.innerHTML = `<img src="${url}" alt="Shelter photo" loading="lazy">`;
      item.addEventListener("click", () => openLightbox(url));
      return item;
    } catch {
      return null;
    }
  });

  const tiles = (await Promise.all(checks)).filter(Boolean);
  if (!tiles.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "Upload photos to assets/gallery/ and they will appear here.";
    grid.appendChild(p);
  } else {
    tiles.forEach(t => grid.appendChild(t));
  }
})();

/* ---- simple lightbox ---- */
let lightbox;
function openLightbox(src) {
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <button class="lb-close" aria-label="Close">&times;</button>
      <img class="lb-img" alt="Gallery image">
    `;
    document.body.appendChild(lightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lb-close")) {
        lightbox.classList.remove("open");
      }
    });
  }
  $(".lb-img", lightbox).src = src;
  lightbox.classList.add("open");
}

/* =========================================================
   DONATIONS
   Host requires:
   1) A literal onclick="openModal()" on a button (done in HTML)
   2) External <script type="module" src="https://dalyandog.net/_nuxt/assets/index.js">
   We provide a safe stub so clicking before the widget loads still works.
   ========================================================= */

/* Promise that resolves when the external widget is available (best effort) */
const widgetLoaded = new Promise((resolve) => {
  // Resolve ASAP if widget already defined
  if (typeof window.openModal === "function" && window.openModal.name !== "openModal") {
    resolve();
    return;
  }
  // Poll briefly for availability
  const started = Date.now();
  const timer = setInterval(() => {
    const ready =
      typeof window.openModal === "function" &&
      window.openModal.name !== "openModal"; // replaced by real widget
    if (ready || Date.now() - started > 8000) {
      clearInterval(timer);
      resolve();
    }
  }, 200);
});

/* Safe stub so the onclick is always defined and never errors.
   If the real widget later overrides openModal, we'll call that one. */
window.openModal = async function openModal() {
  try {
    await widgetLoaded;
    // if the widget replaced our stub, call it
    if (typeof window.openModal === "function" && window.openModal !== openModal) {
      return window.openModal();
    }
  } catch {
    // ignore
  }
  // graceful fallback (prevents dead clicks)
  window.location.href = "mailto:dalyandog@gmail.com?subject=Donate%20to%20Dalyan%20Dog";
};

/* Also bind the hero button via JS (in case future markup changes remove onclick) */
$("#donateBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  window.openModal();
});

/* ---- small niceties ---- */
(() => {
  // reduce hash-jump offset for sticky header
  if (location.hash) {
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }
})();
