/* ========= Smooth scroll for nav ========= */
document.querySelectorAll('.nav a[href^="#"], .brand[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ========= Dynamic year ========= */
document.getElementById('year').textContent = new Date().getFullYear();

/* ========= Donate (host wallet modal) =========
   Tries window.openModal() from the host’s script.
   Shows friendly fallback if not yet ready. */
window.donateNow = function () {
  if (typeof window.openModal === 'function') {
    try { window.openModal(); return; }
    catch (e) { /* fall through */ }
  }
  alert('Donation widget not available right now. Please try again shortly.');
};

/* ========= Gallery (slideshow) ========= */

/* Fallback array if you don’t set data-files in HTML */
const GALLERY_FILES = [
  'DSC04148_result.JPG',
  'DSC04150_result.JPG',
];

let galleryFiles = [];
let currentIndex = 0;

(function setupGalleryPreview () {
  const preview = document.getElementById('galleryPreview');
  if (!preview) return;

  // Read list from data-files (case-sensitive)
  const attr = (preview.getAttribute('data-files') || '').trim();
  galleryFiles = attr ? attr.split(',').map(s => s.trim()).filter(Boolean) : GALLERY_FILES.slice();

  // Build preview tile
  const tile = preview.querySelector('.preview-tile');
  const imgEl = tile.querySelector('img');
  const countEl = tile.querySelector('.count');

  if (galleryFiles.length) {
    imgEl.src = `assets/gallery/${galleryFiles[0]}`;
  } else {
    imgEl.style.background = '#1c293d';
  }
  countEl.textContent = `(${galleryFiles.length})`;

  tile.addEventListener('click', () => openLightboxAt(0));
})();

/* --- Lightbox controls --- */
function openLightboxAt (index) {
  if (!galleryFiles.length) return;
  currentIndex = ((index % galleryFiles.length) + galleryFiles.length) % galleryFiles.length;

  const lb = document.getElementById('lightbox');
  const img = lb.querySelector('.lightbox__img');
  const idx = lb.querySelector('.lightbox__index');
  const tot = lb.querySelector('.lightbox__total');

  img.src = `assets/gallery/${galleryFiles[currentIndex]}`;
  img.alt = galleryFiles[currentIndex];
  idx.textContent = (currentIndex + 1);
  tot.textContent = galleryFiles.length.toString();

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

window.nextImage = function () { openLightboxAt(currentIndex + 1); };
window.prevImage = function () { openLightboxAt(currentIndex - 1); };

// Close when clicking backdrop
document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') closeLightbox();
});

// Keyboard: ESC closes; ← / → navigate
document.addEventListener('keydown', (e) => {
  const lbOpen = document.getElementById('lightbox')?.classList.contains('open');
  if (!lbOpen) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextImage();
  if (e.key === 'ArrowLeft')  prevImage();
});
