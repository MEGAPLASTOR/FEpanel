# Minecraft Cloud Hosting Panel

A cloud gaming and hosting platform for Minecraft servers, featuring real-time container management, slot-based resource allocation, WebRTC streaming, and Discord integrations.

---

## 🏗 Architecture Overview

The platform is structured as an npm workspaces monorepo with three core subsystems:

- **`frontend/`**: Next.js App Router web application with Tailwind CSS (dark mode by default), Firebase Authentication, real-time dashboard, console logs, slot management, and WebRTC client.
- **`backend/`**: NestJS REST & WebSocket API gateway managing user authentication, billing/subscriptions, slot orchestration, Firestore state persistence, and communication with node agents.
- **`agent/`**: Lightweight Node.js/TypeScript daemon running on VPS/dedicated host nodes to manage Docker containers (Minecraft server instances), collect resource metrics, stream container logs, and handle WebRTC sessions.
- **`firebase/`**: Firebase configuration, Firestore security rules, indexes, and Storage rules.

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                     │
│                Web Dashboard & WebRTC Client                │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
        HTTPS / WebSocket              Direct WebRTC
               │                              │
┌──────────────▼──────────────┐               │
│      Backend (NestJS)       │               │
│   API & Firestore Gateway   │               │
└──────────────┬──────────────┘               │
               │ HTTP / Secret Auth           │
┌──────────────▼──────────────────────────────▼───────────────┐
│                      Agent (VPS Node)                       │
│        Docker Engine / Minecraft Containers / WebRTC        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **Docker & Docker Compose**: Installed and running on VPS / host machine
- **Firebase Project**:
  - Firestore Database enabled
  - Firebase Authentication enabled (Email/Password, Google, etc.)
  - Firebase Storage bucket configured
  - Service Account credentials downloaded

---

## ⚙️ Environment Variable Setup

Copy `.env.example` to create `.env` files for each workspace as needed:

```bash
cp .env.example .env
```

### Environment Variable Reference

| Variable | Description | Target |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Client SDK credentials | Frontend |
| `NEXT_PUBLIC_API_URL` | Backend REST API URL | Frontend |
| `COOKIE_SECRET_CURRENT` | Cookie secret for session management | Frontend Middleware |
| `COOKIE_SECRET_PREVIOUS` | Previous cookie secret (for rotation) | Frontend Middleware |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK credentials | Backend / Middleware |
| `PORT` | Backend server port (default `4000`) | Backend |
| `CORS_ORIGIN` | Allowed CORS origin (default `http://localhost:3000`) | Backend |
| `AGENT_PORT` | Node agent port (default `5000`) | Agent |
| `AGENT_URL` | URL used by Backend to reach Agent | Backend |
| `AGENT_SECRET_KEY` | Shared secret key for Agent authentication | Backend & Agent |
| `DOCKER_SOCKET` | Path to Docker daemon socket | Agent |
| `STORAGE_BASE_PATH` | Host path for Minecraft slot data | Agent |
| `DISCORD_WEBHOOK_URL` | Discord webhook URL for notifications | Backend / Agent |
| `STUN_SERVER` / `TURN_*` | ICE / STUN / TURN server settings | Frontend & Agent |

---

## 🚀 Quick Start & Development

### 1. Install Monorepo Dependencies

```bash
npm install
```

### 2. Development Commands

Run individual services or build across workspaces:

```bash
# Start Frontend in development mode (http://localhost:3000)
npm run dev:frontend

# Start Backend in watch mode (http://localhost:4000)
npm run dev:backend

# Start Node Agent in watch mode (http://localhost:5000)
npm run dev:agent
```

### 3. Build Commands

```bash
# Build all workspaces
npm run build:frontend
npm run build:backend
npm run build:agent
```

### 4. Code Quality & Testing

```bash
# Run ESLint across all workspaces
npm run lint

# Run unit and integration tests across all workspaces
npm run test
```

---

## 📁 Project Structure

```
Panel/
├── .env.example                  # Template environment variables
├── .gitignore                    # Root gitignore rules
├── package.json                  # Root monorepo configuration & scripts
├── tsconfig.base.json            # Base TypeScript configuration
├── README.md                     # Documentation
│
├── frontend/                     # Next.js App Router Frontend
│   ├── src/
│   │   ├── app/                  # App Router pages and layouts
│   │   ├── components/           # Reusable UI components
│   │   ├── lib/                  # Firebase client, WebRTC, API utilities
│   │   └── styles/               # Tailwind CSS & global styles
│   └── package.json
│
├── backend/                      # NestJS Backend API
│   ├── src/
│   │   ├── auth/                 # Authentication & authorization guards
│   │   ├── slots/                # Slot allocation & lifecycle management
│   │   ├── users/                # User profile & role management
│   │   ├── agent/                # Agent communication client
│   │   └── firebase/             # Firebase Admin integration
│   └── package.json
│
├── agent/                        # VPS Host Agent Daemon
│   ├── src/
│   │   ├── docker/               # Dockerode container orchestration
│   │   ├── webrtc/               # WebRTC streaming & data channels
│   │   ├── metrics/              # CPU, RAM, and disk stats collection
│   │   └── logs/                 # Real-time Minecraft log forwarder
│   └── package.json
│
└── firebase/                     # Firebase Security Rules & Indexes
    ├── firebase.json             # Firebase deployment configuration
    ├── firestore.rules           # Firestore document security rules
    ├── firestore.indexes.json    # Composite query indexes
    └── storage.rules             # Firebase Storage access rules
```

---

## 🔒 Firebase Deployment

To deploy Firestore rules, indexes, and Storage rules:

```bash
cd firebase
firebase login
firebase use <your-project-id>
firebase deploy --only firestore,storage
```

---

## 📄 License

Private & Proprietary. All rights reserved.
