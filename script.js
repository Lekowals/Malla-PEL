document.addEventListener('DOMContentLoaded', () => {
  const controls = document.querySelector('.controls');

  // Botón de reinicio
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reiniciar progreso';
  resetBtn.style.padding = '6px 12px';
  resetBtn.style.borderRadius = '6px';
  resetBtn.style.border = 'none';
  resetBtn.style.cursor = 'pointer';
  resetBtn.style.backgroundColor = '#ffdddd';
  resetBtn.style.color = '#333';
  resetBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres reiniciar tu progreso?')) {
      localStorage.removeItem('estadoRamos');
      ramos.forEach(r => r.classList.remove('aprobado'));
      guardarEstado();
    }
  });
  controls.appendChild(resetBtn);

  const ramos = document.querySelectorAll('.ramo');
  const avanceBox = document.getElementById('avance');
  const darkToggle = document.getElementById('darkModeToggle');

  const estados = JSON.parse(localStorage.getItem('estadoRamos') || '[]');
  const darkMode = localStorage.getItem('modoOscuro') === 'true';

  const prerrequisitos = {
    "LCL213": ["LCL136"], "LCL232": ["LCL213"], "PRA101-74": ["LCL180"],
    "EPE1118": ["PRA101-74"], "LCL230": ["LCL137"], "LCL246": ["LCL170"],
    "LCL313": ["LCL232"], "PSI275": ["PSI331"], "ING9002": ["ING9001"],
    "LCL274": ["LCL230"], "LCL302": ["LCL235"], "LCL339": ["LCL219"],
    "LCL680": ["LCL235"], "ING9003": ["ING9002"], "LCL236": ["LCL246"],
    "LCL262": ["LCL230"], "LCL337": ["LCL235"], "EPE1302": ["EPE1303"],
    "ING9004": ["ING9003"], "LCL615": ["LCL680"], "LCL624": ["LCL339"],
    "PRA301-74": ["PRA101-74", "EPE1303", "PSI331", "LCL680"],
    "EPE1130": ["PRA301-74"], "LCL548": ["LCL339"],
    "EPE1342": ["PRA301-74"],
    "LCL651": ["LCL337", "PRA301-74", "LCL680", "LCL262"],
    "PRA601-74": ["LCL548", "LCL651", "LCL301", "PRA301-74", "EPE1302", "EPE1320", "EPE1342", "EPE1132"]
  };

  const ramoPorCodigo = {};
  ramos.forEach(r => {
    const codigo = r.dataset.codigo;
    if (codigo) ramoPorCodigo[codigo] = r;
  });

  function estaAprobado(codigo) {
    const ramo = ramoPorCodigo[codigo];
    return ramo && ramo.classList.contains('aprobado');
  }

  function cumplePrerrequisitos(codigo) {
    if (!prerrequisitos[codigo]) return true;
    return prerrequisitos[codigo].every(c => estaAprobado(c));
  }

  function actualizarDisponibilidad() {
    ramos.forEach(ramo => {
      const codigo = ramo.dataset.codigo;
      if (!codigo) return;

      if (!cumplePrerrequisitos(codigo)) {
        ramo.classList.add('bloqueado');
        ramo.style.pointerEvents = 'none';
        ramo.style.opacity = '0.5';

        const requisitos = prerrequisitos[codigo] || [];
        const nombreOriginal = ramo.dataset.nombre || ramo.textContent.replace(/^🔒 /, '');
        ramo.dataset.nombre = nombreOriginal; // Guardar nombre sin íconos

        const requisitosTexto = requisitos.join(', ');
        ramo.innerHTML = `🔒 ${nombreOriginal}<span class="info" title="Requiere: ${requisitosTexto}"> ℹ️</span>`;
      } else {
        if (ramo.dataset.nombre) {
          ramo.innerHTML = ramo.dataset.nombre;
        }
        ramo.classList.remove('bloqueado');
        ramo.style.pointerEvents = 'auto';
        ramo.style.opacity = '1';
      }
    });
  }

  ramos.forEach((ramo, i) => {
    if (estados[i]) ramo.classList.add('aprobado');
    ramo.addEventListener('click', () => {
      if (ramo.classList.contains('bloqueado')) return;
      ramo.classList.toggle('aprobado');
      guardarEstado();
    });
  });

  function guardarEstado() {
    const nuevos = Array.from(ramos).map(r => r.classList.contains('aprobado'));
    localStorage.setItem('estadoRamos', JSON.stringify(nuevos));
    calcularAvance();
    actualizarDisponibilidad();
  }

  function calcularAvance() {
    const total = ramos.length;
    const completados = document.querySelectorAll('.ramo.aprobado').length;
    const porcentaje = Math.round((completados / total) * 100);
    avanceBox.textContent = `Avance: ${porcentaje}%`;
  }

  // Modo oscuro
  darkToggle.checked = darkMode;
  document.body.classList.toggle('dark', darkMode);
  darkToggle.addEventListener('change', () => {
    const modo = darkToggle.checked;
    document.body.classList.toggle('dark', modo);
    localStorage.setItem('modoOscuro', modo);
  });

  calcularAvance();
  actualizarDisponibilidad();
});
