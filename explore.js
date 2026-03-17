/* ============================================================
   DROPDOWN HELPER — generic open/close for both dropdowns
   ============================================================ */
const allDropdowns = [];

function makeDropdown(btnId, dropdownId) {
  const btn      = document.getElementById(btnId);
  const dropdown = document.getElementById(dropdownId);

  function open() {
    /* Close every other dropdown before opening this one */
    allDropdowns.forEach(d => { if (d !== api) d.close(); });
    dropdown.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    dropdown.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.contains('active') ? close() : open();
  });

  /* Close when clicking outside */
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) close();
  });

  const api = { open, close, dropdown };
  allDropdowns.push(api);
  return api;
}

/* ============================================================
   AMPLIFIERS DROPDOWN
   ============================================================ */
const amp = makeDropdown('nav-amp', 'ampDropdown');

amp.dropdown.querySelectorAll('.amp-option').forEach(opt => {
  opt.addEventListener('click', () => {
    amp.close();
    openUnderconstr();
  });
});

/* ============================================================
   SPEAKER CABINETS DROPDOWN
   ============================================================ */
const cab = makeDropdown('nav-cab', 'cabDropdown');

cab.dropdown.querySelectorAll('.amp-option').forEach(opt => {
  opt.addEventListener('click', () => {
    cab.close();
    openUnderconstr();
  });
});

/* ============================================================
   OUR STORY — directly opens Under Construction
   ============================================================ */
document.getElementById('nav-story').addEventListener('click', openUnderconstr);

/* ============================================================
   UNDER CONSTRUCTION MODAL
   ============================================================ */
const underconstrOverlay  = document.getElementById('underconstrModal');
const btnCloseUnderconstr = document.getElementById('btnCloseUnderconstr');

function openUnderconstr() {
  underconstrOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeUnderconstr() {
  underconstrOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

btnCloseUnderconstr.addEventListener('click', closeUnderconstr);
underconstrOverlay.addEventListener('click', (e) => {
  if (e.target === underconstrOverlay) closeUnderconstr();
});

/* ============================================================
   CONTACT MODAL
   ============================================================ */
const contactOverlay = document.getElementById('contactModal');
const btnCloseModal  = document.getElementById('btnCloseModal');
const textarea       = document.getElementById('m-message');
const counter        = document.getElementById('charCounter');
const form           = document.getElementById('contactForm');
const status         = document.getElementById('formStatus');

function openContact() {
  contactOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('m-name').focus();
}

function closeContact() {
  contactOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('nav-contact').addEventListener('click', openContact);
btnCloseModal.addEventListener('click', closeContact);
contactOverlay.addEventListener('click', (e) => {
  if (e.target === contactOverlay) closeContact();
});

/* Escape closes everything */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeContact();
    closeUnderconstr();
    amp.close();
    cab.close();
  }
});

/* ── Character counter ── */
textarea.addEventListener('input', () => {
  counter.textContent = textarea.value.length + ' / 250';
});

/* ============================================================
   FORM SUBMISSION — Web3Forms via fetch
   ============================================================ */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('.btn-send');
  btn.disabled = true;
  btn.textContent = 'SENDING…';
  status.textContent = '';
  status.className = 'form-status';

  try {
    const data = new FormData(form);
    const res  = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data,
    });
    const json = await res.json();

    if (json.success) {
      status.textContent = 'MESSAGE SENT — THANK YOU!';
      status.classList.add('success');
      form.reset();
      counter.textContent = '0 / 250';
      setTimeout(closeContact, 2200);
    } else {
      throw new Error(json.message || 'Submission failed');
    }
  } catch (err) {
    status.textContent = 'SOMETHING WENT WRONG — PLEASE TRY AGAIN.';
    status.classList.add('error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'SEND';
  }
});
