/* ========= Smooth scroll for nav ========= */
document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ========= Year ========= */
document.getElementById('year').textContent = new Date().getFullYear();

/* ========= Wallet modal integration =========
   - The host provides window.openModal() when the script in <head> is loaded.
   - We try to call it; if not ready, show a gentle message.
*/
window.donateNow = function donateNow () {
  try {
    if (typeof window.openModal === 'function') {
      window.openModal();               // host-provided
      return;
    }
  } catch (e) {
    alert('Donation widget not available right now. Please try again shortly.');
    return;
  }
  alert('Donation widget is still loading. Please try again in a moment.');
};

/* ========= Stories images =========
   Expects assets/stories/Hope.JPG, Max.JPG, Luna.JPG
   Case-sensitive names (as uploaded).
*/
(function attachStoryImages () {
  document.querySelectorAll('.story-card').forEach(card => {
    const fn = card.getAttribute('data-img');
    const media = card.querySelector('.story-media');
    if (fn && media) {
      media.style.backgroundImage = `url(assets/stories/${fn})`;
    }
  });
})();

/* ========= Gallery =========
   Two ways to provide file names (case-sensitive):
   1) Put a comma-separated list in #galleryGrid data-files
   2) Or edit the GALLERY_FILES array below
*/
const GALLERY_FILES = [
  // Example fallback; add more or leave empty if you use data-files in HTML
  'DSC04148_result.JPG',
  'DSC04150_result.JPG',
];

(function buildGallery () {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // From data-files attribute?
  const attr = (grid.getAttribute('data-files') || '').trim();
  let files = [];
  if (attr.length) {
    files = attr.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    files = GALLERY_FILES.slice();
  }

  // Render tiles
  grid.innerHTML = '';
  files.forEach(name => {
    const fig = document.createElement('figure');
    fig.innerHTML = `<img loading="lazy" src="assets/gallery/${name}" alt="${name}" />`;
    fig.addEventListener('click', () => openLightbox(`assets/gallery/${name}`, name));
    grid.appendChild(fig);
  });
})();

/* ========= Lightbox ========= */
function openLightbox (src, alt) {
  const lb = document.getElementById('lightbox');
  const img = lb.querySelector('.lightbox__img');
  img.src = src; img.alt = alt || '';
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
}
window.closeLightbox = function () {
  const lb = document.getElementById('lightbox');
  const img = lb.querySelector('.lightbox__img');
  img.src = ''; img.alt = '';
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
};
// Close lightbox on backdrop click or ESC
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});
