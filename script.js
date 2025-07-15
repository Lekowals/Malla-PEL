document.addEventListener('DOMContentLoaded', () => {
  const ramos = document.querySelectorAll('.ramo');
  const avanceBox = document.getElementById('avance');
  const darkToggle = document.getElementById('darkModeToggle');

  const estados = JSON.parse(localStorage.getItem('estadoRamos') || '{}');
  const darkMode = localStorage.getItem('modoOscuro') === 'true';

  const prerrequisitos = {
    'LCL213': ['LCL136'],
    'LCL232': ['LCL213'],
    'LCL313': ['LCL232'],
    'PRA101-74': ['LCL180'],
    'EPE1118': ['PRA101-74'],
    'LCL230': ['LCL137'],
    'LCL246': ['LCL170'],
    'PSI275': ['PSI331'],
    'ING9002': ['ING9001'],
    'LCL274': ['LCL230'],
    'LCL302': ['LCL235'],
    'LCL339': ['LCL219'],
    'LCL680': ['LCL235'],
    'ING9003': ['ING9002'],
    'LCL236': ['LCL246'],
    'LCL262': ['LCL230'],
    'LCL337': ['LCL235'],
    'EPE1302': ['EPE1303'],
    'ING9004': ['ING9003'],
    'LCL615': ['LCL680'],
    'LCL624': ['LCL339'],
    'PRA301-74': ['PRA101-74', 'EPE1303', 'PSI331', 'LCL680'],
    'EPE1130': ['PRA301-74'],
    'LCL548': ['LCL339'],
    'EPE1342': ['PRA301-74'],
    'LCL651': ['LCL337', 'PRA301-74', 'LCL680', 'LCL262'],
    'PRA601-74': ['LCL548', 'LCL651', 'LCL301', 'PRA301-74', 'EPE1302', 'EPE1320', 'EPE1342', 'EPE1132']
  };

  function actualizarBloqueos() {
    ramos.forEach(ramo => {
      const codigo = ramo.dataset.codigo;
      const requisitos = prerrequisitos[codigo] || [];
      const cumplido = requisitos.every(c => estados[c]);
      if (!cumplido && requisitos.length > 0) {
        ramo.classList.add('bloqueado');
      } else {
        ramo.classList.remove('bloqueado');
      }
    });
  }

  ramos.forEach(ramo => {
    const codigo = ramo.dataset.codigo;
    if (estados[codigo]) {
      ramo.classList.add('aprobado');
    }
    ramo.addEventListener('click', () => {
      if (ramo.classList.contains('bloqueado')) return;
      ramo.classList.toggle('aprobado');
      estados[codigo] = ramo.classList.contains('aprobado');
      localStorage.setItem('estadoRamos', JSON.stringify(estados));
      calcularAvance();
      actualizarBloqueos();
    });
  });

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
  actualizarBloqueos();
});
