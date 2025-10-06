# Informáticos CSL

**Brief Description:** Explain in 1–2 lines what this project does (e.g., educational site, web app, query APIs, etc.).

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Stack](#stack)
- [Requirements](#requirements)
- [Environment Variables](#environment-variables)
- [How to Run Locally](#how-to-run-locally)
- [Deploy to the Cloud](#deploy-to-the-cloud)
- [Endpoints](#endpoints)
- [Test Data](#test-data)
- [Contribution Guide](#contribution-guide)
- [Credits](#credits)
- [License](#license)

---

## 🏗️ Architecture

Describe if your project works only as a static frontend or if it has a backend.

### Frontend-only mode
```
Static Frontend ──▶ Browser
```

### Full-stack mode (optional)
```
Frontend + API calls (/api/*)
Backend ──▶ Database / Storage
```

Briefly explain which mode applies in your case.

---

## 📁 Project Structure

```
Informaticos-CSL/
├── frontend/                    # HTML, CSS, JS or framework (Vite, React, etc.)
│   ├── index.html
│   ├── assets/
│   └── src/
├── backend/                     # (optional) API in Node, etc.
│   ├── package.json            # if using Node
│   ├── app.js / main.js
│   └── Dockerfile              # optional if containerizing
├── docs/                        # documentation, images, guides
├── scripts/                     # utilities, seeds, data ingestion
├── .env.example                 # example environment variables
└── README.md
```

---

## 🛠️ Stack

- **Frontend:** HTML / CSS / JavaScript (or Vite / React / any framework, if applicable)
- **Backend (optional):** Node.js + Express (or other)
- **Database (optional):** SQLite / PostgreSQL / MongoDB / Redis or other
- **Suggested Deployment:**
  - Frontend: GitHub Pages, Vercel or Netlify
  - Backend: Render, Railway, Fly.io or other provider
- **Containerization (optional):** Docker / Docker Compose (if including Dockerfile / docker-compose.yml)

---

## ⚙️ Requirements

### Frontend only
- A modern browser is sufficient

### Full-stack
- Node.js version 18+ (if using Node backend)
- Git to clone the project
- Docker (optional, if you want to use containers)

---

## 🔐 Environment Variables

Create a `.env` file (or inside `backend/` if your structure requires it). Here's an example:

```env
NODE_ENV=development
PORT=3000

# If using database:
DATABASE_URL=postgres://user:password@host:port/database_name

# If using external APIs:
EXTERNAL_API_KEY=your_api_key
```

**Important:** Make sure to keep a `.env.example` file in the repository that lists the necessary keys but without sensitive values.

---

## 🚀 How to Run Locally

### Option A — Frontend only (fastest)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your_user/Informaticos-CSL.git
   cd Informaticos-CSL/frontend
   ```

2. **Serve static files:**
   
   - **With VS Code:** use the Live Server extension → right click → Open with Live Server
   
   - **With a simple server:** use any local HTTP server of your choice

3. **Open in your browser:** `http://localhost:5173` (or the port you use)

---

### Option B — With backend (if `backend/` folder exists)

1. **In the terminal:**
   ```bash
   cd Informaticos-CSL/backend
   cp ../.env.example .env  # or create your own .env
   npm install
   npm run dev              # or npm start, or equivalent command
   ```

2. **Verify the backend is running:**
   ```bash
   http://localhost:3000/health
   ```

3. **In another terminal** (or integrating into your backend server), serve the frontend as described in **Option A** or configure it so the backend serves the static files.

---

### Option C — Docker / Docker Compose (if you applied containers)

1. **In the project root:**
   ```bash
   docker compose up -d
   ```

2. **Verify everything is working:**
   - Frontend at `http://localhost:5173` (or the port you mapped)
   - Backend at `http://localhost:3000/health` (or corresponding port)

3. **To stop:**
   ```bash
   docker compose down
   ```

---

## ☁️ Deploy to the Cloud

### Frontend

- **GitHub Pages:** upload the `frontend/` folder to the `main` branch. In your repo Settings → Pages, select to deploy `frontend/`

- **Vercel / Netlify:** import the repo. As framework choose "Other" (or the corresponding preset). Specify the output folder (`frontend` or `frontend/dist`)

### Backend (if applicable)

1. Choose a provider like **Render**, **Railway** or **Fly.io**

2. Import the repository (or point to `backend/` with a Dockerfile)

3. Configure environment variables (`PORT`, `DATABASE_URL`, etc.)

4. Deploy and get the public backend URL

5. In the frontend, configure API calls to point to that URL (you can use a frontend environment variable like `VITE_API_URL`, `REACT_APP_API_URL`, etc.)

---

## 🌐 Endpoints

Here's a generic schema — replace with yours:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check if service is alive |
| `GET` | `/api/items` | List of resources |
| `POST` | `/api/items` | Create a new resource |
| `GET` | `/api/items/:id` | Resource detail |
| `PUT` | `/api/items/:id` | Update a resource |
| `DELETE` | `/api/items/:id` | Delete resource |

### curl example:
```bash
curl http://localhost:3000/api/items
```

---

## 🗂️ Test Data

- If using backend, include seeds or fixtures in `backend/seed/` or similar
- In the frontend, place test resources (images, JSON, etc.) in `frontend/assets/`
- Document in `docs/` any dataset or usage instructions

---

## 🤝 Contribution Guide

1. **Create a branch from `main`:**
   ```bash
   git checkout -b feat/my-improvement
   ```

2. **Apply formatting/lint** if the project uses it (Prettier, ESLint, etc.)

3. **Commit cleanly** with clear messages (e.g., `feat: add login page`)

4. **Open a Pull Request** against `main` with a brief explanation of the changes

If you wish, you could follow conventions like **Conventional Commits** (`feat:`, `fix:`, `docs:`, etc.)

---

## 👥 Credits

Team names and roles here (replace with your team):

- **Backend** — Luis Jeréz
- **Backend** — Valesca Ventura
- **Frontend** — Kaoru Aizawa
- **Frontend** — César soto
- **Backend** — Vivian Monroy
---
