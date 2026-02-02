/**
 * Script de prueba para validar todos los endpoints de la API
 * Ejecutar: node test-api.js
 */

const BASE_URL = 'http://localhost:3000/api';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function test(nombre, método, url, datos = null) {
  try {
    console.log(`\n${colors.blue}➜ Probando: ${nombre}${colors.reset}`);
    
    const opciones = {
      method: método,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (datos) {
      opciones.body = JSON.stringify(datos);
    }

    const respuesta = await fetch(url, opciones);
    const resultado = await respuesta.json();

    if (respuesta.ok || respuesta.status === 201) {
      console.log(`${colors.green}✓ Exitoso${colors.reset}`, resultado);
      return resultado;
    } else {
      console.log(`${colors.red}✗ Error${colors.reset}`, resultado);
      return null;
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error de conexión${colors.reset}`, error.message);
    return null;
  }
}

async function ejecutarPruebas() {
  console.log(`${colors.yellow}=== PRUEBAS DE API - SISTEMA DE ASISTENCIA QR ===${colors.reset}\n`);

  // 1. Crear estudiante
  console.log(`${colors.yellow}--- PRUEBAS DE ESTUDIANTES ---${colors.reset}`);
  const estudiante = await test(
    'Crear nuevo estudiante',
    'POST',
    `${BASE_URL}/estudiantes`,
    {
      nombre: 'Juan Pérez',
      matricula: 'EST001',
      email: 'juan@example.com'
    }
  );

  // 2. Obtener estudiantes
  const estudiantes = await test(
    'Obtener lista de estudiantes',
    'GET',
    `${BASE_URL}/estudiantes`
  );

  // 3. Crear clase
  console.log(`\n${colors.yellow}--- PRUEBAS DE CLASES ---${colors.reset}`);
  const clase = await test(
    'Crear nueva clase',
    'POST',
    `${BASE_URL}/clases`,
    {
      nombre: 'Programación Web - Sección A',
      descripcion: 'Clase de desarrollo web con tecnologías modernas'
    }
  );

  // 4. Obtener clases
  const clases = await test(
    'Obtener lista de clases',
    'GET',
    `${BASE_URL}/clases`
  );

  // 5. Generar QR
  if (clase && clase.id) {
    console.log(`\n${colors.yellow}--- PRUEBAS DE QR ---${colors.reset}`);
    await test(
      `Generar QR para clase ${clase.id}`,
      'GET',
      `${BASE_URL}/clases/${clase.id}/qr`
    );

    // 6. Registrar asistencia
    console.log(`\n${colors.yellow}--- PRUEBAS DE ASISTENCIAS ---${colors.reset}`);
    if (estudiante && estudiante.id) {
      const asistencia = await test(
        'Registrar asistencia',
        'POST',
        `${BASE_URL}/asistencias`,
        {
          clase_id: clase.id,
          estudiante_id: estudiante.id
        }
      );

      // 7. Intentar registrar duplicado (debe fallar)
      await test(
        'Intentar registrar duplicado (debe fallar)',
        'POST',
        `${BASE_URL}/asistencias`,
        {
          clase_id: clase.id,
          estudiante_id: estudiante.id
        }
      );

      // 8. Obtener asistencias por clase
      await test(
        `Obtener asistencias de clase ${clase.id}`,
        'GET',
        `${BASE_URL}/clases/${clase.id}/asistencias`
      );

      // 9. Obtener asistencias por estudiante
      await test(
        `Obtener asistencias de estudiante ${estudiante.id}`,
        'GET',
        `${BASE_URL}/asistencias/estudiante/${estudiante.id}`
      );
    }

    // 10. Eliminar clase
    console.log(`\n${colors.yellow}--- PRUEBA DE ELIMINACIÓN ---${colors.reset}`);
    await test(
      `Eliminar clase ${clase.id}`,
      'DELETE',
      `${BASE_URL}/clases/${clase.id}`
    );
  }

  console.log(`\n${colors.green}=== PRUEBAS COMPLETADAS ===${colors.reset}\n`);
}

// Ejecutar pruebas
ejecutarPruebas();
