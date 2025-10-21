// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Open the provider's wallet modal once their script defines window.openModal()
function waitForModalAndOpen(timeoutMs = 4000){
  const start = Date.now();
  (function tryOpen(){
    if (typeof window.openModal === 'function'){
      try { window.openModal(); } catch (e) { console.error(e); }
    } else if (Date.now() - start < timeoutMs){
      setTimeout(tryOpen, 250);
    } else {
      alert('Donation widget is still loading. Please try again in a moment.');
    }
  })();
}

function handleDonateClick(ev){
  if (ev) ev.preventDefault();
  waitForModalAndOpen();
}

document.getElementById('donateBtn')?.addEventListener('click', handleDonateClick);
document.getElementById('donateNav')?.addEventListener('click', handleDonateClick);
