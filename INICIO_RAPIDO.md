# 🚀 INICIO RÁPIDO - 5 MINUTOS

## Windows (Recomendado)

### Paso 1: Descargar Node.js
- Ve a: https://nodejs.org/
- Descarga la versión **LTS**
- Instala normalmente

### Paso 2: Abrir PowerShell en esta carpeta
```powershell
# Click derecho en iniciar.bat
# O ejecuta desde PowerShell:
cd "C:\Users\usuario1\Documents\Tecnologías\QR-Asistencia"
.\iniciar.bat
```

### Paso 3: Abrir Navegador
- Abre: http://localhost:3000
- ¡Listo! 🎉

---

## Mac / Linux

### Paso 1: Instalar Node.js
```bash
# Mac con Homebrew:
brew install node

# Linux (Ubuntu):
sudo apt install nodejs npm
```

### Paso 2: Ejecutar Script
```bash
chmod +x ~/Documentos/Tecnologías/QR-Asistencia/iniciar.sh
~/Documentos/Tecnologías/QR-Asistencia/iniciar.sh
```

### Paso 3: Abrir Navegador
- http://localhost:3000

---

## Primera Vez (Datos de Prueba)

### Opción 1: Manual

1. **Ir a Pestaña "Profesor"**
   - Crear una clase: "Matemáticas 101"
   - Se genera automáticamente un QR

2. **Ir a Pestaña "Estudiante"**
   - Registrarse: "Juan Pérez" / Matrícula: "2024001"
   - Seleccionar nombre
   - Abrir cámara y escanear QR de la clase

3. **Ver Reportes**
   - Ir a Pestaña "Reportes"
   - Ver asistencias registradas

### Opción 2: Cargar Datos Automáticos

1. Abre DevTools (F12 en navegador)
2. Ve a "Console"
3. Copia y pega:
```javascript
// Primero cargar el script
const script = document.createElement('script');
script.src = '/../../datos-demo.js';  // Ajusta la ruta si es necesario
document.head.appendChild(script);

// Luego ejecutar
cargarDatosDemo();
```

O directamente en la consola:
```javascript
cargarDatosDemo();
```

---

## Funcionalidades Principales

### 👨‍🏫 PROFESOR
```
1. Crear Clase → Genera código QR automático
2. Ver sus clases → Muestra QR para cada una
3. Descargar QR → Imprime o comparte
4. Ver Reportes → Asistencias por clase
```

### 👨‍🎓 ESTUDIANTE
```
1. Registrarse → Primera vez (nombre + matrícula)
2. Marcar Asistencia → Escanea QR
3. Ver Historial → Reporte personal
```

### 📊 REPORTES
```
1. Por Clase → Todos los presentes
2. Por Estudiante → Histórico de asistencias
3. Visualización → Tablas claras
```

---

## Pantallas Principales

### Inicio
- Presentación del sistema
- Características principales

### Estudiante
- Formulario de registro
- Selector de nombre
- Cámara QR
- Resultado escaneo

### Profesor
- Crear nueva clase
- Listar clases
- QR para cada clase
- Botón descargar QR

### Reportes
- Seleccionar clase → Ver presentes
- Seleccionar estudiante → Ver historial

---

## Problemas Comunes

### ❌ "No puedo iniciar el servidor"

```powershell
# Verifica Node.js:
node --version
npm --version

# Si no funciona, reinicia tu PC y vuelve a instalar Node.js
```

### ❌ "La cámara no funciona"

- Verifica que el navegador tenga permiso de cámara
- Recarga la página (F5)
- Intenta en otro navegador (Chrome recomendado)

### ❌ "No puedo escanear el QR"

- Asegúrate que el QR esté bien iluminado
- Intenta a diferentes ángulos
- Prueba con otra aplicación de QR primero
- Verifica que el dispositivo tenga cámara frontal

### ❌ "Error de conexión al servidor"

```powershell
# En PowerShell, verifica puerto:
netstat -ano | findstr :3000

# Mata el proceso:
taskkill /PID NUMERO_DEL_PROCESO /F
```

### ❌ "Datos no se guardan"

- Verifica que no haya error en consola (F12)
- Revisa la terminal del servidor
- Comprueba que `asistencia.db` se creó

---

## Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `backend/server.js` | Servidor principal |
| `backend/asistencia.db` | Base de datos (se crea automático) |
| `frontend/index.html` | Página web |
| `frontend/css/styles.css` | Estilos |
| `frontend/js/app.js` | Lógica principal |
| `frontend/js/jsQR.js` | Decodificador QR |

---

## API Rápida (Para Pruebas)

Abre la consola (F12) y ejecuta:

```javascript
// Crear clase
fetch('http://localhost:3000/api/clases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'Mi Clase' })
}).then(r => r.json()).then(console.log);

// Ver todas clases
fetch('http://localhost:3000/api/clases')
  .then(r => r.json())
  .then(console.log);
```

---

## Estructura Carpetas

```
QR-Asistencia/
│
├── backend/                    # Servidor
│   ├── server.js              # Lógica del servidor
│   ├── package.json           # Dependencias
│   └── asistencia.db          # Base de datos
│
├── frontend/                  # Página web
│   ├── index.html             # Estructura HTML
│   ├── css/styles.css         # Diseño
│   └── js/
│       ├── app.js             # Lógica JavaScript
│       └── jsQR.js            # QR reader
│
├── README.md                  # Documentación completa
├── GUIA_RAPIDA.md            # Esta guía
├── iniciar.bat               # Script Windows
├── iniciar.sh                # Script Mac/Linux
├── datos-demo.js             # Cargar datos ejemplo
└── DESPLIEGUE_PRODUCCION.md  # Publicar online

```

---

## Próximos Pasos

1. ✅ Ejecutar servidor
2. ✅ Crear una clase
3. ✅ Registrar estudiante
4. ✅ Escanear QR
5. ✅ Ver reportes
6. 📚 Leer documentación técnica
7. 🚀 Desplegar en hosting

---

## URLs Útiles

- **Aplicación**: http://localhost:3000
- **DevTools**: Presiona F12
- **Node.js**: https://nodejs.org/
- **Repositorio**: [Tu repositorio]
- **Soporte**: [Tu email/contacto]

---

## Atajos Teclado

| Tecla | Función |
|-------|---------|
| F12 | Abrir DevTools |
| F5 | Recargar página |
| Ctrl+Shift+Delete | Limpiar caché |
| Ctrl+C (Terminal) | Detener servidor |

---

## ¡Listo para empezar! 🎉

Cualquier duda, consulta la **documentación completa** en `README.md`

**¡Feliz uso del sistema de asistencia! 📚**
