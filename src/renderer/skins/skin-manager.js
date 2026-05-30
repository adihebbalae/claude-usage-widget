// Skin manager — sets data-skin on <body>; CSS in each skin's .css file does the rest.
// All skin CSS files are pre-linked in index.html so no dynamic loading is needed.

const VALID_SKINS = ['none', 'liquid'];

function applySkin(name) {
  const skin = VALID_SKINS.includes(name) ? name : 'none';
  if (skin === 'none') {
    document.body.removeAttribute('data-skin');
  } else {
    document.body.setAttribute('data-skin', skin);
  }
}

function getActiveSkin() {
  return document.body.getAttribute('data-skin') || 'none';
}

window.SkinManager = { applySkin, getActiveSkin };
