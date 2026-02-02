# Guía de Despliegue en Producción

## Opciones de Hosting Recomendadas

### 1. **Heroku** (Fácil, con plan gratuito limitado)

#### Requisitos:
- Cuenta en Heroku: https://heroku.com
- Git instalado
- Heroku CLI instalado

#### Pasos:

```bash
# 1. Login en Heroku
heroku login

# 2. Crear aplicación
heroku create tu-nombre-app

# 3. Agregar BuildPack de Node.js (si no está automático)
heroku buildpacks:set heroku/nodejs

# 4. Desplegar
git push heroku main

# 5. Ver logs
heroku logs --tail
```

#### Archivo `Procfile` necesario:
```
web: npm start
```

Agrégalo en la carpeta backend.

---

### 2. **Railway** (Muy recomendado, gratuito con tarjeta)

#### Requisitos:
- Cuenta en Railway: https://railway.app
- Git instalado

#### Pasos:

```bash
# 1. Conectar proyecto
railway link

# 2. Establecer raíz del proyecto
railway env set RAILWAY_WORKDIR ./backend

# 3. Desplegar
railway up
```

---

### 3. **Vercel + Serverless Backend**

#### Para frontend (Vercel):
```bash
npm install -g vercel
cd frontend
vercel
```

#### Para backend (considerar Firebase Functions o similar)

---

### 4. **DigitalOcean** (VPS por $5/mes)

#### Requisitos:
- Cuenta DigitalOcean
- Acceso SSH a droplet

#### Pasos básicos:

```bash
# En el servidor VPS:

# 1. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Clonar proyecto
git clone tu-repositorio
cd tu-proyecto/backend

# 4. Instalar dependencias
npm install

# 5. Usar PM2 para mantener app ejecutándose
npm install -g pm2
pm2 start server.js --name "qr-asistencia"
pm2 startup
pm2 save

# 6. Configurar Nginx como proxy inverso
sudo apt install -y nginx
```

Crear `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name tu-dominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Reiniciar Nginx:
```bash
sudo systemctl restart nginx
```

---

## Considaraciones de Producción

### 1. Variables de Entorno

Crear `.env` en backend:
```
PORT=3000
NODE_ENV=production
DB_PATH=/home/usuario/qr-app/asistencia.db
SESSION_TIMEOUT=480
CORS_ORIGIN=https://tu-dominio.com
```

### 2. HTTPS con Let's Encrypt (gratuito)

```bash
# En DigitalOcean con Nginx:
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

### 3. Base de Datos en Producción

Para aplicaciones más grandes, considerar:

**PostgreSQL en lugar de SQLite:**

```javascript
// Reemplazar SQLite3 en server.js:
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

### 4. Monitoreo y Logs

Considerar servicios como:
- **Sentry**: Reporte de errores
- **LogRocket**: Sesiones de usuario
- **DataDog**: Monitoreo completo

### 5. Copias de Seguridad

Para SQLite en producción:
```bash
# Crear backup diario
0 2 * * * cp /path/to/asistencia.db /backups/asistencia-$(date +\%Y\%m\%d).db
```

Para PostgreSQL:
```bash
# Backup diario
0 2 * * * pg_dump DATABASE_URL > /backups/db-$(date +%Y%m%d).sql
```

### 6. Validación SSL/TLS

Verificar certificado:
```bash
curl -I https://tu-dominio.com
```

---

## Ejemplo Completo: Railway

### 1. Preparación

En la raíz del proyecto, crear `railway.json`:
```json
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd backend && npm start"
  }
}
```

### 2. Conectar a Railway

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Crear proyecto
railway init

# Desplegar
railway up
```

### 3. Ver URL pública

```bash
railway env
```

---

## Seguridad: Checklist de Producción

- [ ] HTTPS/SSL habilitado
- [ ] Variables de entorno configuradas
- [ ] CORS restricto a dominio específico
- [ ] Rate limiting implementado
- [ ] Validación de entrada en servidor
- [ ] Base de datos con respaldos
- [ ] Logs centralizados
- [ ] Monitoreo de errores activo
- [ ] Autenticación de usuarios (JWT)
- [ ] SQL Injection prevenido (prepared statements)
- [ ] XSS prevenido (Content Security Policy)

---

## Dominios

Proveedores recomendados:
- Namecheap (barato, bueno)
- Google Domains (seguro, integrado)
- Cloudflare (DNS gratis, CDN)

Configuración DNS (ejemplo):
```
A Record: tu-dominio.com → IP.DEL.SERVIDOR
CNAME Record: www → tu-dominio.com
```

---

## Actualizar Código en Producción

```bash
# En el servidor:
cd /home/usuario/tu-proyecto
git pull origin main
cd backend
npm install  # Si hay nuevas dependencias
pm2 restart "qr-asistencia"
```

---

## Troubleshooting

### Aplicación no se inicia
```bash
# Ver logs
pm2 logs qr-asistencia

# O en Heroku:
heroku logs --tail --app tu-nombre-app
```

### Base de datos corrupta
```bash
# Hacer backup primero
cp asistencia.db asistencia.db.backup

# Recrear:
rm asistencia.db
npm start  # Se recreará automáticamente
```

### Alto uso de memoria
- Implementar connection pooling
- Agregar caché (Redis)
- Optimizar consultas SQL

---

## Costo Estimado

| Servicio | Plan | Costo Mensual |
|----------|------|--------------|
| Railway | Starter | $5 |
| DigitalOcean | Basic | $5 |
| Vercel | Pro | $20 |
| Heroku | Standard | $7+ |
| PostgreSQL (separado) | AWS RDS | $10-50 |

**Opción más barata:** Railway ($5) o DigitalOcean ($5)

---

Para preguntas sobre despliegue específico, consulta la documentación oficial de cada plataforma.
