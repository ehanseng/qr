# ✅ CHECKLIST DE VERIFICACIÓN - SISTEMA DE ASISTENCIA POR QR

## Fase 1: Instalación y Configuración

### Backend
- [ ] Node.js v14+ instalado (`node --version`)
- [ ] npm v6+ instalado (`npm --version`)
- [ ] Carpeta `backend` creada
- [ ] `package.json` existe con dependencias
- [ ] Archivo `server.js` implementado
- [ ] `.env.example` creado como referencia
- [ ] Todas las dependencias se instalan (`npm install`)
- [ ] Puerto 3000 disponible

### Frontend
- [ ] Carpeta `frontend` creada
- [ ] `index.html` con estructura HTML5
- [ ] `css/styles.css` con 1000+ líneas
- [ ] `js/app.js` con lógica completa
- [ ] `js/jsQR.js` con decodificador
- [ ] Todos los archivos enlazados correctamente
- [ ] Sin errores en consola (F12)

---

## Fase 2: Funcionalidad Backend

### Base de Datos
- [ ] SQLite3 se inicializa correctamente
- [ ] Tabla `clases` se crea
- [ ] Tabla `estudiantes` se crea
- [ ] Tabla `asistencias` se crea
- [ ] Archivo `asistencia.db` se genera

### Endpoints - Clases
- [ ] `GET /api/clases` devuelve lista vacía inicialmente
- [ ] `POST /api/clases` crea nueva clase
- [ ] Código QR se genera automáticamente
- [ ] `GET /api/clases/:id` obtiene clase específica
- [ ] `GET /api/clases/:id/qr` retorna imagen QR

### Endpoints - Estudiantes
- [ ] `GET /api/estudiantes` devuelve lista
- [ ] `POST /api/estudiantes` registra nuevo estudiante
- [ ] Matrícula debe ser única
- [ ] Email es opcional

### Endpoints - Asistencias
- [ ] `POST /api/asistencias` registra asistencia
- [ ] Previene duplicados (mismo día)
- [ ] `GET /api/clases/:clase_id/asistencias` funciona
- [ ] `GET /api/asistencias/estudiante/:id` funciona

### Validación
- [ ] `POST /api/validar-qr` valida código
- [ ] Retorna error si código no existe
- [ ] CORS está habilitado

---

## Fase 3: Interfaz Frontend

### Navegación
- [ ] Navbar visible y funcional
- [ ] Botones de navegación cambian página
- [ ] Clases activo/inactivo funciona
- [ ] Animaciones suave (fadeIn)

### Página Inicio
- [ ] Muestra bienvenida
- [ ] Muestra 3 características
- [ ] Diseño atractivo con gradientes

### Panel Estudiante
- [ ] Formulario registro funciona
- [ ] Estudiante se agrega a BD
- [ ] Selector muestra estudiantes
- [ ] Cámara se inicia al hacer click
- [ ] Escaneo de QR se ejecuta
- [ ] Resultado muestra confirmación

### Panel Profesor
- [ ] Formulario crear clase funciona
- [ ] Clase se agrega a BD
- [ ] Código QR se genera
- [ ] QR se muestra como imagen
- [ ] Botón descargar QR funciona

### Reportes
- [ ] Selector de clase funciona
- [ ] Tabla de presentes se carga
- [ ] Selector de estudiante funciona
- [ ] Tabla de historial se carga
- [ ] Datos son precisos

---

## Fase 4: Funcionalidad Completa

### Flujo Estudiante
- [ ] Registrarse con datos correctos
- [ ] Datos se guardan en BD
- [ ] Seleccionar nombre de lista
- [ ] Cámara solicita permisos
- [ ] Escaneo captura QR correctamente
- [ ] Asistencia se registra
- [ ] Confirmación visual aparece
- [ ] No permite duplicados

### Flujo Profesor
- [ ] Crear clase con nombre único
- [ ] Código QR se genera
- [ ] QR es diferente para cada clase
- [ ] Puede descargar QR
- [ ] Puede ver asistencias

### Flujo Datos
- [ ] Base de datos persiste datos
- [ ] Recarga página, datos permanecen
- [ ] Consultas SQL son correctas
- [ ] No hay duplicados innecesarios

---

## Fase 5: Diseño y UX

### Responsividad
- [ ] Funciona en desktop (1920px)
- [ ] Funciona en tablet (768px)
- [ ] Funciona en móvil (375px)
- [ ] Botones son clickeables en móvil
- [ ] Texto es legible en todos los tamaños
- [ ] Imágenes se escalan correctamente

### Colores y Tema
- [ ] Colores coherentes con paleta
- [ ] Contraste suficiente para lectura
- [ ] Gradientes se ven bien
- [ ] Animaciones no son irritantes
- [ ] Transiciones son suaves

### Accesibilidad
- [ ] Labels asociados a inputs
- [ ] Botones tienen texto descriptivo
- [ ] Tablas tienen encabezados
- [ ] Colores no son única información

---

## Fase 6: Manejo de Errores

### Validación Frontend
- [ ] Campos requeridos no están vacíos
- [ ] Email válido si se ingresa
- [ ] Mensajes de error claros
- [ ] Alertas desaparecen automáticamente

### Validación Backend
- [ ] Datos inválidos rechazan en servidor
- [ ] Errores SQL no exponemos
- [ ] Respuestas de error tienen código HTTP correcto

### Casos Edge
- [ ] Registrar estudiante con matrícula duplicada
- [ ] Registrar asistencia dos veces mismo día
- [ ] Crear clase con nombre duplicado
- [ ] Validar QR inválido
- [ ] Base de datos corrupta se recupera

---

## Fase 7: Seguridad Básica

- [ ] Prepared statements en SQL (prevenir inyección)
- [ ] Validación de entrada en servidor
- [ ] CORS restricto
- [ ] No hay datos sensibles en localStorage
- [ ] HTTPS preparado (para producción)
- [ ] Passwords (si aplica) se hashean

---

## Fase 8: Documentación

- [ ] `README.md` completo
- [ ] `INICIO_RAPIDO.md` con pasos claros
- [ ] `DOCUMENTACION_TECNICA.md` con detalles
- [ ] `DESPLIEGUE_PRODUCCION.md` con instrucciones
- [ ] `MANUAL_EXTENSIONES.md` para futuros cambios
- [ ] Comentarios en código donde es necesario
- [ ] Ejemplos de API funcionan

---

## Fase 9: Testing

### Pruebas Manuales
- [ ] Crear 5 clases diferentes
- [ ] Registrar 10 estudiantes
- [ ] Escanear QR con cámara real
- [ ] Generar reportes de cada clase
- [ ] Descargar QR código

### Pruebas de Errores
- [ ] Cerrar servidor y comprobar error
- [ ] Desconectar BD y comprobar error
- [ ] Datos corruptos maneja correctamente
- [ ] Red lenta no causa timeout

### Pruebas de Rendimiento
- [ ] 100 estudiantes cargan rápido
- [ ] 1000 registros de asistencia no ralentizan
- [ ] Reportes generan en <1 segundo

---

## Fase 10: Despliegue Preparado

- [ ] `.gitignore` configurado
- [ ] `package.json` con versiones fijas
- [ ] `.env.example` completado
- [ ] Database backup procedure documentado
- [ ] Logs configurados
- [ ] Health check endpoint (opcional)
- [ ] Variables de entorno documentadas

---

## Antes de Usar en Producción

- [ ] Autenticación de usuarios implementada
- [ ] Base de datos con respaldos automáticos
- [ ] HTTPS configurado
- [ ] Rate limiting implementado
- [ ] Logs centralizados
- [ ] Monitoreo de errores
- [ ] Plan de escalabilidad

---

## Checklist Rápido (5 min)

Si necesitas verificar rápidamente que todo funciona:

```bash
# 1. ¿Servidor inicia?
cd backend && npm start

# 2. ¿Página carga?
# Abre http://localhost:3000 en navegador

# 3. ¿BD se crea?
# Verifica que asistencia.db exista

# 4. ¿Puedes crear clase?
# Ir a Profesor y crear una clase

# 5. ¿Puedes registrar estudiante?
# Ir a Estudiante y registrarse

# TODO: ✅ Sistema funciona!
```

---

## Signos de Alerta 🚨

Si ves alguno de estos, hay un problema:

- [ ] ❌ Error: Cannot find module 'express'
  → Solución: `npm install` en backend

- [ ] ❌ Error 404 en http://localhost:3000
  → Solución: Verifica que server.js esté corriendo

- [ ] ❌ Cámara no funciona
  → Solución: HTTPS requerido (usar localhost es OK)

- [ ] ❌ Datos no se guardan
  → Solución: Verifica permisos de BD

- [ ] ❌ QR no se escanea
  → Solución: Iluminación, ángulo, o navegador

---

## Notas Finales

- Recomendado tener los 3 archivos de guía abiertos mientras trabajas
- Mantén consola de DevTools (F12) abierta para detectar errores
- Guarda cambios regularmente
- Haz backup de la BD periódicamente

---

**Estado del Proyecto:**
```
[ ] En desarrollo
[✓] Completado
[ ] En producción
[ ] Necesita mejoras
```

---

Última actualización: [Fecha]
Versión: 1.0.0
