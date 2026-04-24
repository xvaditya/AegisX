# AegisX

**Autonomous AI Incident Analyst & Auto-Response Agent**

A cross-platform cybersecurity + observability assistant with Terminal Mode, Desktop Floating Assistant, simulated incidents, AI-powered analysis, and the Aegis mascot companion.

## Quick Start

### 1. Start the Backend
```bash
cd backend
venv\Scripts\activate    # Windows
source venv/bin/activate # macOS/Linux
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
Open http://localhost:5173

### 3. Start the Terminal UI
```bash
cd terminal
pip install -r requirements.txt
python app.py
```

### 4. Start the Desktop App (Electron)
```bash
cd electron
npm install
npm run dev
```

## Architecture

| Component | Tech | Port |
|-----------|------|------|
| Backend | FastAPI + Python | :8000 |
| Frontend | React + TypeScript + Vite | :5173 |
| Terminal | Python + Textual | N/A |
| Desktop | Electron | N/A |

## Folder Structure

```
aegis/
├── backend/     # FastAPI backend
├── frontend/    # React + TypeScript + Vite
├── electron/    # Electron desktop shell
└── terminal/    # Python Textual TUI
```

## Features

- 📡 Live incident feed (WebSocket)
- 🧠 AI-powered root cause analysis
- ⚡ Auto-response actions (block IP, restart service, scan, kill process)
- 📊 Real-time system metrics (CPU, memory, disk, network)
- 🛡️ Animated Aegis mascot with 9 states
- 💬 Command center / chat interface
- 🖥️ Desktop floating assistant overlay
- 🖥️ Terminal UI with ASCII mascot
