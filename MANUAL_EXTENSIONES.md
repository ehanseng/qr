# Manual de Extensión - Agregar Nuevas Características

## Cómo Agregar Nuevas Funcionalidades

Este documento te guiará para extender el proyecto con nuevas características.

---

## 1. Agregar Autenticación de Profesores

### Backend (server.js)

Agregar después de las dependencias:

```javascript
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu-clave-secreta-muy-segura';

// Middleware de autenticación
function autenticar(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  
  try {
    req.usuario = jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// Ruta de login
app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;
  
  // Aquí verificarías contra BD (simplificado)
  if (usuario === 'profesor' && password === 'admin') {
    const token = jwt.sign({ usuario }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token, mensaje: 'Login exitoso' });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// Usar en ruta protegida
app.post('/api/clases', autenticar, (req, res) => {
  // Código existente...
});
```

### package.json

Agregar:
```json
"jsonwebtoken": "^9.1.0"
```

Luego: `npm install`

---

## 2. Agregar Exportación a Excel

### Backend

```javascript
const ExcelJS = require('exceljs');

app.get('/api/clases/:clase_id/exportar-excel', async (req, res) => {
  const { clase_id } = req.params;
  
  // Obtener datos
  db.all(
    `SELECT e.nombre, e.matricula, COUNT(*) as presencias
     FROM asistencias a
     JOIN estudiantes e ON a.estudiante_id = e.id
     WHERE a.clase_id = ?
     GROUP BY e.id`,
    [clase_id],
    async (err, rows) => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Asistencias');
      
      // Agregar encabezados
      worksheet.addRow(['Nombre', 'Matrícula', 'Presencias']);
      
      // Agregar datos
      rows.forEach(row => {
        worksheet.addRow([row.nombre, row.matricula, row.presencias]);
      });
      
      // Generar y descargar
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="asistencia.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    }
  );
});
```

### Frontend (app.js)

```javascript
function descargarExcel(claseId) {
  window.location.href = `http://localhost:3000/api/clases/${claseId}/exportar-excel`;
}
```

### HTML

```html
<button onclick="descargarExcel(1)" class="btn btn-secondary">
  📥 Descargar Excel
</button>
```

---

## 3. Agregar Notificaciones por Email

### Backend

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Enviar email cuando hay baja asistencia
app.post('/api/notificar-baja-asistencia', (req, res) => {
  const { estudianteId, claseNombre } = req.body;
  
  db.get(
    'SELECT email FROM estudiantes WHERE id = ?',
    [estudianteId],
    (err, estudiante) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: estudiante.email,
        subject: `Alerta de Asistencia - ${claseNombre}`,
        text: 'Te has ausentado en varias sesiones...'
      };
      
      transporter.sendMail(mailOptions, (error) => {
        if (error) res.status(500).json({ error: error.message });
        else res.json({ mensaje: 'Email enviado' });
      });
    }
  );
});
```

### .env

```
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app
```

---

## 4. Agregar Gráficos de Estadísticas

### Frontend (HTML)

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div id="chartContainer">
  <canvas id="graficoAsistencia"></canvas>
</div>
```

### Frontend (JavaScript)

```javascript
function mostrarGrafico(claseId) {
  fetch(`http://localhost:3000/api/clases/${claseId}/asistencias`)
    .then(r => r.json())
    .then(datos => {
      const nombres = datos.map(d => d.nombre);
      const asistencias = datos.length; // Simplificado
      
      const ctx = document.getElementById('graficoAsistencia');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Presentes', 'Ausentes'],
          datasets: [{
            data: [asistencias, 8 - asistencias],
            backgroundColor: ['#10b981', '#ef4444']
          }]
        }
      });
    });
}
```

---

## 5. Agregar Sistema de Justificantes

### Backend (agregar tabla)

```javascript
db.run(`CREATE TABLE IF NOT EXISTS justificantes (
  id INTEGER PRIMARY KEY,
  asistencia_id INTEGER NOT NULL,
  razon TEXT NOT NULL,
  evidencia TEXT,
  estado TEXT DEFAULT 'pendiente',
  FOREIGN KEY(asistencia_id) REFERENCES asistencias(id)
)`);
```

### Endpoint

```javascript
app.post('/api/justificantes', (req, res) => {
  const { asistencia_id, razon, evidencia } = req.body;
  
  db.run(
    'INSERT INTO justificantes (asistencia_id, razon, evidencia) VALUES (?, ?, ?)',
    [asistencia_id, razon, evidencia],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID, estado: 'pendiente' });
    }
  );
});
```

---

## 6. Agregar Modo Oscuro

### CSS (styles.css)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --dark-color: #f3f4f6;
    --light-color: #1f2937;
    --border-color: #374151;
  }
  
  body {
    background-color: #111827;
    color: #f3f4f6;
  }
}

/* O toggle manual */
body.dark-mode {
  --dark-color: #f3f4f6;
  --light-color: #1f2937;
}
```

### JavaScript

```javascript
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Restaurar preferencia
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}
```

---

## 7. Agregar Búsqueda y Filtros

### Frontend (HTML)

```html
<input type="text" id="searchEstudiante" placeholder="Buscar estudiante...">

<select id="filtroClase">
  <option value="">Todas las clases</option>
</select>
```

### JavaScript

```javascript
document.getElementById('searchEstudiante').addEventListener('input', function(e) {
  const termino = e.target.value.toLowerCase();
  const filas = document.querySelectorAll('tbody tr');
  
  filas.forEach(fila => {
    const texto = fila.textContent.toLowerCase();
    fila.style.display = texto.includes(termino) ? '' : 'none';
  });
});
```

---

## 8. Agregar Múltiples Semestres

### Backend (nueva tabla)

```javascript
db.run(`CREATE TABLE IF NOT EXISTS semestres (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  activo BOOLEAN DEFAULT 1
)`);
```

### Actualizar tabla de clases

```javascript
db.run(`ALTER TABLE clases ADD COLUMN semestre_id INTEGER DEFAULT 1`);
```

---

## 9. Agregar API de Móvil

### Endpoint para obtener QR actual

```javascript
app.get('/api/qr-actual/:codigo', (req, res) => {
  const { codigo } = req.params;
  
  db.get(
    'SELECT id, nombre FROM clases WHERE codigo_qr = ?',
    [codigo],
    (err, clase) => {
      if (!clase) return res.status(404).json({ error: 'QR no válido' });
      res.json(clase);
    }
  );
});
```

### Usar desde app móvil

```javascript
// React Native, Flutter, etc.
const response = await fetch(`http://localhost:3000/api/qr-actual/${qrCode}`);
const datos = await response.json();
```

---

## 10. Agregar Caché Redis

### Backend

```javascript
const redis = require('redis');
const client = redis.createClient();

app.get('/api/clases', async (req, res) => {
  // Verificar caché
  const cached = await client.get('clases');
  if (cached) return res.json(JSON.parse(cached));
  
  // Si no hay caché, obtener de BD
  db.all('SELECT * FROM clases', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Guardar en caché por 1 hora
    client.setex('clases', 3600, JSON.stringify(rows));
    res.json(rows);
  });
});
```

---

## Dependencias Adicionales

Para instalar las nuevas características:

```bash
npm install jsonwebtoken exceljs nodemailer redis
```

---

## Estructura de Directorios Recomendada (Escalable)

```
backend/
├── routes/
│   ├── clases.js
│   ├── estudiantes.js
│   └── asistencias.js
├── models/
│   ├── Clase.js
│   ├── Estudiante.js
│   └── Asistencia.js
├── middleware/
│   ├── auth.js
│   └── validacion.js
├── config/
│   ├── database.js
│   └── email.js
├── controllers/
│   ├── claseController.js
│   └── ...
└── server.js
```

---

## Migración de SQLite a PostgreSQL

### Instalar dependencia

```bash
npm install pg
```

### Cambiar server.js

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

// Usar pool en lugar de db
pool.query('SELECT * FROM clases', (err, result) => {
  // ...
});
```

---

## Recomendaciones

1. **Siempre hacer backup** antes de agregar nuevas características
2. **Usar ramas en Git** para desarrollo
3. **Documentar cambios** en un archivo CHANGELOG.md
4. **Testear localmente** antes de producción
5. **Validar datos** tanto en frontend como en backend
6. **Mantener seguridad** como prioridad

---

¡Diviértete extendiendo el proyecto! 🚀
