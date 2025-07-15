document.addEventListener('DOMContentLoaded', () => {
  const ramos = document.querySelectorAll('.ramo');
  const controls = document.querySelector('.controls');
  const avanceBox = document.getElementById('avance');
  const darkToggle = document.getElementById('darkModeToggle');

  // Botón reiniciar
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reiniciar progreso';
  resetBtn.style = 'margin-left:10px;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;background:#ffdddd;color:#333;';
  resetBtn.addEventListener('click', () => {
    if (confirm('¿Reiniciar todo tu progreso?')) {
      localStorage.removeItem('estadoRamos');
      ramos.forEach(r => r.classList.remove('aprobado'));
      guardarEstado();
    }
  });
  controls.appendChild(resetBtn);

  const estados = JSON.parse(localStorage.getItem('estadoRamos') || '{}');
  const darkMode = localStorage.getItem('modoOscuro') === 'true';

  const prerrequisitos = { /* tu objeto existente de claves-prerrequisitos */ };

  const ramoPorCodigo = {};
  ramos.forEach(r => {
    const c = r.dataset.codigo;
    if (c) ramoPorCodigo[c] = r;
  });

  function estaAprobado(codigo) {
    const r = ramoPorCodigo[codigo];
    return r && r.classList.contains('aprobado');
  }

  function cumplePrerre(codigo) {
    return !(prerrequisitos[codigo] || []).some(req => !estaAprobado(req));
  }

  function actualizarDisponibilidad() {
    ramos.forEach(r => {
      const code = r.dataset.codigo;
      if (!cumplePrerre(code)) {
        r.classList.add('bloqueado');
        r.style.pointerEvents = 'none';
        r.title = '🔒 Requiere: ' + (prerrequisitos[code] || []).join(', ');
      } else {
        r.classList.remove('bloqueado');
        r.style.pointerEvents = 'auto';
        r.title = '';
      }
    });
  }

  ramos.forEach(r => {
    if (estados[r.dataset.codigo]) r.classList.add('aprobado');
    r.addEventListener('click', () => {
      if (r.classList.contains('bloqueado')) return;
      r.classList.toggle('aprobado');
      guardarEstado();
    });
  });

  function guardarEstado() {
    const nuevo = {};
    ramos.forEach(r => {
      nuevo[r.dataset.codigo] = r.classList.contains('aprobado');
    });
    localStorage.setItem('estadoRamos', JSON.stringify(nuevo));
    calcularAvance();
    actualizarDisponibilidad();
  }

  function calcularAvance() {
    const total = ramos.length;
    const aprob = document.querySelectorAll('.ramo.aprobado').length;
    avanceBox.textContent = `Avance: ${Math.round((aprob/total)*100)}%`;
  }

  darkToggle.checked = darkMode;
  document.body.classList.toggle('dark', darkMode);
  darkToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark', darkToggle.checked);
    localStorage.setItem('modoOscuro', darkToggle.checked);
  });

  calcularAvance();
  actualizarDisponibilidad();
});
