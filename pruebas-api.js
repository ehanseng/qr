// Archivo para pruebas de API - Copiar y ejecutar en la consola del navegador
// O usar con herramientas como Postman o Insomnia

const API_BASE = 'http://localhost:3000/api';

// ============ FUNCIONES DE PRUEBA ============

// 1. CREAR UNA CLASE
async function crearClase(nombre) {
  const response = await fetch(`${API_BASE}/clases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  });
  return await response.json();
}

// Ejemplo:
// crearClase('Programación Web').then(console.log);

// ============ REGISTRAR ESTUDIANTE ============

async function registrarEstudiante(nombre, matricula, email = '') {
  const response = await fetch(`${API_BASE}/estudiantes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, matricula, email })
  });
  return await response.json();
}

// Ejemplo:
// registrarEstudiante('Juan Pérez', '2024001', 'juan@email.com').then(console.log);

// ============ OBTENER TODAS LAS CLASES ============

async function obtenerClases() {
  const response = await fetch(`${API_BASE}/clases`);
  return await response.json();
}

// Ejemplo:
// obtenerClases().then(console.log);

// ============ OBTENER TODOS LOS ESTUDIANTES ============

async function obtenerEstudiantes() {
  const response = await fetch(`${API_BASE}/estudiantes`);
  return await response.json();
}

// Ejemplo:
// obtenerEstudiantes().then(console.log);

// ============ REGISTRAR ASISTENCIA ============

async function registrarAsistencia(claseId, estudianteId) {
  const response = await fetch(`${API_BASE}/asistencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clase_id: claseId, estudiante_id: estudianteId })
  });
  return await response.json();
}

// Ejemplo:
// registrarAsistencia(1, 1).then(console.log);

// ============ OBTENER ASISTENCIAS DE UNA CLASE ============

async function obtenerAsistenciasClase(claseId) {
  const response = await fetch(`${API_BASE}/clases/${claseId}/asistencias`);
  return await response.json();
}

// Ejemplo:
// obtenerAsistenciasClase(1).then(console.log);

// ============ OBTENER ASISTENCIAS DE UN ESTUDIANTE ============

async function obtenerAsistenciasEstudiante(estudianteId) {
  const response = await fetch(`${API_BASE}/asistencias/estudiante/${estudianteId}`);
  return await response.json();
}

// Ejemplo:
// obtenerAsistenciasEstudiante(1).then(console.log);

// ============ OBTENER QR DE UNA CLASE ============

async function obtenerQR(claseId) {
  const response = await fetch(`${API_BASE}/clases/${claseId}/qr`);
  return await response.json();
}

// Ejemplo:
// obtenerQR(1).then(res => {
//   console.log('QR generado:');
//   console.log(res);
//   // Mostrar imagen
//   const img = new Image();
//   img.src = res.qr;
//   document.body.appendChild(img);
// });

// ============ VALIDAR CÓDIGO QR ============

async function validarQR(codigoQR) {
  const response = await fetch(`${API_BASE}/validar-qr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo_qr: codigoQR })
  });
  return await response.json();
}

// Ejemplo:
// validarQR('ABC123').then(console.log);

// ============ FLUJO DE PRUEBA COMPLETO ============

async function pruebaCompleta() {
  console.log('=== INICIO DE PRUEBA COMPLETA ===\n');

  // 1. Crear clase
  console.log('1. Creando clase...');
  const clase = await crearClase('Matemáticas 101');
  console.log('Clase creada:', clase);
  const claseId = clase.id;
  console.log('');

  // 2. Registrar estudiantes
  console.log('2. Registrando estudiantes...');
  const est1 = await registrarEstudiante('Juan Pérez', '2024001', 'juan@email.com');
  console.log('Estudiante 1:', est1);
  const est2 = await registrarEstudiante('María García', '2024002', 'maria@email.com');
  console.log('Estudiante 2:', est2);
  console.log('');

  // 3. Obtener QR de la clase
  console.log('3. Obteniendo QR de la clase...');
  const qrData = await obtenerQR(claseId);
  console.log('QR generado para:', qrData.clase);
  console.log('');

  // 4. Registrar asistencias
  console.log('4. Registrando asistencias...');
  const asistencia1 = await registrarAsistencia(claseId, est1.id);
  console.log('Asistencia registrada:', asistencia1);
  const asistencia2 = await registrarAsistencia(claseId, est2.id);
  console.log('Asistencia registrada:', asistencia2);
  console.log('');

  // 5. Obtener reportes
  console.log('5. Obteniendo reportes...');
  const asistenciasClase = await obtenerAsistenciasClase(claseId);
  console.log('Asistencias en clase:', asistenciasClase);
  console.log('');

  console.log('=== FIN DE PRUEBA ===');
}

// Para ejecutar la prueba completa, escribe en la consola:
// pruebaCompleta();
