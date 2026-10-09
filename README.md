# 🌿 Serene Care — Backend

A RESTful API server for the Serene Care healthcare management system, built with **Node.js + Express + TypeScript**.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running with Docker](#running-with-docker)
- [CI/CD Pipeline](#cicd-pipeline)

---

## 🏥 About the Project

This repository contains the **backend API** of the Serene Care application. It handles user authentication, role-based access, care plan management, caregiver assignments, and more.

It connects to a **MySQL** database and exposes a REST API consumed by the frontend.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js 18 | JavaScript runtime |
| Express.js | Web framework |
| TypeScript | Type-safe JavaScript |
| MySQL2 | Database driver |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing |

---

## 📁 Project Structure

```
/
├── server.ts           # App entry point (Express setup, routes)
├── db.ts               # MySQL database connection
├── Controller/         # Business logic handlers
│   ├── userController.ts
│   ├── caregiverController.ts
│   ├── managerController.ts
│   ├── admincontroller.ts
│   └── careplanController.ts
├── routes/             # API route definitions
│   ├── userRoutes.ts
│   ├── caregiverRoutes.ts
│   ├── ManagerRoutes.ts
│   ├── careplanRoutes.ts
│   └── requirementRoutes.ts
├── services/           # Reusable service logic
├── types/              # TypeScript type definitions
└── dist/               # Compiled JS output (auto-generated, do not edit)
```

---

## 🔌 API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/login` | User login |
| POST | `/api/user/register` | User registration |
| GET | `/api/user/...` | User management |
| GET/POST | `/api/manager/...` | Manager operations |
| GET/POST | `/api/caregiver/...` | Caregiver operations |
| GET/POST | `/api/requirement/...` | Service requirements |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MySQL database running locally

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/NavodYasara/Serene-Care-backend.git
cd Serene-Care-backend

# 2. Install dependencies
npm install

# 3. Create a .env file (see Environment Variables below)

# 4. Start the dev server (with hot reload)
npm run dev
```

The API will be available at **http://localhost:5000**

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=serene_care_solution
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
```

> ⚠️ **Never commit your `.env` file to Git.** It is already listed in `.gitignore`.

---

## 🐳 Running with Docker

### Pull the pre-built image
```bash
docker pull navodyasara/serene-backend:latest
docker run -d -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_USER=root \
  -e DB_PASSWORD=admin \
  -e DB_NAME=serene_care_solution \
  -e JWT_SECRET=your_secret \
  -e REFRESH_SECRET=your_secret \
  navodyasara/serene-backend:latest
```

### Or run the full stack with Docker Compose
> From the root `SDP/` directory:
```bash
docker compose pull
docker compose up -d
```

---

## ⚙️ CI/CD Pipeline

On every push to the `dev` branch:

1. GitHub Actions compiles the TypeScript and builds a Docker image
2. The image is pushed to Docker Hub as `navodyasara/serene-backend:latest`

```
Push to dev → GitHub Actions → tsc build → Docker Build → Docker Hub
```
