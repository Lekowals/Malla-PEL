document.addEventListener('DOMContentLoaded', () => {
  const ramos = Array.from(document.querySelectorAll('.ramo'));
  const saved = JSON.parse(localStorage.getItem('mallaPUCV') || '[]');
  ramos.forEach((ramo, i) => {
    if (saved[i]) ramo.classList.add('aprobado');
    ramo.addEventListener('click', () => {
      ramo.classList.toggle('aprobado');
      guardar();
    });
  });
  function guardar() {
    const estados = ramos.map(r => r.classList.contains('aprobado'));
    localStorage.setItem('mallaPUCV', JSON.stringify(estados));
  }
});
