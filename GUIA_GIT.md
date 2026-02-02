# Guía de Git para el Proyecto

## Inicializar Repositorio

Si quieres usar Git para controlar versiones:

```bash
# En la carpeta raíz del proyecto
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Inicial: Sistema de Asistencia por QR completo"

# Ver estado
git status
```

## Flujo de Trabajo Recomendado

### Rama Principal (main)
```bash
# Solo versiones estables
git checkout -b main
git push origin main
```

### Rama de Desarrollo (develop)
```bash
# Para cambios en desarrollo
git checkout -b develop
git push origin develop
```

### Ramas de Características (feature)
```bash
# Para cada nueva característica
git checkout -b feature/autenticacion
# ... hacer cambios ...
git add .
git commit -m "Agregar autenticación de profesores"
git push origin feature/autenticacion

# Luego hacer pull request a develop
```

## Comandos Git Básicos

### Ver cambios
```bash
git status              # Estado actual
git log                 # Historial de commits
git diff               # Cambios no guardados
```

### Guardar cambios
```bash
git add .              # Agregar todos los cambios
git commit -m "Descripción" # Hacer commit
git push              # Enviar a servidor
```

### Deshacer cambios
```bash
git restore archivo.js  # Deshacer cambios en archivo
git reset --hard       # Deshacer todos los cambios
git revert HASH        # Deshacer un commit anterior
```

### Actualizar desde servidor
```bash
git pull               # Obtener cambios del servidor
git fetch              # Solo descargar
```

## Conectar a GitHub

### Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `qr-asistencia`
3. Descripción: "Sistema de toma de asistencia con códigos QR"
4. Público o Privado (según prefieras)
5. Crear repositorio

### Conectar local con GitHub

```bash
# Copiar URL del repositorio desde GitHub
# Luego ejecutar:

git remote add origin https://github.com/TU_USUARIO/qr-asistencia.git
git branch -M main
git push -u origin main
```

## Archivo .gitignore

Ya está configurado para:
- node_modules/
- *.db (base de datos)
- .env (variables sensibles)
- .vscode/ (configuración local)

## Buenas Prácticas de Commits

### Mensajes claros
```bash
# ✅ Bien
git commit -m "Agregar validación de matrícula única"

# ❌ Mal
git commit -m "cambios"
```

### Frecuencia
```bash
# Commit después de cada característica completa
# No esperes a terminar todo el proyecto
git commit -m "Funcionalidad XYZ completada"
```

### Tamaño
```bash
# Cambios relacionados en un commit
# No mezcles características diferentes
```

## Flujo Completo de Ejemplo

```bash
# 1. Actualizar antes de empezar
git pull

# 2. Crear rama para nueva característica
git checkout -b feature/exportar-excel

# 3. Hacer cambios
# ... editar archivos ...

# 4. Ver qué cambió
git status
git diff

# 5. Agregar cambios
git add .

# 6. Commit
git commit -m "Agregar exportación a Excel"

# 7. Push a repositorio
git push origin feature/exportar-excel

# 8. En GitHub: crear Pull Request
# 9. Revisar cambios
# 10. Merge a main

# 11. Actualizar local
git checkout main
git pull
```

## Ignorar Cambios de Archivo

Si cambias `server.js` localmente pero no quieres subirlo:

```bash
# Indicar a Git que ignore los cambios futuros
git update-index --assume-unchanged backend/server.js

# Para revertir
git update-index --no-assume-unchanged backend/server.js
```

## Clonar el Proyecto

Si alguien quiere usar tu código:

```bash
git clone https://github.com/TU_USUARIO/qr-asistencia.git
cd qr-asistencia
cd backend
npm install
npm start
```

## Colaboración

### Si trabajas con otros

```bash
# Crear rama para colaborador
git checkout -b feature/colaborador-juan

# Trabajar...

# Sincronizar con cambios del equipo
git fetch origin
git rebase origin/main

# Resolver conflictos si hay
# ... editar archivos en conflicto ...
git add .
git rebase --continue
```

## Estadísticas del Repositorio

```bash
# Ver líneas de código
git log --numstat | awk '{print $1+=$1; $2+=$2} END {print "Agregadas: " $1 "; Eliminadas: " $2}'

# Ver contribuciones por autor
git shortlog -sn

# Ver cambios en un archivo
git log -p archivo.js
```

## Publicar Cambios

Para compartir tu trabajo:

### Opción 1: GitHub
```bash
git push origin main
```

### Opción 2: Crear Release
```bash
# Crear tag para versión
git tag -a v1.0.0 -m "Versión 1.0.0"

# Push tags
git push origin --tags
```

## Plantilla de Commit

Usa mensajes descriptivos:

```
Tipo: Descripción breve

Descripción detallada (opcional)

- Cambio 1
- Cambio 2

Fixes #123  (Si cierra un issue)
```

Tipos comunes:
- `feat:` Nueva característica
- `fix:` Arreglo de bug
- `docs:` Cambios de documentación
- `style:` Cambios de formato
- `refactor:` Mejora de código
- `test:` Agregar tests

---

## Automatización con GitHub Actions

Crear archivo `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: cd backend && npm install
      - run: cd backend && npm test
```

---

## Notas Importantes

- Nunca hagas `git push --force` sin confirmación del equipo
- Siempre haz `git pull` antes de trabajar
- Mantén ramas limpias sin commits "wip" (work in progress)
- Documenta commits importantes en CHANGELOG.md

¡Happy coding! 🚀
