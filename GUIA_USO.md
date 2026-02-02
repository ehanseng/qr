# 🚀 GUÍA DE USO - SISTEMA DE ASISTENCIA QR

## 🎬 Cómo Comenzar

### 1. **Iniciar el Servidor**

Ejecuta uno de estos comandos desde la carpeta del proyecto:

**Opción A - Usar el archivo batch (Windows):**
```powershell
.\INICIAR_SERVIDOR.bat
```

**Opción B - Usar PowerShell:**
```powershell
.\IniciarServidor.ps1
```

**Opción C - Comando directo:**
```powershell
cd backend
node server.js
```

### 2. **Acceder a la Aplicación**

Abre tu navegador y ve a:
```
http://localhost:3000
```

---

## 👨‍🎓 PARA ESTUDIANTES

### Registrarse

1. Ve a la sección **"Estudiante"** en el menú
2. Llena el formulario:
   - **Nombre**: Tu nombre completo
   - **Matrícula**: Tu código de estudiante (único)
   - **Email** (opcional): Tu correo electrónico
3. Haz clic en **"Registrarse"**

### Marcar Asistencia

1. Selecciona tu nombre en el dropdown "Selecciona tu nombre"
2. Tu navegador pedirá permiso para usar la cámara
   - **Acepta el permiso** para continuar
3. **Apunta la cámara al código QR** que te muestre el profesor
4. El sistema detectará automáticamente el QR
5. Verás un mensaje de ✅ **"Asistencia registrada exitosamente"**

### ℹ️ Notas Importantes:
- ⚠️ Solo puedes registrar asistencia **una vez por clase por día**
- 📱 Funciona en cualquier dispositivo con cámara y navegador moderno
- 🔄 Después de registrar, el sistema se prepara para el siguiente QR

---

## 👨‍🏫 PARA PROFESORES

### Crear una Nueva Clase

1. Ve a la sección **"Profesor"** en el menú
2. Llena el formulario "Crear Nueva Clase":
   - **Nombre de la Clase**: Ej. "Programación Web - Sección A"
   - **Descripción** (opcional): Detalles sobre la clase
3. Haz clic en **"Crear Clase"**
4. La clase aparecerá en la sección "Mis Clases"

### Generar y Descargar el Código QR

1. En la tarjeta de tu clase, haz clic en **"Generar QR"**
   - Se generará un código QR único
2. Haz clic en **"Descargar"** para descargar la imagen
3. **Imprime el código QR** en papel o muéstalo en pantalla

### Ver Estadísticas de la Clase

- En cada tarjeta de clase verás:
  - **Total asistencias**: Número de registros
  - **Estudiantes únicos**: Cuántos estudiantes diferentes asistieron

### Eliminar una Clase

1. Haz clic en el botón 🗑️ (trash) en la esquina superior derecha de la tarjeta
2. Confirma la eliminación
3. ⚠️ Los datos de asistencia se mantienen en el historial

---

## 📊 REPORTES DE ASISTENCIA

### Reporte por Clase

1. Ve a la sección **"Reportes"** en el menú
2. En "Reporte por Clase":
   - Selecciona una clase del dropdown
   - Se mostrará una tabla con:
     - Nombres de estudiantes
     - Matrículas
     - Fecha y hora de asistencia
   - Total de registros y estudiantes únicos
3. Haz clic en **"📥 Exportar CSV"** para descargar en Excel

### Reporte por Estudiante

1. En "Reporte por Estudiante":
   - Selecciona un estudiante del dropdown
   - Se mostrará su historial completo:
     - Clases asistidas
     - Fechas y horas
     - Porcentaje de asistencia estimado
2. Haz clic en **"📥 Exportar CSV"** para descargar

### 📈 Datos que ves:

**Por Clase:**
- Total de asistencias
- Estudiantes únicos que asistieron
- Detalles de cada registro

**Por Estudiante:**
- Total de asistencias
- Clases atendidas
- Porcentaje de asistencia
- Historial completo

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### La cámara no funciona

**Problema:** "❌ No se pudo acceder a la cámara"

**Soluciones:**
1. Verifica que hayas dado **permiso al navegador** para usar la cámara
2. Cierra otras aplicaciones que usen la cámara
3. Recarga la página (F5)
4. Intenta con otro navegador (Chrome, Firefox, Edge)
5. Verifica que tu dispositivo tenga cámara

### El código QR no se detecta

**Problema:** El sistema no detecta el código QR

**Soluciones:**
1. Acerca la cámara más al código QR
2. Asegúrate que el código QR esté bien iluminado
3. Evita reflejos en la pantalla
4. Regenera el código QR desde el panel de profesor

### "El estudiante ya ha registrado asistencia hoy"

**Problema:** No puedo registrar asistencia dos veces

**Solución:** ✅ Esto es normal. El sistema previene duplicados **automáticamente**. Un estudiante puede registrarse solo una vez por clase por día.

### El navegador pide permisos repetidamente

**Solución:** Verifica tu configuración de privacidad del navegador. Algunos navegadores requieren permisos para cada sesión.

---

## ⚙️ CONFIGURACIÓN

### Puertos

- **Puerto del servidor**: 3000 (por defecto)
- Para cambiar, edita `backend/server.js` línea que dice `const PORT = ...`

### Base de datos

- **Ubicación**: `backend/asistencia.db`
- **Tipo**: SQLite3
- **Backup**: Simplemente copia el archivo asistencia.db

### URL de la API

- **Local**: http://localhost:3000
- **Red local**: http://[tu-ip]:3000
- Configurable en `frontend/js/app.js` línea `const API_BASE_URL = ...`

---

## 🔒 SEGURIDAD

### Datos almacenados

- ✅ Información de estudiantes (nombre, matrícula, email)
- ✅ Registro de asistencias (fecha, hora, clase)
- ✅ Información de clases (nombre, descripción, código QR)

### Privacidad

- Los datos se almacenan **localmente** en tu computadora
- CORS está habilitado para acceso desde cualquier origen (configurable)
- No hay conexión a servidores externos

---

## 📱 DISPOSITIVOS SOPORTADOS

- ✅ Computadoras (Windows, Mac, Linux)
- ✅ Tablets (iPad, Android)
- ✅ Smartphones (iPhone, Android)
- ✅ Cualquier navegador moderno (Chrome, Firefox, Safari, Edge)

**Requisito:** Cámara conectada al dispositivo

---

## 💡 TIPS Y TRUCOS

### Para Profesores:

1. **Genera QRs de antemano** antes de la clase
2. **Guarda los QRs** en una carpeta para reutilizarlos
3. Puedes **mostrar el QR en pantalla** o **imprimirlo**
4. Verifica las **estadísticas regularmente** para control de asistencia

### Para Estudiantes:

1. **Registra tu información correctamente** (sin errores en matrícula)
2. Ten **permiso de cámara habilitado** antes de clase
3. **Lleva el dispositivo a clase** con batería suficiente
4. Si hay problemas, **avisa al profesor** inmediatamente

### General:

1. Los **reportes se pueden exportar a Excel** para análisis
2. Puedes **crear múltiples clases** por profesor
3. El sistema funciona **sin conexión a internet**
4. Los datos **se guardan automáticamente**

---

## 📞 SOPORTE

Si encuentras problemas:

1. Revisa la sección "Solución de Problemas"
2. Verifica que el servidor esté ejecutándose
3. Intenta recargar la página
4. Cierra y reabre tu navegador
5. Reinicia el servidor

---

## 🎓 EJEMPLO DE USO COMPLETO

### Escenario: Primera clase

1. **Profesor** crea clase: "Matemáticas - Grupo A"
2. **Profesor** genera y **descarga el QR**
3. **Profesor** lo **imprime o muestra en pantalla**
4. **Estudiantes** abren la aplicación
5. **Estudiantes** se registran (nombre y matrícula)
6. **Estudiantes** seleccionan su nombre
7. **Estudiantes** escanean el código QR
8. Se registran ✅ **Asistencias automáticamente**
9. **Profesor** puede ver **reportes en cualquier momento**

---

*Última actualización: 19 de Enero, 2026*
*Sistema: QR-Asistencia v1.1*
