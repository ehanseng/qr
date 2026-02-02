# Sistema de Asistencia mediante QR

Una herramienta completa para tomar asistencia en clase utilizando códigos QR. Los estudiantes escanean un código QR con sus dispositivos móviles para registrar automáticamente su asistencia.

## Características

✅ **Registro de Estudiantes**: Gestión sencilla de datos de estudiantes
✅ **Creación de Clases**: Los profesores pueden crear clases y generar códigos QR
✅ **Escaneo de QR**: Los estudiantes escanean códigos QR para registrar asistencia
✅ **Reportes de Asistencia**: Visualización de reportes por clase o por estudiante
✅ **Base de Datos SQLite**: Almacenamiento seguro de datos
✅ **Interfaz Responsiva**: Funciona en desktop y dispositivos móviles

## Requisitos Previos

- **Node.js** (v14 o superior): [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Navegador moderno** con soporte para:
  - Cámara web (para escaneo de QR)
  - Geolocalización (opcional)

## Instalación

### 1. Clonar o Descargar el Proyecto

```bash
cd "ruta/del/proyecto"
```

### 2. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 3. Iniciar el Servidor

```bash
npm start
```

O para desarrollo con reinicio automático:

```bash
npm run dev
```

El servidor se ejecutará en: **http://localhost:3000**

## Uso

### Para Profesores

1. Abre la pestaña **"Profesor"**
2. Ingresa el nombre de la clase
3. Haz clic en **"Crear Clase"**
4. Se generará automáticamente un código QR
5. Imprime o muestra el QR en clase para que los estudiantes lo escaneen

### Para Estudiantes

1. Ve a la pestaña **"Estudiante"**
2. Si es la primera vez, regístrate con tu información
3. Selecciona tu nombre de la lista
4. Apunta tu dispositivo al código QR
5. ¡Se registrará tu asistencia automáticamente!

### Para Ver Reportes

1. Ve a la pestaña **"Reportes"**
2. Selecciona una clase o estudiante
3. Visualiza el resumen de asistencias

## Estructura del Proyecto

```
QR-Asistencia/
├── backend/
│   ├── server.js           # Servidor Express principal
│   ├── package.json        # Dependencias de Node.js
│   └── asistencia.db       # Base de datos SQLite (se crea automáticamente)
│
├── frontend/
│   ├── index.html          # Página principal
│   ├── css/
│   │   └── styles.css      # Estilos CSS
│   └── js/
│       ├── app.js          # Lógica principal
│       └── jsQR.js         # Decodificador QR
│
└── README.md               # Este archivo
```

## API REST

### Clases

- `GET /api/clases` - Obtener todas las clases
- `POST /api/clases` - Crear una nueva clase
- `GET /api/clases/:id` - Obtener clase por ID
- `GET /api/clases/:id/qr` - Generar código QR

### Estudiantes

- `GET /api/estudiantes` - Obtener todos los estudiantes
- `POST /api/estudiantes` - Registrar nuevo estudiante

### Asistencias

- `POST /api/asistencias` - Registrar asistencia
- `GET /api/clases/:clase_id/asistencias` - Obtener asistencias por clase
- `GET /api/asistencias/estudiante/:estudiante_id` - Obtener asistencias por estudiante

### Validación

- `POST /api/validar-qr` - Validar código QR

## Configuración

### Cambiar Puerto del Servidor

Edita el archivo `backend/server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Cambiar 3000 por otro puerto
```

### Variables de Entorno

Crea un archivo `.env` en la carpeta `backend`:

```
PORT=3000
DB_PATH=./asistencia.db
```

## Solución de Problemas

### Error: "Cannot find module 'express'"

```bash
cd backend
npm install
```

### La cámara no funciona

- Verifica que el navegador tenga permisos de cámara
- En HTTPS, los permisos están restringidos
- Usa http://localhost para desarrollo local

### La base de datos no se crea

- Verifica permisos de escritura en la carpeta `backend`
- Elimina `asistencia.db` si está corrupta e intenta de nuevo

### El QR no se escanea correctamente

- Asegúrate de que la cámara esté bien iluminada
- Prueba con diferentes ángulos
- Verifica que el QR esté completamente visible

## Mejoras Futuras

📌 Autenticación de usuarios (login/password)
📌 Exportar reportes a PDF/Excel
📌 Notificaciones por email
📌 Sistema de múltiples profesores
📌 Integración con plataformas educativas
📌 Análisis estadístico de asistencias

## Licencia

Proyecto de código abierto. Libre para usar y modificar.

## Soporte

Si encuentras problemas, revisa:
1. Los logs del servidor en la terminal
2. La consola del navegador (F12)
3. Que Node.js esté correctamente instalado

---

**¡Feliz enseñanza! 📚**
