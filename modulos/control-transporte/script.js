
window.addEventListener('load', () => {
  inicializarGrafoTransporte();
  if (typeof habilitarDragAndDropGrafo === 'function') {
    habilitarDragAndDropGrafo();
  }
});
