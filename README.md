[MindPulse_AI_README.md](https://github.com/user-attachments/files/33587481/MindPulse_AI_README.md)
# MindPulse AI

**MindPulse AI** is an emotion-recognition and well-being monitoring application that combines facial-expression and audio-based emotion analysis with a dashboard for reviewing sessions and reports.

> **Project status:** The application includes a React frontend and a Flask backend. Some dashboard visualizations and insights use mock/demo data, so not every displayed metric represents live model inference.

## Features

- Facial emotion analysis using MediaPipe and an ONNX model
- Audio emotion analysis using a Wav2Vec2-based model
- Combined face-and-audio emotion analysis
- JWT-based authentication and user profile management
- Session history, analytics, reports, and notification features
- Responsive React interface with a dark theme

## Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios, Chart.js, Lucide |
| Backend | Python, Flask, Flask-CORS, Flask-JWT-Extended |
| Database | SQLAlchemy, Flask-Migrate, Alembic |
| ML / Computer Vision | ONNX Runtime, MediaPipe, OpenCV, NumPy, Transformers |

## Architecture

```text
React + Vite frontend
        │
        │ REST API (Axios)
        ▼
Flask backend ─── Authentication & application services
        │
        ├── SQLAlchemy database
        ├── Facial emotion inference (MediaPipe + ONNX)
        └── Audio emotion inference (Transformers / Wav2Vec2)
```

## Run Locally

### Prerequisites

- Python 3.10+ (use a version compatible with the pinned backend dependencies)
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/gargpriyal10/MindPulse-AI.git
cd MindPulse-AI
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
```

Activate the environment:

**Windows PowerShell**
```powershell
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

Install dependencies and configure environment variables:

```bash
pip install -r requirements.txt
```

Create a local `.env` file using `.env.example` as a reference. Set the required secret keys and database URL before running the app.

If your database is configured for migrations, apply them:

```bash
flask --app run.py db upgrade
```

Start the API:

```bash
python run.py
```

The backend health endpoint is available at `http://127.0.0.1:5000/api/health`.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Set the API base URL in a local environment file, for example `.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

Run the development server:

```bash
npm run dev
```

For a production build:

```bash
npm run build
```

## API Overview

The Flask API includes routes for:

- Health checks
- Authentication and user profiles
- Image, audio, and combined emotion analysis
- Session history and analytics
- Reports and notifications
- Privacy-related actions, including history and account management

For exact route definitions and request formats, refer to the backend route modules.

## Repository Structure

```text
MindPulse-AI/
├── frontend/   # React application
└── backend/    # Flask API, database, and ML inference
```

## Notes

- Camera and microphone access require browser permission.
- Model inference and dependency installation may require additional system resources.
- Keep secrets in local environment files; do not commit real credentials.
- Verify dashboard metrics against backend responses before presenting them as live results.

## Author

**Priyal Garg**  
GitHub: [@gargpriyal10](https://github.com/gargpriyal10)
