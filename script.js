/* ============================================================
   CONTACT MODAL
   ============================================================ */

const overlay  = document.getElementById('contactModal');
const btnOpen  = document.getElementById('btnContact');
const btnClose = document.getElementById('btnCloseModal');
const textarea = document.getElementById('m-message');
const counter  = document.getElementById('charCounter');
const form     = document.getElementById('contactForm');
const status   = document.getElementById('formStatus');

function openModal() {
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('m-name').focus();
}

function closeModal() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

btnOpen.addEventListener('click', openModal);
btnClose.addEventListener('click', closeModal);

/* Close on overlay background click */
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

/* Close on Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
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
      setTimeout(closeModal, 2200);
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
