// Footer year
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Active nav highlight
const sections = ['home','about','donate','help','contact'];
const navMap = new Map(sections.map(id => [id, document.querySelector(`.nav a[href="#${id}"]`)]));
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    const link = navMap.get(e.target.id);
    if (!link) return;
    if (e.isIntersecting){
      document.querySelectorAll('.nav a.active').forEach(a=>a.classList.remove('active'));
      link.classList.add('active');
    }
  });
},{rootMargin:'-40% 0px -50% 0px', threshold:0.01});
sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });

// Reveal-on-scroll
document.querySelectorAll('.about-card,.help-card,.gallery img,.card')
  .forEach(el => {
    el.classList.add('reveal');
    new IntersectionObserver(([e],o)=>{ if(e.isIntersecting){ e.target.classList.add('in'); o.unobserve(e.target); } }, {threshold:0.15}).observe(el);
  });

// Lightbox for gallery images
const gallery = document.querySelector('.gallery');
if (gallery){
  const lb = document.createElement('div'); lb.className = 'lightbox';
  const img = document.createElement('img'); lb.appendChild(img); document.body.appendChild(lb);
  gallery.addEventListener('click', e => { const t = e.target.closest('img'); if(!t) return; img.src = t.src; lb.classList.add('open'); });
  lb.addEventListener('click', () => lb.classList.remove('open'));
  window.addEventListener('keydown', e => (e.key === 'Escape') && lb.classList.remove('open'));
}

// Contact form demo
const form = document.querySelector('.contact-form');
if (form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if(!data.name || !data.email || !data.msg){ alert('Please fill in all fields.'); return; }
    form.reset();
    let note = form.querySelector('.success');
    if(!note){ note = document.createElement('p'); note.className='success'; note.textContent='Thanks! We will get back to you soon.'; form.appendChild(note); }
    note.style.display='block'; setTimeout(()=> note.style.display='none', 5000);
  });
}
