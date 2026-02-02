# Guía de Instalación Rápida

## Windows (PowerShell)

### Paso 1: Instalar Node.js
Descarga desde: https://nodejs.org/ (versión LTS recomendada)

### Paso 2: Navegar a la carpeta del proyecto
```powershell
cd "C:\Users\usuario1\Documents\Tecnologías\QR-Asistencia"
```

### Paso 3: Instalar dependencias
```powershell
cd backend
npm install
```

### Paso 4: Iniciar servidor
```powershell
npm start
```

### Paso 5: Abrir en navegador
Abre tu navegador y ve a: http://localhost:3000

## Mac/Linux

### Paso 1: Instalar Node.js
```bash
# Con Homebrew (Mac)
brew install node

# O descargar desde: https://nodejs.org/
```

### Paso 2: Navegar a carpeta
```bash
cd ~/Documentos/Tecnologías/QR-Asistencia
```

### Paso 3: Instalar y ejecutar
```bash
cd backend
npm install
npm start
```

## Primer Uso

1. **Crear una Clase** (Pestaña "Profesor")
   - Nombre: "Programación 101"
   - Clic en "Crear Clase"

2. **Registrarse como Estudiante** (Pestaña "Estudiante")
   - Nombre: "Juan Pérez"
   - Matrícula: "2024001"
   - Clic en "Registrarse"

3. **Escanear QR** (Pestaña "Estudiante")
   - Selecciona tu nombre
   - Apunta a la cámara hacia el QR
   - ¡Asistencia registrada!

## Prueba con Simulador

Si no tienes QR físico, puedes:

1. Generar QR online: https://www.qr-code-generator.com/
2. Escanear desde pantalla de otra dispositivo
3. O usar la consola del navegador para enviar datos directamente

## Contacto

¿Preguntas? Abre un issue en el repositorio o contacta al administrador.
