// Puppy Shelter Coin — Stage 3 JS
// Features: footer year, active nav highlight, reveal-on-scroll, gallery lightbox, contact form handler

// 1) Footer year
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 2) Active nav highlight while scrolling
const sections = ['home', 'about', 'donate', 'help', 'contact'];
const navMap = new Map(
  sections.map(id => [id, document.querySelector(`.nav a[href="#${id}"]`)])
);
const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = navMap.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav a.active').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  },
  // Trigger when ~40% of the section is visible
  { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 }
);
sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

// 3) Reveal-on-scroll animations (no HTML changes needed)
const revealEls = document.querySelectorAll(
  '.about-card, .story, .help-card, .gallery img, .card'
);
revealEls.forEach(el => el.classList.add('reveal'));
const revealObs = new IntersectionObserver(
  es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach(el => revealObs.observe(el));

// 4) Gallery lightbox (click any gallery image to zoom; click background or press Esc to close)
const gallery = document.querySelector('.gallery');
if (gallery) {
  // Build lightbox once
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  const lbImg = document.createElement('img');
  lb.appendChild(lbImg);
  document.body.appendChild(lb);

  gallery.addEventListener('click', e => {
    const img = e.target.closest('img');
    if (!img) return;
    lbImg.src = img.src;
    lb.classList.add('open');
  });
  lb.addEventListener('click', () => lb.classList.remove('open'));
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') lb.classList.remove('open');
  });
}

// 5) Contact form (demo: validates and shows a quick thank-you)
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.msg) {
      alert('Please fill in all fields.');
      return;
    }
    form.reset();

    // Show inline success message briefly
    let note = form.querySelector('.success');
    if (!note) {
      note = document.createElement('p');
      note.className = 'success';
      note.textContent = 'Thanks! We will get back to you soon.';
      form.appendChild(note);
    }
    note.style.display = 'block';
    setTimeout(() => (note.style.display = 'none'), 5000);
  });
}
