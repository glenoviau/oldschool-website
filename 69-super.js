/* ============================================================
   SCALE — sets --img-w so fonts scale with product page width
   ============================================================ */
function setScale() {
  const img = document.getElementById('productBase');
  if (!img) return;
  const w = img.getBoundingClientRect().width;
  if (w > 0) document.documentElement.style.setProperty('--img-w', w + 'px');
}

const productBase = document.getElementById('productBase');
productBase.complete ? setScale() : productBase.addEventListener('load', setScale);
window.addEventListener('resize', setScale);

/* ============================================================
   PHOTO GALLERY — thumbnail click swaps main image
   ============================================================ */
const mainPhoto = document.getElementById('mainPhoto');
const thumbBtns = document.querySelectorAll('.thumb-btn');

const images = Array.from(thumbBtns).map(btn => ({
  src: btn.dataset.src,
  alt: btn.dataset.alt
}));

let currentIndex = 0;

function showImage(index) {
  currentIndex = index;
  mainPhoto.src = images[index].src;
  mainPhoto.alt = images[index].alt;
  thumbBtns.forEach((b, i) => b.classList.toggle('active', i === index));
}

thumbBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => showImage(i));
});

/* ============================================================
   SECTION PANELS
   ============================================================ */
const panelClose = document.getElementById('panelClose');
const loreLink   = document.getElementById('loreLink');

function openPanel(section) {
  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.section-panel[data-panel="${section}"]`).classList.add('active');
  panelClose.classList.add('active');
  loreLink.classList.toggle('active', section === 'lore');
  panelClose.focus();
}

function closePanel() {
  document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
  panelClose.classList.remove('active');
  loreLink.classList.remove('active');
}

document.querySelectorAll('.section-btn').forEach(btn => {
  btn.addEventListener('click', () => openPanel(btn.dataset.section));
});

panelClose.addEventListener('click', closePanel);

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(index) {
  currentIndex = index;
  lightboxImg.src = images[index].src;
  lightboxImg.alt = images[index].alt;
  lightbox.classList.add('active');
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
}

function prevLightboxImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt;
}

function nextLightboxImage() {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
  lightboxImg.alt = images[currentIndex].alt;
}

mainPhoto.addEventListener('click', () => openLightbox(currentIndex));

lightboxPrev.addEventListener('click', prevLightboxImage);
lightboxNext.addEventListener('click', nextLightboxImage);
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ============================================================
   KEYBOARD — arrows navigate lightbox, Escape closes
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('active')) {
    if (e.key === 'ArrowLeft')  prevLightboxImage();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'Escape')     closeLightbox();
    return;
  }
  if (e.key === 'Escape') closePanel();
});

/* ============================================================
   FEATURE HOTSPOTS — show feature card on hover / focus
   ============================================================ */
const featurePopup    = document.getElementById('featurePopup');
const featurePopupImg = document.getElementById('featurePopupImg');

const featureSrcs = {
  1:  '../Design%20Info/1%20Cabinet.jpg',
  2:  '../Design%20Info/2%20Inputs.jpg',
  3:  '../Design%20Info/3%20Grill%20Cloth.jpg',
  4:  '../Design%20Info/4%20Master%20Volume.jpg',
  5:  '../Design%20Info/5%20Overdrive.jpg',
  6:  '../Design%20Info/6%20Controls.jpg',
  7:  '../Design%20Info/7%20Foot%20Switch.jpg',
  8:  '../Design%20Info/8%20Power%20Input.jpg',
  9:  '../Design%20Info/9%20Speaker%20Output.jpg',
  10: '../Design%20Info/10%20Tubes.jpg',
};

document.querySelectorAll('.feature-hotspot').forEach(hotspot => {
  function showCard() {
    const num = parseInt(hotspot.dataset.num, 10);
    featurePopupImg.src = featureSrcs[num];
    featurePopupImg.alt = hotspot.getAttribute('aria-label');
    featurePopup.dataset.pos = num <= 6 ? 'lower' : 'upper';
    featurePopup.hidden = false;
  }
  function hideCard() {
    featurePopup.hidden = true;
  }
  hotspot.addEventListener('mouseenter', showCard);
  hotspot.addEventListener('mouseleave', hideCard);
  hotspot.addEventListener('focus',      showCard);
  hotspot.addEventListener('blur',       hideCard);
});
