# 🤔 Preguntas Frecuentes (FAQ)

## Instalación

### P: ¿Qué versión de Node.js necesito?
**R:** Node.js 14 o superior. Descargar desde https://nodejs.org/ (LTS recomendado).

### P: ¿Funciona en Windows, Mac y Linux?
**R:** Sí, funciona en todos. Usa `iniciar.bat` (Windows) o `iniciar.sh` (Mac/Linux).

### P: ¿Qué pasa si el puerto 3000 está ocupado?
**R:** Edita `backend/server.js` línea: `const PORT = process.env.PORT || 3000;`
Cambia `3000` a otro puerto, ej: `8000`.

### P: ¿Es necesario instalar todo cada vez?
**R:** No. `npm install` solo se necesita la primera vez. Después solo `npm start`.

---

## Funcionamiento

### P: ¿Cómo uso la cámara para escanear QR?
**R:** En la pestaña "Estudiante", haz click en "Escanear". Permite acceso a cámara y apunta al QR.

### P: ¿Qué navegador debo usar?
**R:** Chrome, Firefox, Safari o Edge. Chrome es el más recomendado para la cámara.

### P: ¿Funciona sin conexión a internet?
**R:** Sí, funciona localmente. Si quieres publicar online, necesitarás servidor.

### P: ¿Dónde se guardan los datos?
**R:** En `backend/asistencia.db` (base de datos SQLite).

### P: ¿Puedo escanear el mismo QR dos veces?
**R:** No, el sistema previene duplicados del mismo día para el mismo estudiante.

### P: ¿Cómo cambio los colores de la interfaz?
**R:** Edita `frontend/css/styles.css` línea 10-17. Busca `:root` y cambia los colores.

---

## Datos

### P: ¿Cómo cargar datos de demostración?
**R:** Abre consola (F12), y ejecuta: `cargarDatosDemo()`

### P: ¿Cómo elimino todos los datos?
**R:** Borra el archivo `backend/asistencia.db` y reinicia el servidor.

### P: ¿Cómo exporto datos a Excel?
**R:** Actualmente exportas como tabla. Ver `MANUAL_EXTENSIONES.md` para agregar Excel.

### P: ¿Es seguro almacenar datos en SQLite?
**R:** Para desarrollo sí. Para producción, usa PostgreSQL (ver documentación técnica).

### P: ¿Cuántos estudiantes puedo registrar?
**R:** Teóricamente ilimitados. SQLite maneja bien hasta 100k registros.

---

## Códigos QR

### P: ¿Cómo genera el sistema los códigos QR?
**R:** Automáticamente cuando creas una clase. Usa librería `qrcode` npm.

### P: ¿Puedo descargar los QR?
**R:** Sí, hay botón "Descargar QR" en el panel del profesor.

### P: ¿Puedo imprimir los QR?
**R:** Sí, descárgalos primero, luego imprime como imagen normal.

### P: ¿Puedo usar QR generados externamente?
**R:** Sí, pero deben tener el código especial del sistema. Ver `DOCUMENTACION_TECNICA.md`.

### P: ¿Qué pasa si pierdo el QR de una clase?
**R:** Puedes generar otro. El sistema siempre puede crear nuevos códigos.

---

## Base de Datos

### P: ¿Cómo accedo a la base de datos?
**R:** Instala SQLite Browser: https://sqlitebrowser.org/

### P: ¿Cómo hago backup de los datos?
**R:** Copia `backend/asistencia.db` a una carpeta segura.

### P: ¿Puedo restaurar datos antiguos?
**R:** Sí, reemplaza `asistencia.db` con el backup antiguo.

### P: ¿Cómo migro a PostgreSQL?
**R:** Ver `MANUAL_EXTENSIONES.md` sección "Migración de SQLite a PostgreSQL".

### P: ¿Es posible tener múltiples bases de datos?
**R:** Técnicamente sí, pero requiere modificación de código. Contacta administrador.

---

## Errores Comunes

### P: Error "Cannot find module 'express'"
**R:** Solución: `cd backend` → `npm install`

### P: Error "SQLITE_CANTOPEN"
**R:** El archivo DB no existe. Elimina `asistencia.db` y reinicia servidor.

### P: Error "EADDRINUSE: port 3000 already in use"
**R:** Otro programa usa puerto 3000. Cambia puerto en `server.js`.

### P: La cámara dice "NotAllowedError"
**R:** El navegador no tiene permiso de cámara. Verifica permisos en Windows/Mac.

### P: El QR no se escanea
**R:** Problemas: iluminación, enfoque, movimiento rápido. Intenta más lentamente.

### P: "Network error" al conectar
**R:** Verifica que servidor esté corriendo con `npm start`.

---

## Seguridad

### P: ¿Es seguro que otros accedan a mi datos?
**R:** Si está en localhost es seguro. Si lo publicas, implementa autenticación.

### P: ¿Cómo agrego contraseña de profesor?
**R:** Ver `MANUAL_EXTENSIONES.md` sección "Autenticación de Profesores".

### P: ¿Qué información sensible se guarda?
**R:** Solo: nombre, matrícula, email. Nada de contraseñas por ahora.

### P: ¿Necesito HTTPS?
**R:** Para localhost no. Si lo publicas online, SÍ es obligatorio.

---

## Despliegue

### P: ¿Puedo publicar esto online?
**R:** Sí. Ver `DESPLIEGUE_PRODUCCION.md` para opciones (Railway, Heroku, DigitalOcean).

### P: ¿Cuánto cuesta publicarlo?
**R:** Desde $5/mes (Railway, DigitalOcean) o gratuito con limitaciones (Heroku).

### P: ¿Qué dominio necesito?
**R:** Es opcional. Puedes usar IP del servidor. Dominios cuestan $10-15/año.

### P: ¿Cómo configuro un dominio personalizado?
**R:** Compralo, configura DNS, y liga a tu hosting. Ver documentación del hosting.

### P: ¿Puedo crear una app móvil?
**R:** Sí, usando React Native, Flutter, etc. La API REST es la misma.

---

## Desarrollo

### P: ¿Cómo agrego nuevas características?
**R:** Ver `MANUAL_EXTENSIONES.md` con 10 ejemplos prácticos.

### P: ¿Dónde está la documentación de la API?
**R:** En `DOCUMENTACION_TECNICA.md` sección "Endpoints API".

### P: ¿Cómo reporto bugs?
**R:** Crea carpeta `issues/` con descripción o contacta administrador.

### P: ¿Puedo modificar el código?
**R:** Sí, es código abierto. Documenta tus cambios.

### P: ¿Hay versión mobile?
**R:** La versión web es responsive. Para app nativa, usa React Native.

---

## Mantenimiento

### P: ¿Cómo actualizo las dependencias?
**R:** `cd backend` → `npm update`

### P: ¿Cómo sé si hay nuevas versiones?
**R:** `npm outdated` en la carpeta backend.

### P: ¿Es seguro actualizar dependencias?
**R:** Generalmente sí. Prueba en desarrollo primero.

### P: ¿Cómo monitoreo el servidor?
**R:** Ve logs en terminal. Para producción, usa servicios como Sentry.

### P: ¿Cuándo debo hacer backup?
**R:** Antes de cualquier cambio importante. Diario en producción.

---

## Soporte

### P: ¿A quién contacto si tengo problemas?
**R:** 1) Revisa README.md 2) Consulta DOCUMENTACION_TECNICA.md 3) Contacta administrador

### P: ¿Hay comunidad donde puedo preguntar?
**R:** Puedes crear issues en GitHub si públicas el código.

### P: ¿Es esto código de producción?
**R:** Es un muy buen punto de partida. Para empresas, agrega autenticación y seguridad.

### P: ¿Puedo usarlo comercialmente?
**R:** Sí, es código abierto. Solo mantén los créditos.

### P: ¿Quién creó esto?
**R:** Este proyecto fue creado como ejemplo educativo de full-stack web.

---

## Rendimiento

### P: ¿Se vuelve lento con muchos datos?
**R:** SQLite es rápido hasta 1M registros. Para más, usa PostgreSQL.

### P: ¿Cuántos usuarios simultáneos aguanta?
**R:** Node.js en localhost: 100+. En producción depende del servidor.

### P: ¿Cómo mejoro el rendimiento?
**R:** Agregar caché (Redis), índices en BD, CDN para archivos estáticos.

### P: ¿Necesito hardware especial?
**R:** No, funciona en cualquier computadora moderna.

---

## Compatibilidad

### P: ¿Funciona en iPad/Tablet?
**R:** Sí, es responsive. Cámara funciona en tablets con cámara.

### P: ¿Funciona en teléfono?
**R:** Sí. Solo abre http://localhost:3000 en navegador del teléfono (misma red).

### P: ¿Qué navegadores no son compatibles?
**R:** Internet Explorer (muy viejo). Prácticamente todos los modernos funcionan.

### P: ¿Funciona sin JavaScript?
**R:** No, requiere JavaScript. Es single-page application (SPA).

---

## Próximas Preguntas

¿Tienes una pregunta que no está aquí?

1. Busca en los archivos de documentación
2. Consulta en línea (Stack Overflow, GitHub Issues)
3. Contacta al administrador del proyecto

---

**Última actualización:** Enero 2024
**Versión:** 1.0.0

¡Espero haber resuelto tus preguntas! 😊
