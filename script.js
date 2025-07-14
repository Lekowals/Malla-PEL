document.addEventListener('DOMContentLoaded', () => {
  const ramos = document.querySelectorAll('.ramo');
  const avanceBox = document.getElementById('avance');
  const darkToggle = document.getElementById('darkModeToggle');

  const estados = JSON.parse(localStorage.getItem('estadoRamos') || '[]');
  const darkMode = localStorage.getItem('modoOscuro') === 'true';

  ramos.forEach((ramo, i) => {
    if (estados[i]) ramo.classList.add('aprobado');
    ramo.addEventListener('click', () => {
      ramo.classList.toggle('aprobado');
      guardarEstado();
    });
  });

  function guardarEstado() {
    const nuevos = Array.from(ramos).map(r => r.classList.contains('aprobado'));
    localStorage.setItem('estadoRamos', JSON.stringify(nuevos));
    calcularAvance();
  }

  function calcularAvance() {
    const total = ramos.length;
    const completados = document.querySelectorAll('.ramo.aprobado').length;
    const porcentaje = Math.round((completados / total) * 100);
    avanceBox.textContent = `Avance: ${porcentaje}%`;
  }

  darkToggle.checked = darkMode;
  document.body.classList.toggle('dark', darkMode);

  darkToggle.addEventListener('change', () => {
    const modo = darkToggle.checked;
    document.body.classList.toggle('dark', modo);
    localStorage.setItem('modoOscuro', modo);
  });

  calcularAvance();
});
