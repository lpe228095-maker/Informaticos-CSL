# Informáticos CSL

**Descripción breve:** Explica en 1–2 líneas qué hace este proyecto (por ejemplo: sitio educativo, app web, APIs de consulta, etc.).

---

## 📋 Tabla de contenido

- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Stack](#stack)
- [Requisitos](#requisitos)
- [Variables de entorno](#variables-de-entorno)
- [Cómo correrlo en local](#cómo-correrlo-en-local)
- [Probarlo en la nube](#probarlo-en-la-nube)
- [Endpoints](#endpoints)
- [Datos de prueba](#datos-de-prueba)
- [Guía de contribución](#guía-de-contribución)
- [Créditos](#créditos)
- [Licencia](#licencia)

---

## 🏗️ Arquitectura

Describe si tu proyecto funciona solo como frontend estático o si tiene un backend.

### Modo solo frontend
```
Frontend estático ──▶ Navegador
```

### Modo full‑stack (opcional)
```
Frontend + llamadas a API (/api/*)
Backend ──▶ Base de datos / almacenamiento
```

Explica brevemente cuál de los modos aplica en tu caso.

---

## 📁 Estructura del proyecto

```
Informaticos-CSL/
├── frontend/                    # HTML, CSS, JS o framework (Vite, React, etc.)
│   ├── index.html
│   ├── assets/
│   └── src/
├── backend/                     # (opcional) API en Node, Python, etc.
│   ├── package.json            # si es Node
│   ├── app.js / main.py
│   └── Dockerfile              # opcional si lo containerizas
├── docs/                        # documentación, imágenes, guías
├── scripts/                     # utilerías, semillas, ingestión de datos
├── .env.example                 # ejemplo de variables de entorno
└── README.md
```

---

## 🛠️ Stack

- **Frontend:** HTML / CSS / JavaScript (o Vite / React / cualquier framework, si aplica)
- **Backend (opcional):** Node.js + Express  (u otro)
- **Base de datos (opcional):** SQLite / PostgreSQL / MongoDB / Redis u otra
- **Despliegue sugerido:**
  - Frontend: GitHub Pages, Vercel o Netlify
  - Backend: Render, Railway, Fly.io u otro proveedor
- **Contenerización (opcional):** Docker / Docker Compose (si incluyes Dockerfile / docker-compose.yml)

---

## ⚙️ Requisitos

### Solo frontend
- Un navegador moderno es suficiente

### Full‑stack
- Node.js versión 18+ (si usas backend en Node)
- Python 3.10+ (si usas backend )
- Git para clonar el proyecto
- Docker (opcional, si deseas usar contenedores)

---

## 🔐 Variables de entorno

Crea un archivo `.env` (o dentro de `backend/` si tu estructura lo requiere). Aquí un ejemplo:

```env
NODE_ENV=development
PORT=3000

# Si usas base de datos:
DATABASE_URL=postgres://usuario:contraseña@host:puerto/nombre_de_bd

# Si usas APIs externas:
API_KEY_EXTERNA=tu_api_key
```

**Importante:** Asegúrate de mantener un archivo `.env.example` en el repositorio que liste las claves necesarias pero sin valores sensibles.

---

## 🚀 Cómo correrlo en local

### Opción A — Solo frontend (la más rápida)

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu_usuario/Informaticos-CSL.git
   cd Informaticos-CSL/frontend
   ```

2. **Sirve los archivos estáticos:**
   
   - **Con VS Code:** usa la extensión Live Server → clic derecho → Open with Live Server
   
   - **Con Python:**
     ```bash
     python -m http.server 5173
     ```

3. **Abre en tu navegador:** `http://localhost:5173` (o el puerto que uses)

---

### Opción B — Con backend (si existe carpeta `backend/`)

1. **En la terminal:**
   ```bash
   cd Informaticos-CSL/backend
   cp ../.env.example .env  # o crea tu propio .env
   npm install              # si es Node (o usa pip/virtualenv si es Python)
   npm run dev              # o npm start, o comando equivalente
   ```

2. **Verifica que el backend está corriendo:**
   ```bash
   http://localhost:3000/health
   ```

3. **En otra terminal** (o integrando en tu servidor backend), sirve el frontend de la forma descrita en la **Opción A** o configúralo para que el backend entregue los archivos estáticos.

---

### Opción C — Docker / Docker Compose (si aplicaste contenedores)

1. **En la raíz del proyecto:**
   ```bash
   docker compose up -d
   ```

2. **Verifica que todo esté funcionando:**
   - Frontend en `http://localhost:5173` (o el puerto que hayas mapeado)
   - Backend en `http://localhost:3000/health` (o el puerto que corresponda)

3. **Para detener:**
   ```bash
   docker compose down
   ```

---

## ☁️ Probarlo en la nube

### Frontend

- **GitHub Pages:** sube la carpeta `frontend/` a la rama `main`. En los Settings de tu repo → Pages, selecciona desplegar `frontend/`

- **Vercel / Netlify:** importa el repo. Como framework elige "Other" (o el preset que corresponda). Especifica la carpeta de salida (`frontend` o `frontend/dist`)

### Backend (si aplica)

1. Elige un proveedor como **Render**, **Railway** o **Fly.io**

2. Importa el repositorio (o apunta al `backend/` con un Dockerfile)

3. Configura las variables de entorno (`PORT`, `DATABASE_URL`, etc.)

4. Despliega y obtén la URL pública del backend

5. En el frontend, configura las llamadas a la API para que apunten a esa URL (puedes usar una variable de entorno del frontend como `VITE_API_URL`, `REACT_APP_API_URL`, etc.)

---

## 🌐 Endpoints

Aquí un esquema genérico — reemplaza con los tuyos:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Verifica que el servicio esté vivo |
| `GET` | `/api/items` | Lista de recursos |
| `POST` | `/api/items` | Crear un nuevo recurso |
| `GET` | `/api/items/:id` | Detalle de recurso |
| `PUT` | `/api/items/:id` | Actualizar un recurso |
| `DELETE` | `/api/items/:id` | Eliminar recurso |

### Ejemplo de curl:
```bash
curl http://localhost:3000/api/items
```

---

## 🗂️ Datos de prueba

- Si usas backend, incluye semillas o fixtures en `backend/seed/` o similar
- En el frontend, coloca recursos de prueba (imágenes, JSON, etc.) en `frontend/assets/`
- Documenta en `docs/` cualquier dataset o instrucción de uso

---

## 🤝 Guía de contribución

1. **Crea una rama desde `main`:**
   ```bash
   git checkout -b feat/mi-mejora
   ```

2. **Aplica formateo/lint** si el proyecto lo usa (Prettier, ESLint, etc.)

3. **Haz commit limpiamente** con mensajes claros (por ejemplo: `feat: agregar página de login`)

4. **Abre un Pull Request** contra `main` con una explicación corta de los cambios

Si deseas, podrías seguir convenciones como **Conventional Commits** (`feat:`, `fix:`, `docs:`, etc.)

---

## 👥 Créditos

Aquí los nombres y roles (reemplaza con los de tu equipo):

- **Nombre Apellido** — Frontend
- **Nombre Apellido** — Backend
- **Nombre Apellido** — Diseño / UX
- **Nombre Apellido** — Documentación

---

## 📄 Licencia

*Especifica aquí la licencia de tu proyecto (MIT, Apache, GPL, etc.)*

Nombre Apellido — frontend

Nombre Apellido — backend

Nombre Apellido — diseño / UX

Nombre Apellido — documentación
