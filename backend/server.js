const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
const frontendPath = path.join(__dirname, '../frontend');
console.log('Sirviendo archivos desde:', frontendPath);
app.use(express.static(frontendPath));

// Base de datos
const dbPath = path.join(__dirname, 'asistencia.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a SQLite en:', dbPath);
    inicializarBD();
  }
});

// Inicializar base de datos
function inicializarBD() {
  db.serialize(() => {
    // Tabla de clases
    db.run(`CREATE TABLE IF NOT EXISTS clases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      codigo_qr TEXT NOT NULL UNIQUE,
      descripcion TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      activa BOOLEAN DEFAULT 1
    )`);

    // Tabla de estudiantes
    db.run(`CREATE TABLE IF NOT EXISTS estudiantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      matricula TEXT NOT NULL UNIQUE,
      email TEXT,
      fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Tabla de asistencias
    db.run(`CREATE TABLE IF NOT EXISTS asistencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clase_id INTEGER NOT NULL,
      estudiante_id INTEGER NOT NULL,
      fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
      presente BOOLEAN DEFAULT 1,
      FOREIGN KEY(clase_id) REFERENCES clases(id),
      FOREIGN KEY(estudiante_id) REFERENCES estudiantes(id)
    )`);

    console.log('Base de datos inicializada correctamente');
  });
}

// ============ RUTAS DE CLASES ============

// Crear una nueva clase
app.post('/api/clases', async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de la clase es requerido' });
  }

  const codigoQR = Math.random().toString(36).substring(2, 8).toUpperCase();

  db.run(
    'INSERT INTO clases (nombre, codigo_qr, descripcion) VALUES (?, ?, ?)',
    [nombre, codigoQR, descripcion || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        nombre,
        codigo_qr: codigoQR,
        descripcion: descripcion || null,
        mensaje: 'Clase creada exitosamente'
      });
    }
  );
});

// Obtener todas las clases
app.get('/api/clases', (req, res) => {
  db.all('SELECT * FROM clases WHERE activa = 1', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Obtener clase por ID
app.get('/api/clases/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM clases WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }
    res.json(row);
  });
});

// Eliminar una clase
app.delete('/api/clases/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT id FROM clases WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    // Soft delete - marcar como inactiva
    db.run(
      'UPDATE clases SET activa = 0 WHERE id = ?',
      [id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          mensaje: 'Clase eliminada exitosamente',
          id: id
        });
      }
    );
  });
});

// Generar QR para una clase
app.get('/api/clases/:id/qr', async (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM clases WHERE id = ?', [id], async (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    try {
      const qrData = {
        clase_id: id,
        codigo: row.codigo_qr,
        timestamp: new Date().toISOString()
      };

      const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));
      res.json({ qr: qrImage, clase: row.nombre });
    } catch (error) {
      res.status(500).json({ error: 'Error al generar QR' });
    }
  });
});

// ============ RUTAS DE ESTUDIANTES ============

// Registrar nuevo estudiante
app.post('/api/estudiantes', (req, res) => {
  const { nombre, matricula, email } = req.body;

  if (!nombre || !matricula) {
    return res.status(400).json({ error: 'Nombre y matrícula son requeridos' });
  }

  db.run(
    'INSERT INTO estudiantes (nombre, matricula, email) VALUES (?, ?, ?)',
    [nombre, matricula, email || null],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'La matrícula ya existe' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        nombre,
        matricula,
        email,
        mensaje: 'Estudiante registrado exitosamente'
      });
    }
  );
});

// Obtener todos los estudiantes
app.get('/api/estudiantes', (req, res) => {
  db.all('SELECT * FROM estudiantes', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ============ RUTAS DE ASISTENCIAS ============

// Registrar asistencia (por QR)
app.post('/api/asistencias', (req, res) => {
  const { clase_id, estudiante_id } = req.body;

  if (!clase_id || !estudiante_id) {
    return res.status(400).json({ error: 'clase_id y estudiante_id son requeridos' });
  }

  // Verificar que no haya registro duplicado en el mismo día
  const hoy = new Date().toISOString().split('T')[0];

  db.get(
    `SELECT id FROM asistencias 
     WHERE clase_id = ? AND estudiante_id = ? AND DATE(fecha_hora) = ?`,
    [clase_id, estudiante_id, hoy],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (row) {
        return res.status(400).json({ error: 'El estudiante ya ha registrado asistencia hoy' });
      }

      db.run(
        'INSERT INTO asistencias (clase_id, estudiante_id) VALUES (?, ?)',
        [clase_id, estudiante_id],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({
            id: this.lastID,
            clase_id,
            estudiante_id,
            mensaje: 'Asistencia registrada exitosamente'
          });
        }
      );
    }
  );
});

// Obtener asistencias de una clase
app.get('/api/clases/:clase_id/asistencias', (req, res) => {
  const { clase_id } = req.params;

  db.all(
    `SELECT a.id, a.fecha_hora, e.nombre, e.matricula, c.nombre as clase
     FROM asistencias a
     JOIN estudiantes e ON a.estudiante_id = e.id
     JOIN clases c ON a.clase_id = c.id
     WHERE a.clase_id = ?
     ORDER BY a.fecha_hora DESC`,
    [clase_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Obtener reporte de asistencia por estudiante
app.get('/api/asistencias/estudiante/:estudiante_id', (req, res) => {
  const { estudiante_id } = req.params;

  db.all(
    `SELECT a.id, a.fecha_hora, c.nombre as clase, a.presente
     FROM asistencias a
     JOIN clases c ON a.clase_id = c.id
     WHERE a.estudiante_id = ?
     ORDER BY a.fecha_hora DESC`,
    [estudiante_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// ============ VALIDAR CÓDIGO QR ============

// Validar código QR y retornar información
app.post('/api/validar-qr', (req, res) => {
  const { codigo_qr } = req.body;

  if (!codigo_qr) {
    return res.status(400).json({ error: 'Código QR requerido' });
  }

  db.get(
    'SELECT id, nombre FROM clases WHERE codigo_qr = ? AND activa = 1',
    [codigo_qr],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Código QR no válido' });
      }
      res.json({ clase_id: row.id, clase: row.nombre });
    }
  );
});

// ============ RUTA PRINCIPAL ============

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`✓ También disponible en http://127.0.0.1:${PORT}`);
  console.log(`✓ Base de datos: ${path.join(__dirname, 'asistencia.db')}`);
});

// Manejar errores del servidor
server.on('error', (err) => {
  console.error('Error del servidor:', err.message);
  process.exit(1);
});

// Manejar interrupciones
process.on('SIGINT', () => {
  console.log('\nServidor detenido.');
  process.exit(0);
});
