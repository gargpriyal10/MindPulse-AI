# 🧠 MindPulse AI — Frontend

> A modern, responsive frontend for an AI-powered emotional wellness and monitoring platform.

MindPulse AI is designed to provide users with a human-centric interface for monitoring emotional patterns, reviewing wellbeing insights, managing monitoring sessions, and exploring personalized reports.

The frontend focuses on a clean, professional dark-themed interface with responsive layouts and an intuitive user experience.

---

## ✨ Features

### 🏠 Dashboard

The central workspace of MindPulse AI provides an overview of the user's emotional wellbeing and monitoring activity.

- Personalized dashboard greeting
- Wellbeing overview
- Emotional metrics
- Monitoring statistics
- Quick-start monitoring action
- AI-generated daily insights
- Recent activity
- Notifications
- Navigation across all major workspace sections

---

### 🎥 Real-Time Monitoring

The Monitoring page provides the main emotional monitoring experience.

- Browser camera access
- Camera permission handling
- Real-time camera preview
- MediaPipe face detection
- Face detection status
- Face bounding-box visualization
- Emotion signal visualization
- Current emotion indicator
- Confidence score
- Wellbeing score
- Monitoring timer
- Pause / resume monitoring
- Stop monitoring session
- Session result storage

> Camera video is processed during the monitoring experience, while completed session results are stored as session data rather than recorded video.

---

### 📜 Session History

The History page allows users to review previously completed monitoring sessions.

- Session list
- Session date and time
- Session duration
- Dominant emotion
- Confidence score
- Wellbeing score
- Emotion breakdown
- Session filtering and browsing
- Session detail visualization

---

### 📊 Reports

The Reports page provides a summarized view of the user's monitoring data.

- Wellbeing statistics
- Emotional pattern summaries
- Monitoring statistics
- Visual data representation
- Emotion insights
- Session-based analysis
- Report-oriented dashboard layout

---

### 👤 Profile

The Profile page provides a personalized overview of the user's MindPulse account.

- User information
- Account details
- Monitoring statistics
- Average wellbeing score
- Average AI confidence
- Total monitoring time
- Member information
- Profile management

---

### ⚙️ Settings

The Settings page allows users to control their MindPulse preferences.

#### Notifications

- Push notifications
- Session reminders
- Weekly reports
- Emotion alerts

#### Monitoring

- Auto-start camera preference
- Save session history preference

#### Privacy

- Anonymous analytics preference
- Privacy-oriented information

#### Account

- Profile management
- Account actions

Settings are persisted locally using browser storage and relevant user preferences are synchronized with the application's user data layer.

---

## 🔐 Authentication

MindPulse AI includes protected application routes.

### Public Routes

```text
/
 /login
 /register
