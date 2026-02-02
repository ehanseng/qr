# Documentación Técnica - Sistema de Asistencia por QR

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                           │
│  HTML/CSS/JavaScript - Navegador Web                            │
│  - Interfaz responsiva                                          │
│  - Captura de cámara (getUserMedia)                             │
│  - Decodificación de QR                                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    HTTP/REST API
                    (JSON)
                         │
┌────────────────────────▼────────────────────────────────────────┐
│               SERVIDOR (Backend)                                │
│  Node.js + Express                                              │
│  - Validación de datos                                          │
│  - Gestión de asistencias                                       │
│  - Generación de códigos QR                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    SQLite Driver
                         │
┌────────────────────────▼────────────────────────────────────────┐
│               BASE DE DATOS                                     │
│  SQLite (asistencia.db)                                         │
│  - Tablas: clases, estudiantes, asistencias                     │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Registro de Asistencia

```
┌─────────────┐
│  Estudiante │
│  Abre App   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ Se registra/Login       │
│ (si es primera vez)     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Selecciona su nombre    │
│ de la lista             │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Activa cámara del       │
│ dispositivo             │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Apunta a código QR      │
│ en la clase             │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Decodifica QR           │
│ (jsQR.js)               │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Envía datos al servidor │
│ POST /api/asistencias   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Servidor valida datos   │
│ y evita duplicados      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Inserta en base de      │
│ datos                   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Responde con            │
│ confirmación            │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Estudiante ve           │
│ confirmación ✅         │
└─────────────────────────┘
```

## Base de Datos - Esquema

### Tabla: clases
```sql
id              INTEGER PRIMARY KEY (auto-incremento)
nombre          TEXT NOT NULL UNIQUE
codigo_qr       TEXT NOT NULL UNIQUE
fecha_creacion  DATETIME (fecha y hora de creación)
activa          BOOLEAN (1 = activa, 0 = inactiva)
```

### Tabla: estudiantes
```sql
id              INTEGER PRIMARY KEY (auto-incremento)
nombre          TEXT NOT NULL
matricula       TEXT NOT NULL UNIQUE
email           TEXT (opcional)
fecha_registro  DATETIME (fecha de registro)
```

### Tabla: asistencias
```sql
id              INTEGER PRIMARY KEY (auto-incremento)
clase_id        INTEGER FOREIGN KEY (referencias clases.id)
estudiante_id   INTEGER FOREIGN KEY (referencias estudiantes.id)
fecha_hora      DATETIME (fecha y hora del registro)
presente        BOOLEAN (1 = presente, 0 = ausente)
```

## Generación de Códigos QR

### Proceso de Generación

```javascript
// Datos a codificar
const qrData = {
  clase_id: 1,
  codigo: "ABC123",
  timestamp: "2024-01-15T10:30:00Z"
};

// Se convierte a JSON y se codifica en QR
// Resultado: Imagen QR que puede escanearse
```

### Librería Utilizada

- **qrcode**: Genera códigos QR en Node.js
- **jsQR**: Decodifica QR desde video/canvas

## Endpoints de API

### Clases

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clases` | Obtener todas las clases activas |
| GET | `/api/clases/:id` | Obtener clase específica |
| POST | `/api/clases` | Crear nueva clase |
| GET | `/api/clases/:id/qr` | Generar QR para una clase |

### Estudiantes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/estudiantes` | Obtener todos los estudiantes |
| POST | `/api/estudiantes` | Registrar nuevo estudiante |

### Asistencias

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/asistencias` | Registrar asistencia |
| GET | `/api/clases/:clase_id/asistencias` | Obtener asistencias de una clase |
| GET | `/api/asistencias/estudiante/:estudiante_id` | Obtener asistencias de un estudiante |

### Validación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/validar-qr` | Validar código QR |

## Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo, gradientes, animaciones
- **JavaScript ES6+**: Lógica interactiva
- **getUserMedia API**: Acceso a cámara web
- **Canvas API**: Procesamiento de frames de video

### Backend
- **Node.js**: Entorno de ejecución JavaScript
- **Express**: Framework web minimalista
- **SQLite3**: Base de datos embebida
- **qrcode**: Generación de códigos QR
- **cors**: Control de acceso entre dominios
- **body-parser**: Análisis de JSON

### Herramientas

```
├── nodemon        (Reinicio automático en desarrollo)
├── npm            (Gestor de paquetes)
└── SQLite3 CLI    (Herramienta de base de datos)
```

## Consideraciones de Seguridad

### Implementadas

1. **Validación de entrada**: Verificación de datos en servidor
2. **Prevención de duplicados**: No permite dos asistencias el mismo día
3. **CORS**: Control de origen cruzado
4. **Sanitización**: Escape de caracteres especiales

### Recomendado para Producción

1. **Autenticación**: Implementar JWT o OAuth
2. **Encriptación**: HTTPS/TLS
3. **Rate limiting**: Limitar requests por IP
4. **Validación avanzada**: Esquema de datos robusto
5. **Auditoría**: Registrar todas las operaciones
6. **Backup**: Sistema regular de copias de BD

## Configuración del Servidor CORS

```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
```

## Gestión de Errores

### Códigos HTTP Utilizados

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error del servidor |

### Respuesta de Error

```json
{
  "error": "Descripción del error",
  "code": "ERROR_CODE"
}
```

## Optimizaciones Implementadas

1. **Índices en BD**: Búsquedas rápidas por clase y estudiante
2. **Consultas parametrizadas**: Previene inyección SQL
3. **Caché en frontend**: Reduc calls innecesarios
4. **Compresión de imágenes**: QR optimizados
5. **Lazy loading**: Carga de datos bajo demanda

## Pruebas y Depuración

### Herramientas Recomendadas

1. **Postman**: Testing de API REST
2. **DevTools**: Depuración del navegador
3. **SQLite Browser**: Inspección de base de datos
4. **Network Tab**: Monitoreo de requests

### Logs del Servidor

```javascript
// El servidor registra:
console.log('Conectado a SQLite en:', dbPath);
console.log('Servidor ejecutándose en http://localhost:3000');
console.error('Error al registrar asistencia:', error);
```

## Escalabilidad Futura

Para escalar a producción:

1. **Migrar a PostgreSQL**: Mejor para concurrencia
2. **Implementar Cache**: Redis para datos frecuentes
3. **Microservicios**: Separar responsabilidades
4. **Load Balancing**: Distribuir carga
5. **CDN**: Servir assets estáticos rápidamente

---

**Última actualización**: Enero 2024
**Versión**: 1.0.0
