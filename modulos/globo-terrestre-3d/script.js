
window.addEventListener('load', () => {
  setTimeout(() => {
    if (typeof inicializarGlobo3D === 'function') {
      inicializarGlobo3D();
    }
  }, 100);
});
