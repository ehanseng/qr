// Script de demostración - Datos de prueba
// Copia y ejecuta esto en la consola del navegador para cargar datos de ejemplo

const API_BASE = 'http://localhost:3000/api';

async function cargarDatosDemo() {
  console.log('🚀 Iniciando carga de datos de demostración...\n');

  try {
    // 1. Crear clases de ejemplo
    console.log('📚 Creando clases de ejemplo...');
    const clases = [
      { nombre: 'Programación Web - Sección A' },
      { nombre: 'Base de Datos - Sección B' },
      { nombre: 'Interfaces Gráficas - Sección A' }
    ];

    const clasesCreadas = [];
    for (const clase of clases) {
      const response = await fetch(`${API_BASE}/clases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clase)
      });
      const data = await response.json();
      clasesCreadas.push(data);
      console.log(`  ✓ ${clase.nombre} - Código: ${data.codigo_qr}`);
    }
    console.log('');

    // 2. Crear estudiantes de ejemplo
    console.log('👥 Registrando estudiantes de ejemplo...');
    const estudiantes = [
      { nombre: 'Juan Pérez', matricula: '2024001', email: 'juan.perez@univ.edu' },
      { nombre: 'María García', matricula: '2024002', email: 'maria.garcia@univ.edu' },
      { nombre: 'Carlos López', matricula: '2024003', email: 'carlos.lopez@univ.edu' },
      { nombre: 'Ana Martínez', matricula: '2024004', email: 'ana.martinez@univ.edu' },
      { nombre: 'Luis Rodríguez', matricula: '2024005', email: 'luis.rodriguez@univ.edu' },
      { nombre: 'Sofia Sánchez', matricula: '2024006', email: 'sofia.sanchez@univ.edu' },
      { nombre: 'Diego Fernández', matricula: '2024007', email: 'diego.fernandez@univ.edu' },
      { nombre: 'Laura Gómez', matricula: '2024008', email: 'laura.gomez@univ.edu' }
    ];

    const estudiantesCreados = [];
    for (const est of estudiantes) {
      const response = await fetch(`${API_BASE}/estudiantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(est)
      });
      const data = await response.json();
      estudiantesCreados.push(data);
      console.log(`  ✓ ${est.nombre} - Matrícula: ${est.matricula}`);
    }
    console.log('');

    // 3. Registrar asistencias de ejemplo
    console.log('📍 Registrando asistencias de ejemplo...');
    
    // Primera clase: 7 de 8 estudiantes presentes
    for (let i = 0; i < 7; i++) {
      const response = await fetch(`${API_BASE}/asistencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clase_id: clasesCreadas[0].id,
          estudiante_id: estudiantesCreados[i].id
        })
      });
      const data = await response.json();
      if (!data.error) {
        console.log(`  ✓ ${estudiantesCreados[i].nombre} presente en ${clasesCreadas[0].nombre}`);
      }
    }

    // Segunda clase: 6 de 8 estudiantes presentes
    for (let i = 0; i < 6; i++) {
      const response = await fetch(`${API_BASE}/asistencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clase_id: clasesCreadas[1].id,
          estudiante_id: estudiantesCreados[i].id
        })
      });
      const data = await response.json();
      if (!data.error) {
        console.log(`  ✓ ${estudiantesCreados[i].nombre} presente en ${clasesCreadas[1].nombre}`);
      }
    }

    // Tercera clase: todos presentes
    for (let i = 0; i < 8; i++) {
      const response = await fetch(`${API_BASE}/asistencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clase_id: clasesCreadas[2].id,
          estudiante_id: estudiantesCreados[i].id
        })
      });
      const data = await response.json();
      if (!data.error) {
        console.log(`  ✓ ${estudiantesCreados[i].nombre} presente en ${clasesCreadas[2].nombre}`);
      }
    }
    console.log('');

    // 4. Mostrar resumen
    console.log('✅ DATOS DE DEMOSTRACIÓN CARGADOS EXITOSAMENTE\n');
    console.log('Resumen:');
    console.log(`  📚 Clases creadas: ${clasesCreadas.length}`);
    console.log(`  👥 Estudiantes registrados: ${estudiantesCreados.length}`);
    console.log(`  📍 Registros de asistencia: 21`);
    console.log('');
    console.log('Códigos QR de las clases:');
    clasesCreadas.forEach((clase, idx) => {
      console.log(`  ${idx + 1}. ${clase.nombre}`);
      console.log(`     Código: ${clase.codigo_qr}`);
    });
    console.log('');
    console.log('Puedes recargar la página para ver los datos en la aplicación.');

  } catch (error) {
    console.error('❌ Error al cargar datos de demostración:', error);
  }
}

// Ejecutar
console.log('%c╔════════════════════════════════════════╗', 'color: green; font-weight: bold; font-size: 14px;');
console.log('%c║  DEMO - Cargar Datos de Ejemplo       ║', 'color: green; font-weight: bold; font-size: 14px;');
console.log('%c╚════════════════════════════════════════╝', 'color: green; font-weight: bold; font-size: 14px;');
console.log('');
console.log('Para cargar datos de demostración, ejecuta:');
console.log('  cargarDatosDemo()');
console.log('');

// Auto-ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  // Hacer disponible globalmente
  window.cargarDatosDemo = cargarDatosDemo;
}
