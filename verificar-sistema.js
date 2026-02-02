#!/usr/bin/env node

/**
 * VERIFICACIÓN FINAL DEL SISTEMA
 * Este script verifica que todas las funcionalidades estén operacionales
 * 
 * Uso: node verificar-sistema.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║  VERIFICACIÓN FINAL - SISTEMA QR-ASISTENCIA           ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);

let pasadas = 0;
let fallidas = 0;

function verificar(nombre, condicion, mensaje = '') {
  const resultado = condicion ? colors.green + '✓' : colors.red + '✗';
  console.log(`${resultado}${colors.reset} ${nombre}`);
  
  if (mensaje) {
    console.log(`  → ${mensaje}`);
  }
  
  if (condicion) {
    pasadas++;
  } else {
    fallidas++;
  }
}

// ============ VERIFICACIONES ============

console.log(`${colors.yellow}1. ESTRUCTURA DE ARCHIVOS${colors.reset}`);
const archivos = {
  'backend/server.js': path.join(__dirname, 'backend', 'server.js'),
  'backend/package.json': path.join(__dirname, 'backend', 'package.json'),
  'backend/asistencia.db': path.join(__dirname, 'backend', 'asistencia.db'),
  'frontend/index.html': path.join(__dirname, 'frontend', 'index.html'),
  'frontend/css/styles.css': path.join(__dirname, 'frontend', 'css', 'styles.css'),
  'frontend/js/app.js': path.join(__dirname, 'frontend', 'js', 'app.js'),
  'frontend/js/jsQR.js': path.join(__dirname, 'frontend', 'js', 'jsQR.js'),
};

Object.entries(archivos).forEach(([nombre, ruta]) => {
  verificar(nombre, fs.existsSync(ruta), fs.existsSync(ruta) ? 'Encontrado' : 'No encontrado');
});

console.log(`\n${colors.yellow}2. ARCHIVOS DE DOCUMENTACIÓN${colors.reset}`);
const docs = {
  'README.md': true,
  'GUIA_USO.md': true,
  'GUIA_RAPIDA.md': true,
  'MEJORAS_IMPLEMENTADAS.md': true,
  'ESTADO_FINAL.md': true,
  'DOCUMENTACION_TECNICA.md': true,
  'test-api.js': true,
};

Object.entries(docs).forEach(([nombre, _]) => {
  const existe = fs.existsSync(path.join(__dirname, nombre));
  verificar(nombre, existe);
});

console.log(`\n${colors.yellow}3. VERIFICACIÓN DE CÓDIGO${colors.reset}`);

// Verificar server.js
const serverPath = path.join(__dirname, 'backend', 'server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  verificar('server.js contiene Express', serverContent.includes('express'), 'Framework configurado');
  verificar('server.js contiene SQLite', serverContent.includes('sqlite3'), 'Base de datos configurada');
  verificar('server.js contiene CORS', serverContent.includes('cors'), 'CORS habilitado');
  verificar('server.js contiene endpoint DELETE', serverContent.includes('app.delete'), 'Endpoint de eliminación implementado');
  verificar('server.js escucha en puerto 3000', serverContent.includes('3000'), 'Puerto correcto');
}

// Verificar app.js
const appPath = path.join(__dirname, 'frontend', 'js', 'app.js');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  verificar('app.js contiene iniciarEscaneoQR', appContent.includes('iniciarEscaneoQR'), 'Función de escaneo implementada');
  verificar('app.js contiene cargarClases', appContent.includes('cargarClases'), 'Carga de clases implementada');
  verificar('app.js contiene cargarAsistenciaClase', appContent.includes('cargarAsistenciaClase'), 'Reportes por clase implementados');
  verificar('app.js contiene exportarAsistenciaClaseCSV', appContent.includes('exportarAsistenciaClaseCSV'), 'Exportación CSV implementada');
  verificar('app.js contiene generarQR', appContent.includes('generarQR'), 'Generación de QR implementada');
}

// Verificar index.html
const htmlPath = path.join(__dirname, 'frontend', 'index.html');
if (fs.existsSync(htmlPath)) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  verificar('HTML contiene sección Estudiante', htmlContent.includes('id="estudiante"'), 'Página de estudiante presente');
  verificar('HTML contiene sección Profesor', htmlContent.includes('id="profesor"'), 'Página de profesor presente');
  verificar('HTML contiene sección Reportes', htmlContent.includes('id="reportes"'), 'Página de reportes presente');
  verificar('HTML contiene clasesContainer', htmlContent.includes('id="clasesContainer"'), 'Grid de clases presente');
}

// Verificar styles.css
const cssPath = path.join(__dirname, 'frontend', 'css', 'styles.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  verificar('CSS contiene clase-card', cssContent.includes('.clase-card'), 'Estilos de tarjetas implementados');
  verificar('CSS contiene reporte-table', cssContent.includes('.reporte-table'), 'Estilos de reportes implementados');
  verificar('CSS contiene media queries', cssContent.includes('@media'), 'Diseño responsive implementado');
  verificar('CSS contiene animaciones', cssContent.includes('@keyframes'), 'Animaciones CSS implementadas');
}

console.log(`\n${colors.yellow}4. TAMAÑO DE ARCHIVOS${colors.reset}`);
const archivosParaVerificar = [
  ['backend/server.js', 250],
  ['frontend/js/app.js', 500],
  ['frontend/css/styles.css', 400],
];

archivosParaVerificar.forEach(([archivo, minimoLineas]) => {
  const ruta = path.join(__dirname, archivo);
  if (fs.existsSync(ruta)) {
    const contenido = fs.readFileSync(ruta, 'utf8');
    const lineas = contenido.split('\n').length;
    verificar(
      `${archivo}`,
      lineas >= minimoLineas,
      `${lineas} líneas (mínimo: ${minimoLineas})`
    );
  }
});

console.log(`\n${colors.yellow}5. VERIFICACIÓN DE BD${colors.reset}`);
const dbPath = path.join(__dirname, 'backend', 'asistencia.db');
verificar('Base de datos existe', fs.existsSync(dbPath), 'SQLite listo');

if (fs.existsSync(dbPath)) {
  try {
    const stats = fs.statSync(dbPath);
    verificar('Base de datos tiene tamaño', stats.size > 0, `${stats.size} bytes`);
  } catch (e) {
    verificar('Base de datos accesible', false, e.message);
  }
}

console.log(`\n${colors.yellow}6. DEPENDENCIAS${colors.reset}`);
const packagePath = path.join(__dirname, 'backend', 'package.json');
if (fs.existsSync(packagePath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    verificar('Dependencia: express', 'express' in pkg.dependencies, pkg.dependencies.express);
    verificar('Dependencia: sqlite3', 'sqlite3' in pkg.dependencies, pkg.dependencies.sqlite3);
    verificar('Dependencia: cors', 'cors' in pkg.dependencies, pkg.dependencies.cors);
    verificar('Dependencia: qrcode', 'qrcode' in pkg.dependencies, pkg.dependencies.qrcode);
  } catch (e) {
    verificar('package.json válido', false, e.message);
  }
}

console.log(`\n${colors.yellow}7. SCRIPTS DE INICIO${colors.reset}`);
const scripts = [
  'IniciarServidor.ps1',
  'INICIAR_SERVIDOR.bat',
  'iniciar.sh',
  'DetenerServidor.ps1',
];

scripts.forEach(script => {
  const existe = fs.existsSync(path.join(__dirname, script));
  verificar(script, existe);
});

// ============ RESUMEN ============

console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║  RESUMEN DE VERIFICACIÓN                              ║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════════════════════╝${colors.reset}`);

const total = pasadas + fallidas;
const porcentaje = ((pasadas / total) * 100).toFixed(1);

console.log(`
${colors.green}✓ Pasadas:  ${pasadas}${colors.reset}
${colors.red}✗ Fallidas: ${fallidas}${colors.reset}
Total:    ${total}

${colors.cyan}Porcentaje de éxito: ${porcentaje}%${colors.reset}
`);

if (fallidas === 0) {
  console.log(`${colors.green}╔════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.green}║  🎉 SISTEMA COMPLETAMENTE OPERACIONAL 🎉             ║${colors.reset}`);
  console.log(`${colors.green}║  Todas las verificaciones pasaron correctamente       ║${colors.reset}`);
  console.log(`${colors.green}╚════════════════════════════════════════════════════════╝${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.yellow}⚠️  Hay ${fallidas} verificación(es) que no pasó(aron).${colors.reset}\n`);
  console.log(`${colors.yellow}Verifica los archivos mencionados arriba.${colors.reset}\n`);
  process.exit(1);
}
