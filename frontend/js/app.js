const API_BASE_URL = 'http://localhost:3000/api';

// Estado de la aplicación
let estadoApp = {
  estudianteActual: null,
  claseActual: null,
  videoStream: null,
  escaneoActivo: false,
  codigoQRActual: null
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function () {
  inicializarNavegacion();
  cargarEstudiantes();
  cargarClases();
  cargarClasesEnReportes();
  cargarEstudiantesEnReportes();

  // Manejar formularios
  if (document.getElementById('formRegistroEstudiante')) {
    document.getElementById('formRegistroEstudiante').addEventListener('submit', registrarEstudiante);
  }
  if (document.getElementById('formCrearClase')) {
    document.getElementById('formCrearClase').addEventListener('submit', crearClase);
  }

  // Event listener para cambio en select de estudiante
  const selectEst = document.getElementById('selectEstudiante');
  if (selectEst) {
    selectEst.addEventListener('change', function() {
      estadoApp.estudianteActual = this.value;
    });
  }
});

// ============ NAVEGACIÓN ============

function inicializarNavegacion() {
  const botones = document.querySelectorAll('.nav-btn');
  console.log('Inicializando navegación. Botones encontrados:', botones.length);

  botones.forEach(boton => {
    boton.addEventListener('click', function (e) {
      e.preventDefault();
      const pagina = this.dataset.page;
      console.log('Navegando a:', pagina);

      // Remover clase active de todos los botones
      botones.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Mostrar la página seleccionada
      mostrarPagina(pagina);

      // Si es la página de estudiante, iniciar escaneo
      if (pagina === 'estudiante') {
        setTimeout(iniciarEscaneoQR, 500);
      } else {
        detenerEscaneoQR();
      }
    });
  });
}

function mostrarPagina(nombrePagina) {
  console.log('Mostrando página:', nombrePagina);
  const paginas = document.querySelectorAll('.page');
  console.log('Total de páginas encontradas:', paginas.length);
  
  paginas.forEach(pagina => {
    console.log('Página ID:', pagina.id, 'Estado actual:', pagina.classList.contains('active'));
    pagina.classList.remove('active');
  });

  const paginaMostrar = document.getElementById(nombrePagina);
  console.log('Página a mostrar encontrada:', paginaMostrar ? 'Sí' : 'No');
  
  if (paginaMostrar) {
    paginaMostrar.classList.add('active');
    console.log('Clase active agregada a:', nombrePagina);
  }
}

// ============ FUNCIONES DE ESTUDIANTES ============

function cargarEstudiantes() {
  fetch(`${API_BASE_URL}/estudiantes`)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('selectEstudiante');
      select.innerHTML = '<option value="">-- Selecciona tu nombre --</option>';

      data.forEach(estudiante => {
        const option = document.createElement('option');
        option.value = estudiante.id;
        option.textContent = `${estudiante.nombre} (${estudiante.matricula})`;
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error al cargar estudiantes:', error));
}

function registrarEstudiante(event) {
  event.preventDefault();

  const formData = {
    nombre: document.getElementById('nombre').value,
    matricula: document.getElementById('matricula').value,
    email: document.getElementById('email').value
  };

  fetch(`${API_BASE_URL}/estudiantes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        mostrarAlerta(data.error, 'error');
      } else {
        mostrarAlerta('Estudiante registrado exitosamente', 'success');
        document.getElementById('formRegistroEstudiante').reset();
        cargarEstudiantes();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      mostrarAlerta('Error al registrar estudiante', 'error');
    });
}

function cargarEstudiantesEnReportes() {
  fetch(`${API_BASE_URL}/estudiantes`)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('selectEstudianteReporte');
      select.innerHTML = '<option value="">-- Selecciona un estudiante --</option>';

      data.forEach(estudiante => {
        const option = document.createElement('option');
        option.value = estudiante.id;
        option.textContent = `${estudiante.nombre} (${estudiante.matricula})`;
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error al cargar estudiantes:', error));
}

// ============ FUNCIONES DE CLASES ============

function cargarClases() {
  fetch(`${API_BASE_URL}/clases`)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('listaClases');

      if (data.length === 0) {
        container.innerHTML = '<p>No hay clases disponibles. Crea una nueva clase.</p>';
        return;
      }

      let html = '';
      data.forEach(clase => {
        html += `
          <div class="clase-card">
            <h4>${clase.nombre}</h4>
            <div class="clase-info">
              <span>📅 Código: ${clase.codigo_qr}</span>
              <span>📍 Creado: ${new Date(clase.fecha_creacion).toLocaleDateString('es-ES')}</span>
            </div>
            <div class="qr-container">
              <p style="color: var(--dark-color); margin-bottom: 0.5rem;">Código QR para esta clase:</p>
              <img src="" alt="QR" id="qr-${clase.id}" style="max-width: 200px;">
              <button class="btn btn-success" onclick="descargarQR(${clase.id})" style="margin-top: 0.5rem;">Descargar QR</button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;

      // Generar QRs
      data.forEach(clase => {
        generarQR(clase.id, clase.nombre);
      });
    })
    .catch(error => console.error('Error al cargar clases:', error));
}

function crearClase(event) {
  event.preventDefault();

  const nombreClase = document.getElementById('nombreClase').value;
  const descripcionClase = document.getElementById('descripcionClase')?.value || '';

  if (!nombreClase.trim()) {
    mostrarAlerta('El nombre de la clase es requerido', 'error');
    return;
  }

  fetch(`${API_BASE_URL}/clases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      nombre: nombreClase,
      descripcion: descripcionClase
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        mostrarAlerta(`❌ ${data.error}`, 'error');
      } else {
        mostrarAlerta('✅ Clase creada exitosamente', 'success');
        document.getElementById('formCrearClase').reset();
        cargarClases();
        cargarClasesEnReportes();
      }
    })
    .catch(error => {
      console.error('Error:', error);
      mostrarAlerta('❌ Error al crear la clase', 'error');
    });
}

function cargarClasesEnReportes() {
  fetch(`${API_BASE_URL}/clases`)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('selectClaseReporte');
      select.innerHTML = '<option value="">-- Selecciona una clase --</option>';

      data.forEach(clase => {
        const option = document.createElement('option');
        option.value = clase.id;
        option.textContent = clase.nombre;
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error al cargar clases:', error));
}

// ============ FUNCIONES DE CLASES - SECCIÓN PROFESOR ============

function cargarClases() {
  fetch(`${API_BASE_URL}/clases`)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('clasesContainer');
      
      if (!container) {
        console.warn('Contenedor de clases no encontrado');
        return;
      }

      if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem;">No hay clases creadas. ¡Crea una nueva clase para comenzar!</p>';
        return;
      }

      container.innerHTML = '';

      data.forEach(clase => {
        const card = document.createElement('div');
        card.className = 'clase-card';
        card.innerHTML = `
          <div class="clase-header">
            <h3>${clase.nombre}</h3>
            <button class="btn-icon" onclick="eliminarClase(${clase.id})" title="Eliminar clase">🗑️</button>
          </div>
          <p><strong>Código:</strong> ${clase.codigo}</p>
          <p><strong>Descripción:</strong> ${clase.descripcion || 'Sin descripción'}</p>
          <div class="qr-section">
            <div id="qr-${clase.id}" class="qr-image"></div>
            <div class="qr-buttons">
              <button class="btn btn-primary" onclick="generarQR(${clase.id}, '${clase.nombre}')">Generar QR</button>
              <button class="btn btn-secondary" onclick="descargarQR(${clase.id})">Descargar</button>
            </div>
          </div>
          <div class="clase-stats">
            <p id="stats-${clase.id}">Cargando estadísticas...</p>
          </div>
        `;
        container.appendChild(card);
        
        // Cargar estadísticas de asistencia
        cargarEstadísticasClase(clase.id);
      });
    })
    .catch(error => {
      console.error('Error al cargar clases:', error);
      const container = document.getElementById('clasesContainer');
      if (container) {
        container.innerHTML = '<p style="color: red;">Error al cargar las clases</p>';
      }
    });
}

function cargarEstadísticasClase(claseId) {
  fetch(`${API_BASE_URL}/clases/${claseId}/asistencias`)
    .then(response => response.json())
    .then(data => {
      const statsDiv = document.getElementById(`stats-${claseId}`);
      if (statsDiv) {
        const totalAsistencias = data.length;
        const estudiantesUnicos = new Set(data.map(d => d.estudiante_id)).size;
        statsDiv.innerHTML = `
          <strong>📊 Estadísticas:</strong><br>
          Total asistencias: ${totalAsistencias}<br>
          Estudiantes únicos: ${estudiantesUnicos}
        `;
      }
    })
    .catch(error => console.error('Error cargando estadísticas:', error));
}

// ============ FUNCIONES DE QR - SECCIÓN PROFESOR ============

function generarQR(claseId, nombreClase) {
  const qrContainer = document.getElementById(`qr-${claseId}`);
  
  if (!qrContainer) {
    console.error('Contenedor QR no encontrado');
    return;
  }

  qrContainer.innerHTML = '<p>Generando QR...</p>';

  fetch(`${API_BASE_URL}/clases/${claseId}/qr`)
    .then(response => response.json())
    .then(data => {
      if (data.qr) {
        qrContainer.innerHTML = `<img src="${data.qr}" alt="QR de ${nombreClase}" style="max-width: 200px; max-height: 200px;">`;
      } else {
        qrContainer.innerHTML = '<p style="color: red;">Error al generar QR</p>';
      }
    })
    .catch(error => {
      console.error('Error al generar QR:', error);
      qrContainer.innerHTML = '<p style="color: red;">Error al generar QR</p>';
    });
}

function descargarQR(claseId) {
  const img = document.querySelector(`#qr-${claseId} img`);

  if (!img || !img.src) {
    mostrarAlerta('⚠️ Primero genera el código QR', 'error');
    return;
  }

  const link = document.createElement('a');
  link.href = img.src;
  link.download = `qr-clase-${claseId}.png`;
  link.click();
  
  mostrarAlerta('✅ QR descargado exitosamente', 'success');
}

function eliminarClase(claseId) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta clase? Esta acción no se puede deshacer.')) {
    return;
  }

  fetch(`${API_BASE_URL}/clases/${claseId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        mostrarAlerta(`❌ ${data.error}`, 'error');
      } else {
        mostrarAlerta('✅ Clase eliminada exitosamente', 'success');
        cargarClases();
      }
    })
    .catch(error => {
      console.error('Error eliminando clase:', error);
      mostrarAlerta('❌ Error al eliminar la clase', 'error');
    });
}

// ============ ESCANEO DE QR POR CÁMARA - SECCIÓN ESTUDIANTE ============

async function iniciarEscaneoQR() {
  if (estadoApp.escaneoActivo) return;

  const video = document.getElementById('preview');
  const statusText = document.getElementById('scanStatus');

  if (!video) {
    console.error('Elemento de video no encontrado');
    return;
  }

  try {
    // Detener cualquier stream anterior
    detenerEscaneoQR();

    const constraints = {
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    estadoApp.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = estadoApp.videoStream;

    statusText.textContent = '✅ Cámara iniciada. Apunta al código QR...';
    estadoApp.escaneoActivo = true;

    await video.play();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let ultimoQR = '';
    let tiempoUltimoQR = 0;

    const procesarFrame = () => {
      if (!estadoApp.escaneoActivo) return;

      try {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Obtener datos de imagen
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          const qrData = code.data.toString();
          const ahora = Date.now();

          // Evitar procesar el mismo QR múltiples veces en 2 segundos
          if (qrData !== ultimoQR || ahora - tiempoUltimoQR > 2000) {
            ultimoQR = qrData;
            tiempoUltimoQR = ahora;
            procesarQR(qrData);
            return; // Detener el procesamiento de frames
          }
        }
      } catch (err) {
        console.error('Error procesando frame:', err);
      }

      requestAnimationFrame(procesarFrame);
    };

    procesarFrame();
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    
    let mensajeError = '❌ No se pudo acceder a la cámara.';
    if (error.name === 'NotAllowedError') {
      mensajeError = '❌ Permiso de cámara denegado. Habilita la cámara en la configuración del navegador.';
    } else if (error.name === 'NotFoundError') {
      mensajeError = '❌ No se encontró ninguna cámara en el dispositivo.';
    }
    
    statusText.textContent = mensajeError;
    estadoApp.escaneoActivo = false;
    mostrarAlerta(mensajeError, 'error');
  }
}

function detenerEscaneoQR() {
  estadoApp.escaneoActivo = false;

  if (estadoApp.videoStream) {
    estadoApp.videoStream.getTracks().forEach(track => {
      try {
        track.stop();
      } catch (e) {
        console.warn('Error deteniendo track:', e);
      }
    });
    estadoApp.videoStream = null;
  }
}

function procesarQR(datosQR) {
  const selectEst = document.getElementById('selectEstudiante');
  const estudianteId = selectEst ? selectEst.value : '';

  if (!estudianteId) {
    mostrarAlerta('⚠️ Selecciona tu nombre antes de escanear', 'error');
    return;
  }

  detenerEscaneoQR();

  // Intentar extraer el código de clase del QR
  try {
    const datos = JSON.parse(datosQR);
    if (datos.clase_id) {
      registrarAsistencia(datos.clase_id, estudianteId);
    } else {
      validarCodigoQR(datosQR, estudianteId);
    }
  } catch (e) {
    // Si no es JSON válido, intentar validar como código directo
    validarCodigoQR(datosQR, estudianteId);
  }
}

function validarCodigoQR(codigo, estudianteId) {
  const statusText = document.getElementById('scanStatus');
  if (statusText) {
    statusText.textContent = '⏳ Validando código QR...';
  }

  fetch(`${API_BASE_URL}/validar-qr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ codigo_qr: codigo })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        mostrarResultado(`❌ ${data.error}`, 'error');
      } else if (data.clase_id) {
        registrarAsistencia(data.clase_id, estudianteId);
      }
    })
    .catch(error => {
      console.error('Error validando QR:', error);
      mostrarResultado('❌ Error al validar el código QR', 'error');
    });
}

function registrarAsistencia(claseId, estudianteId) {
  const statusText = document.getElementById('scanStatus');
  if (statusText) {
    statusText.textContent = '⏳ Registrando asistencia...';
  }

  fetch(`${API_BASE_URL}/asistencias`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clase_id: claseId,
      estudiante_id: estudianteId
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        mostrarResultado(`❌ ${data.error}`, 'error');
      } else {
        mostrarResultado(`✅ ¡Asistencia registrada exitosamente!`, 'success');
        estadoApp.estudianteActual = null;
      }
    })
    .catch(error => {
      console.error('Error registrando asistencia:', error);
      mostrarResultado('❌ Error al registrar asistencia', 'error');
    });
}

function mostrarResultado(mensaje, tipo) {
  const resultDiv = document.getElementById('scanResult');
  const resultText = document.getElementById('resultText');

  if (!resultDiv || !resultText) {
    mostrarAlerta(mensaje, tipo);
    return;
  }

  resultText.textContent = mensaje;
  resultDiv.style.display = 'block';
  resultDiv.className = tipo === 'success' ? 'alert alert-success' : 'alert alert-error';

  setTimeout(continuarEscaneo, 4000);
}

function continuarEscaneo() {
  const resultDiv = document.getElementById('scanResult');
  if (resultDiv) {
    resultDiv.style.display = 'none';
  }
  const selectEst = document.getElementById('selectEstudiante');
  if (selectEst && selectEst.value) {
    iniciarEscaneoQR();
  }
}

// ============ REPORTES - SECCIÓN DE ANÁLISIS Y ESTADÍSTICAS ============

function cargarClasesEnReportes() {
  fetch(`${API_BASE_URL}/clases`)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('selectClaseReporte');
      
      if (!select) {
        console.warn('Select de clase en reportes no encontrado');
        return;
      }

      select.innerHTML = '<option value="">-- Selecciona una clase --</option>';

      if (data && data.length > 0) {
        data.forEach(clase => {
          const option = document.createElement('option');
          option.value = clase.id;
          option.textContent = clase.nombre;
          select.appendChild(option);
        });
      }
    })
    .catch(error => console.error('Error al cargar clases en reportes:', error));
}

function cargarEstudiantesEnReportes() {
  fetch(`${API_BASE_URL}/estudiantes`)
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('selectEstudianteReporte');
      
      if (!select) {
        console.warn('Select de estudiante en reportes no encontrado');
        return;
      }

      select.innerHTML = '<option value="">-- Selecciona un estudiante --</option>';

      if (data && data.length > 0) {
        data.forEach(estudiante => {
          const option = document.createElement('option');
          option.value = estudiante.id;
          option.textContent = `${estudiante.nombre} (${estudiante.matricula})`;
          select.appendChild(option);
        });
      }
    })
    .catch(error => console.error('Error al cargar estudiantes en reportes:', error));
}

function cargarAsistenciaClase() {
  const claseId = document.getElementById('selectClaseReporte').value;

  if (!claseId) {
    document.getElementById('tablaPresentesClase').innerHTML = '<p style="text-align:center; color: #999;">Selecciona una clase para ver los registros</p>';
    return;
  }

  fetch(`${API_BASE_URL}/clases/${claseId}/asistencias`)
    .then(response => response.json())
    .then(data => {
      let html = '';

      if (!data || data.length === 0) {
        html = '<p style="text-align:center;">No hay registros de asistencia para esta clase</p>';
      } else {
        html = `
          <div class="reporte-header">
            <p><strong>Total de registros:</strong> ${data.length}</p>
            <p><strong>Estudiantes únicos:</strong> ${new Set(data.map(d => d.estudiante_id)).size}</p>
            <button class="btn btn-secondary" onclick="exportarAsistenciaClaseCSV()">📥 Exportar CSV</button>
          </div>
          <table class="reporte-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Matrícula</th>
                <th>Fecha/Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
        `;

        data.forEach((registro, index) => {
          const fecha = new Date(registro.fecha_hora).toLocaleString('es-ES');
          html += `
            <tr class="${index % 2 === 0 ? 'fila-par' : 'fila-impar'}">
              <td>${registro.nombre}</td>
              <td>${registro.matricula}</td>
              <td>${fecha}</td>
              <td><span class="badge-success">✅ Presente</span></td>
            </tr>
          `;
        });

        html += `
            </tbody>
          </table>
        `;
      }

      document.getElementById('tablaPresentesClase').innerHTML = html;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('tablaPresentesClase').innerHTML = '<p style="color: red;">Error al cargar datos de asistencia</p>';
    });
}

function cargarAsistenciaEstudiante() {
  const estudianteId = document.getElementById('selectEstudianteReporte').value;

  if (!estudianteId) {
    document.getElementById('tablaAsistenciasEstudiante').innerHTML = '<p style="text-align:center; color: #999;">Selecciona un estudiante para ver su historial</p>';
    return;
  }

  fetch(`${API_BASE_URL}/asistencias/estudiante/${estudianteId}`)
    .then(response => response.json())
    .then(data => {
      let html = '';

      if (!data || data.length === 0) {
        html = '<p style="text-align:center;">Este estudiante no tiene registros de asistencia</p>';
      } else {
        const totalClases = new Set(data.map(d => d.clase_id)).size;
        const totalAsistencias = data.length;
        const porcentajeAsistencia = totalClases > 0 ? ((totalAsistencias / (totalClases * 10)) * 100).toFixed(2) : '0';

        html = `
          <div class="reporte-header">
            <p><strong>Total asistencias:</strong> ${totalAsistencias}</p>
            <p><strong>Clases atendidas:</strong> ${totalClases}</p>
            <p><strong>Porcentaje estimado:</strong> ${porcentajeAsistencia}%</p>
            <button class="btn btn-secondary" onclick="exportarAsistenciaEstudianteCSV()">📥 Exportar CSV</button>
          </div>
          <table class="reporte-table">
            <thead>
              <tr>
                <th>Clase</th>
                <th>Fecha/Hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
        `;

        data.forEach((registro, index) => {
          const fecha = new Date(registro.fecha_hora).toLocaleString('es-ES');
          html += `
            <tr class="${index % 2 === 0 ? 'fila-par' : 'fila-impar'}">
              <td>${registro.clase}</td>
              <td>${fecha}</td>
              <td><span class="badge-success">✅ Presente</span></td>
            </tr>
          `;
        });

        html += `
            </tbody>
          </table>
        `;
      }

      document.getElementById('tablaAsistenciasEstudiante').innerHTML = html;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('tablaAsistenciasEstudiante').innerHTML = '<p style="color: red;">Error al cargar datos de asistencia</p>';
    });
}

function exportarAsistenciaClaseCSV() {
  const claseId = document.getElementById('selectClaseReporte').value;
  
  if (!claseId) {
    mostrarAlerta('⚠️ Selecciona una clase para exportar', 'error');
    return;
  }

  fetch(`${API_BASE_URL}/clases/${claseId}/asistencias`)
    .then(response => response.json())
    .then(data => {
      if (!data || data.length === 0) {
        mostrarAlerta('⚠️ No hay datos para exportar', 'error');
        return;
      }

      let csv = 'Estudiante,Matrícula,Fecha y Hora,Estado\n';
      data.forEach(registro => {
        const fecha = new Date(registro.fecha_hora).toLocaleString('es-ES');
        csv += `"${registro.nombre}","${registro.matricula}","${fecha}","Presente"\n`;
      });

      descargarCSV(csv, `asistencia_clase_${claseId}.csv`);
      mostrarAlerta('✅ Archivo CSV descargado', 'success');
    })
    .catch(error => {
      console.error('Error exportando CSV:', error);
      mostrarAlerta('❌ Error al exportar datos', 'error');
    });
}

function exportarAsistenciaEstudianteCSV() {
  const estudianteId = document.getElementById('selectEstudianteReporte').value;
  
  if (!estudianteId) {
    mostrarAlerta('⚠️ Selecciona un estudiante para exportar', 'error');
    return;
  }

  fetch(`${API_BASE_URL}/asistencias/estudiante/${estudianteId}`)
    .then(response => response.json())
    .then(data => {
      if (!data || data.length === 0) {
        mostrarAlerta('⚠️ No hay datos para exportar', 'error');
        return;
      }

      let csv = 'Clase,Fecha y Hora,Estado\n';
      data.forEach(registro => {
        const fecha = new Date(registro.fecha_hora).toLocaleString('es-ES');
        csv += `"${registro.clase}","${fecha}","Presente"\n`;
      });

      descargarCSV(csv, `asistencia_estudiante_${estudianteId}.csv`);
      mostrarAlerta('✅ Archivo CSV descargado', 'success');
    })
    .catch(error => {
      console.error('Error exportando CSV:', error);
      mostrarAlerta('❌ Error al exportar datos', 'error');
    });
}

function descargarCSV(contenido, nombreArchivo) {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', nombreArchivo);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============ FUNCIONES AUXILIARES ============

function mostrarAlerta(mensaje, tipo) {
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = mensaje;

  // Agregar al inicio del contenedor
  const container = document.querySelector('.container');
  container.insertBefore(alerta, container.firstChild);

  // Eliminar después de 3 segundos
  setTimeout(() => alerta.remove(), 3000);
}
