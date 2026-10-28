# 🧠 MindPulse AI — Emotion Recognition & Well-being Monitoring System

**MindPulse AI** is a web-based application designed to explore emotional patterns through facial-expression and voice-based emotion recognition. It combines a React frontend with a Flask backend and machine-learning models to provide emotion history, well-being insights, analytics, reports, and monitoring-session management.

> **Important:** MindPulse AI is intended for well-being awareness and informational purposes only. Its outputs are estimates, not definitive measurements of a person's emotional state. It does not diagnose mental-health conditions and must not replace professional advice.

---

## ✨ Key Features

### 🔐 Authentication & Profile
- User registration and login.
- JWT-based authentication for protected backend endpoints.
- Protected profile access and profile/settings management.
- User-specific backend data access.

### 📊 Dashboard & Well-being Insights
- Emotion-related summaries and visual insights.
- Overview of monitoring activity and available session information.
- A central interface for navigating the application's modules.

### 📷 Facial Emotion Recognition
- Image-based emotion analysis through the backend.
- Computer-vision support using OpenCV and trained emotion models.
- Emotion labels and confidence scores where returned by the model/API.

### 🎙️ Voice Emotion Recognition
- Audio-based emotion analysis.
- WAV audio upload support in the backend audio service.
- Emotion labels and confidence scores returned by the analysis pipeline.

### 🔗 Multimodal Emotion Fusion
- Combines facial and audio emotion predictions through the fusion service.
- Provides a unified result when the required input modalities are available.

### 🕘 Emotion History & Monitoring Sessions
- Retrieve recorded emotion history.
- Start and stop monitoring sessions through backend endpoints.
- View available session records and session details.

### 📈 Reports & Analytics
- Emotion analytics based on recorded data.
- Report generation for supported time periods.
- Visual presentation of emotion-related information in the frontend.

### ⚙️ Settings & Notifications
- Manage supported user preferences.
- Retrieve notifications and mark notifications as read.
- Access application settings through the frontend.

### 🛡️ Privacy-Aware Design
- Protected API access using JWT authentication.
- Backend data access scoped to the authenticated user where implemented.
- Camera and microphone permissions are controlled by the browser and must be granted by the user before applicable features can work.

---

## 🧰 Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Routing | React Router |
| API communication | Axios |
| Charts | Chart.js, react-chartjs-2 |
| Icons | Lucide React |
| Backend | Python, Flask |
| Database | SQLite, SQLAlchemy |
| Database migrations | Flask-Migrate |
| Authentication | Flask-JWT-Extended |
| Computer vision | OpenCV, MediaPipe |
| Model inference | ONNX Runtime, PyTorch |
| Audio processing | Librosa, SoundFile, Hugging Face Transformers |
| Version control | Git, GitHub |

---

## 🏗️ Application Architecture

```text
                    ┌─────────────────────────┐
                    │       React + Vite      │
                    │       Frontend UI       │
                    └────────────┬────────────┘
                                 │
                                 │ Axios / REST API
                                 │ JWT Authorization
                                 ▼
                    ┌─────────────────────────┐
                    │       Flask Backend     │
                    │  Routes / Services      │
                    └────────────┬────────────┘
                                 │
             ┌───────────────────┼──────────────────┐
             ▼                   ▼                  ▼
      ┌─────────────┐     ┌─────────────┐    ┌─────────────┐
      │ Emotion /   │     │ History,    │    │ Reports,    │
      │ ML Services │     │ Sessions    │    │ Analytics   │
      └──────┬──────┘     └──────┬──────┘    └──────┬──────┘
             │                   │                  │
             ▼                   └────────┬─────────┘
      ┌─────────────┐                     ▼
      │ Image/Audio │              ┌─────────────┐
      │ Processing  │              │   SQLite    │
      └─────────────┘              │  Database   │
                                   └─────────────┘
```

The frontend communicates with Flask through REST API endpoints. Protected requests use a JWT access token. Backend services handle supported emotion-processing tasks and manage the corresponding application data.

---

## 📁 Project Structure

The following is a simplified overview of the main project folders. Individual files may differ as development continues.

```text
MindPulse-AI/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── __init__.py
│   ├── migrations/
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

Install the following before running the application:

- Python 3.10 or a compatible supported version.
- Node.js and npm.
- Git.
- A code editor such as Visual Studio Code.

Some machine-learning dependencies may require additional installation time and system resources.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/gargpriyal10/MindPulse-AI.git
cd MindPulse-AI
```

### 2. Set Up the Backend

Create and activate a virtual environment from the project root.

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

Install the backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Start the backend server:

```bash
python run.py
```

The Flask server is expected to run at:

```text
http://127.0.0.1:5000
```

Verify the health endpoint:

```text
GET http://127.0.0.1:5000/api/health
```

A successful response confirms that the backend server is running.

### 3. Set Up the Frontend

Open a **second terminal** at the project root.

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory and configure the backend API base URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal, commonly:

```text
http://localhost:5173
```

**Keep both terminals running** while using the application.

> If your project does not currently contain an `.env.example` file, create one only if you want to provide a sample environment configuration. Never commit passwords, secret keys, or production credentials.

---

## 🔌 API Overview

The following table lists the main API endpoints used or implemented in the project. Availability and request requirements depend on the current backend configuration.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Backend health check |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/users/profile` | Retrieve the authenticated user's profile |
| `PUT` | `/api/users/profile` | Update supported profile preferences |
| `POST` | `/api/emotions/upload` | Submit an image for emotion analysis |
| `POST` | `/api/audio/upload` | Submit WAV audio for emotion analysis |
| `POST` | `/api/emotions/fusion` | Submit data for multimodal emotion fusion |
| `GET` | `/api/emotions/history` | Retrieve emotion history |
| `GET` | `/api/emotions/analytics` | Retrieve emotion analytics |
| `GET` | `/api/reports?period=week` | Retrieve a report for the supported period |
| `POST` | `/api/sessions/start` | Start a monitoring session |
| `PUT` | `/api/sessions/{session_id}/end` | End a monitoring session |
| `GET` | `/api/sessions` | Retrieve available session records |
| `GET` | `/api/notifications/` | Retrieve notifications |
| `PUT` | `/api/notifications/{id}/read` | Mark a notification as read |

Protected endpoints require a valid access token in the authorization header:

```http
Authorization: Bearer <access_token>
```

For exact payload formats, required fields, validation rules, and response schemas, refer to the corresponding Flask route and service implementations. Endpoint availability should be verified against the current code before integrating new clients.

---

## 🧪 Testing

Test the frontend and backend independently, then verify the integration.

### Backend checks
- Confirm the server starts successfully.
- Check `GET /api/health`.
- Test registration and login.
- Test protected profile access with a valid JWT.
- Confirm protected endpoints reject missing or invalid tokens.
- Test image and WAV audio uploads using valid input files.
- Verify history, sessions, reports, analytics, and notifications.

### Frontend checks
- Confirm `npm run dev` starts successfully.
- Test registration and login flows.
- Confirm protected pages redirect unauthenticated users appropriately.
- Verify that API requests use the configured base URL.
- Test history, reports, analytics, settings, and notifications.
- Check browser console and network requests for errors.

### API testing with Postman

For protected requests, first authenticate and copy the access token returned by the login endpoint. Add it as a Bearer Token in Postman before testing protected routes.

---

## 🔒 Security & Responsible Use

- Do not commit `.env` files containing secrets or credentials.
- Use strong, unique secret keys outside local development.
- Use HTTPS and secure production configuration before any public deployment.
- Validate uploaded files and restrict access to user-specific data.
- Request camera and microphone access only when the relevant feature needs it.
- Avoid collecting or retaining sensitive media unnecessarily.
- Treat emotion labels and confidence scores as model estimates, not objective facts.
- Do not use the application as a medical, psychological, employment, or other high-stakes decision-making system.

---

## 📌 Development Status

MindPulse AI is under active development.

| Module | Status |
|---|---|
| Frontend and backend foundation | Implemented |
| Registration and login | Integrated |
| JWT-protected profile | Integrated |
| Dashboard | Implemented; some UI data may still be mocked |
| Emotion history | Integrated |
| Reports and analytics | Implemented; verify current data paths |
| Image and audio emotion processing | Implemented |
| Multimodal fusion | Implemented |
| Session management | Integrated |
| Settings | Integrated for supported preferences |
| Notifications | Integrated |
| Production deployment | **Pending** |

Some frontend views or helper functions may still use mock/demo data. Therefore, not every displayed value should be assumed to come from the live backend.

---

## 🛣️ Future Improvements

- Complete verification of all frontend-to-backend data flows.
- Replace remaining mock data with verified API responses where appropriate.
- Improve automated testing and error handling.
- Strengthen upload validation and privacy controls.
- Improve accessibility and responsive behavior.
- Prepare production environment configuration.
- Deploy the backend and frontend after local integration and testing are complete.

---

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Create a branch for your changes.
2. Keep changes focused and test the affected module.
3. Avoid committing secrets, generated files, or local databases containing personal data.
4. Submit a pull request with a clear description of the change.

---

## 📄 License

No license has been specified in this repository yet. Unless a license is added, do not assume that the project is available for unrestricted reuse or redistribution.

---

**MindPulse AI — supporting emotional awareness through technology, with privacy and responsible use in mind.**
