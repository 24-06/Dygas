# 🔥 DYGAS — App de Censo

Sistema de censo interactivo para empresa de gas DYGAS. Mapa de Colombia, dashboard y verificación de cédulas.

> **No requiere base de datos.** Los datos son mock (en memoria).

---

## 🚀 Cómo correr el proyecto

### 1. Backend (NestJS) — Terminal 1

```bash
cd backend
pnpm install    # solo la primera vez
pnpm start:dev
```
✅ Corre en: `http://localhost:3000`

---

### 2. Frontend (Vue 3) — Terminal 2

```bash
cd frontend
pnpm install    # solo la primera vez
pnpm dev
```
✅ Corre en: `http://localhost:5173`

---

## 📦 Estructura del Proyecto

```
PRUEBA/
├── backend/          ← API NestJS
│   ├── src/
│   │   ├── data/         ← Datos mock (Colombia + personas)
│   │   ├── departments/  ← Módulo departamentos
│   │   ├── census/       ← Módulo censo
│   │   └── main.ts
│   └── .env
│
└── frontend/         ← App Vue 3 + Vite
    ├── src/
    │   ├── views/        ← Dashboard, Mapa, Censo, Registros
    │   ├── stores/       ← Pinia (departments, census)
    │   ├── router.js
    │   └── style.css
    └── .env
```

---

## 🔑 API Endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/departments` | Lista 32 departamentos |
| GET | `/departments/:id/municipalities` | Municipios del depto |
| GET | `/census/verify/:doc` | Verificar cédula |
| GET | `/census/stats` | Estadísticas generales |
| GET | `/census` | Todos los registros |
| POST | `/census` | Crear nuevo registro |

---

## 🧪 Cédulas de prueba

| Cédula | Persona | Estado |
|--------|---------|--------|
| `1098765432` | María González | Activo |
| `52456789` | Carlos Rodríguez | Activo |
| `71890123` | Ana Martínez | Activo |
| `1020334455` | Sandra Torres | Activo |
| `37654321` | Luis Castro | Inactivo |
| `43218765` | Patricia Álvarez | Pendiente |
| `9999999999` | (no existe) | NO ENCONTRADO |

---

## ⚙️ Variables de entorno

### `backend/.env`
```
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:3000
```
