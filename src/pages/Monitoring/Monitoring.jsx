import { useEffect, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Brain,
  Camera,
  CheckCircle2,
  Clock3,
  Eye,
  HeartPulse,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Square,
  Wifi,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

import "./Monitoring.css";

function Monitoring() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(112);

  const [currentEmotion, setCurrentEmotion] = useState({
    name: "Calm",
    emoji: "😌",
    confidence: 82,
    intensity: 76,
  });

  const [isPaused, setIsPaused] = useState(false);

  const [emotionSignals, setEmotionSignals] = useState([
    {
      name: "Happy",
      emoji: "😊",
      value: 68,
      color: "teal",
    },
    {
      name: "Calm",
      emoji: "😌",
      value: 82,
      color: "teal",
    },
    {
      name: "Neutral",
      emoji: "😐",
      value: 47,
      color: "lavender",
    },
    {
      name: "Anxious",
      emoji: "😟",
      value: 24,
      color: "coral",
    },
    {
      name: "Stressed",
      emoji: "😣",
      value: 18,
      color: "coral",
    },
    {
      name: "Sad",
      emoji: "😔",
      value: 12,
      color: "lavender",
    },
  ]);

  /* ============================================================
     MOCK LIVE TIMER
  ============================================================ */

  useEffect(() => {
    if (!isMonitoring || isPaused) {
      return undefined;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isMonitoring, isPaused]);

  /* ============================================================
     MOCK EMOTION CHANGES
  ============================================================ */

  useEffect(() => {
    if (!isMonitoring || isPaused) {
      return undefined;
    }

    const emotions = [
      {
        name: "Calm",
        emoji: "😌",
        confidence: 82,
        intensity: 76,
      },
      {
        name: "Happy",
        emoji: "😊",
        confidence: 91,
        intensity: 84,
      },
      {
        name: "Neutral",
        emoji: "😐",
        confidence: 87,
        intensity: 52,
      },
    ];

    const emotionTimer = setInterval(() => {
      const next =
        emotions[
          Math.floor(Math.random() * emotions.length)
        ];

      setCurrentEmotion(next);

      setEmotionSignals((previous) =>
        previous.map((signal) => {
          if (signal.name === next.name) {
            return {
              ...signal,
              value: next.intensity,
            };
          }

          return signal;
        })
      );
    }, 5000);

    return () => clearInterval(emotionTimer);
  }, [isMonitoring, isPaused]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const remainingSeconds = seconds % 60;

    return [
      hours,
      minutes,
      remainingSeconds,
    ]
      .map((value) =>
        String(value).padStart(2, "0")
      )
      .join(":");
  };

  const handleStopSession = () => {
    setIsMonitoring(false);
    setIsPaused(false);
  };

  const handleStartSession = () => {
    setIsMonitoring(true);
    setElapsedSeconds(0);
  };

  return (
    <main className="monitoring-page">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="monitoring-sidebar">
        <a
          href="/dashboard"
          className="monitoring-brand"
        >
          <span className="monitoring-brand__icon">
            <Brain size={20} />
          </span>

          <span>
            MindPulse <strong>AI</strong>
          </span>
        </a>

        <nav className="monitoring-nav">
          <span className="monitoring-nav__label">
            WORKSPACE
          </span>

          <a
            href="/dashboard"
            className="monitoring-nav__item"
          >
            <Activity size={17} />
            Overview
          </a>

          <a
            href="/monitoring"
            className="monitoring-nav__item monitoring-nav__item--active"
          >
            <Camera size={17} />
            Monitoring
          </a>

          <a
            href="/history"
            className="monitoring-nav__item"
          >
            <Clock3 size={17} />
            History
          </a>

          <a
            href="/reports"
            className="monitoring-nav__item"
          >
            <Activity size={17} />
            Reports
          </a>

          <span className="monitoring-nav__label monitoring-nav__label--second">
            ACCOUNT
          </span>

          <a
            href="/profile"
            className="monitoring-nav__item"
          >
            <HeartPulse size={17} />
            Profile
          </a>

          <a
            href="/settings"
            className="monitoring-nav__item"
          >
            <ShieldCheck size={17} />
            Settings
          </a>
        </nav>

        <div className="monitoring-sidebar__bottom">
          <div className="monitoring-sidebar__privacy">
            <ShieldCheck size={15} />

            <span>
              Privacy-first monitoring
            </span>
          </div>

          <a
            href="/dashboard"
            className="monitoring-sidebar__back"
          >
            <ArrowLeft size={14} />
            Dashboard
          </a>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="monitoring-main">
        {/* Header */}

        <header className="monitoring-header">
          <div>
            <span className="monitoring-header__eyebrow">
              REAL-TIME ANALYSIS
            </span>

            <h1>Emotion Monitoring</h1>

            <p>
              Stay present while MindPulse observes your
              emotional signals.
            </p>
          </div>

          <div className="monitoring-header__status">
            <span
              className={
                isMonitoring
                  ? "monitoring-status-dot"
                  : "monitoring-status-dot monitoring-status-dot--offline"
              }
            />

            <span>
              {isMonitoring
                ? "System ready"
                : "Session ended"}
            </span>

            <div className="monitoring-header__timer">
              <Clock3 size={14} />
              {formatTime(elapsedSeconds)}
            </div>
          </div>
        </header>

        {/* =================================================
            SESSION STATUS
        ================================================= */}

        <div className="monitoring-session-bar">
          <div className="monitoring-session-bar__left">
            <div className="monitoring-live-icon">
              <Wifi size={16} />
            </div>

            <div>
              <strong>
                {isMonitoring
                  ? "Live session active"
                  : "Session complete"}
              </strong>

              <span>
                {isMonitoring
                  ? "Emotion signals are being simulated in real time."
                  : "Your monitoring session has ended."}
              </span>
            </div>
          </div>

          <div className="monitoring-session-tags">
            <span>
              <Eye size={13} />
              Face detected
            </span>

            <span>
              <CheckCircle2 size={13} />
              Signal stable
            </span>
          </div>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <section className="monitoring-grid">
          {/* WEBCAM */}

          <Card
            className="monitoring-camera-card"
            padding="none"
          >
            <div className="monitoring-card-header">
              <div>
                <span className="monitoring-card-kicker">
                  CAMERA FEED
                </span>

                <h2>Live preview</h2>
              </div>

              <div className="monitoring-camera-status">
                <span />
                LIVE
              </div>
            </div>

            <div className="monitoring-camera">
              {/* Camera placeholder */}

              <div className="monitoring-camera__grid" />

              <div className="monitoring-camera__center">
                <div className="monitoring-camera__face">
                  <div className="monitoring-face-corner monitoring-face-corner--tl" />
                  <div className="monitoring-face-corner monitoring-face-corner--tr" />
                  <div className="monitoring-face-corner monitoring-face-corner--bl" />
                  <div className="monitoring-face-corner monitoring-face-corner--br" />

                  <div className="monitoring-face-placeholder">
                    <div className="monitoring-face-eyes">
                      <span />
                      <span />
                    </div>

                    <div className="monitoring-face-mouth" />
                  </div>

                  <div className="monitoring-face-label">
                    <span />
                    FACE DETECTED
                  </div>
                </div>
              </div>

              <div className="monitoring-camera__top">
                <span>
                  CAMERA 01
                </span>

                <span>
                  1080p • 30 FPS
                </span>
              </div>

              <div className="monitoring-camera__bottom">
                <span>
                  <span className="monitoring-camera-dot" />
                  Detection active
                </span>

                <span>
                  Confidence 94%
                </span>
              </div>

              {!isMonitoring && (
                <div className="monitoring-camera__ended">
                  <div>
                    <Square size={22} />

                    <strong>
                      Session ended
                    </strong>

                    <span>
                      Start a new session to continue.
                    </span>
                  </div>
                </div>
              )}

              {isMonitoring && isPaused && (
                <div className="monitoring-camera__paused">
                  <Pause size={24} />

                  <strong>
                    Monitoring paused
                  </strong>

                  <span>
                    Resume when you're ready.
                  </span>
                </div>
              )}
            </div>

            <div className="monitoring-camera-controls">
              {isMonitoring ? (
                <>
                  <button
                    type="button"
                    className="monitoring-control-button"
                    onClick={() =>
                      setIsPaused(
                        (previous) => !previous
                      )
                    }
                  >
                    {isPaused ? (
                      <Play size={15} />
                    ) : (
                      <Pause size={15} />
                    )}

                    {isPaused
                      ? "Resume"
                      : "Pause"}
                  </button>

                  <button
                    type="button"
                    className="monitoring-control-button monitoring-control-button--danger"
                    onClick={handleStopSession}
                  >
                    <Square size={14} />
                    Stop session
                  </button>
                </>
              ) : (
                <Button
                  icon={<Play size={15} />}
                  onClick={handleStartSession}
                >
                  Start new session
                </Button>
              )}
            </div>
          </Card>

          {/* CURRENT EMOTION */}

          <Card
            className="monitoring-emotion-card"
            padding="medium"
          >
            <div className="monitoring-card-header">
              <div>
                <span className="monitoring-card-kicker">
                  CURRENT STATE
                </span>

                <h2>Live emotion</h2>
              </div>

              <Activity
                size={17}
                className="monitoring-card-header__icon"
              />
            </div>

            <div className="monitoring-current-emotion">
              <div className="monitoring-current-emotion__orb">
                <div />

                <span>
                  {currentEmotion.emoji}
                </span>
              </div>

              <span className="monitoring-current-emotion__label">
                DETECTED EMOTION
              </span>

              <h3>
                {currentEmotion.name}
              </h3>

              <div className="monitoring-confidence">
                <div className="monitoring-confidence__header">
                  <span>
                    Confidence
                  </span>

                  <strong>
                    {currentEmotion.confidence}%
                  </strong>
                </div>

                <div className="monitoring-confidence__track">
                  <span
                    style={{
                      width: `${currentEmotion.confidence}%`,
                    }}
                  />
                </div>
              </div>

              <div className="monitoring-emotion-stats">
                <div>
                  <span>Intensity</span>

                  <strong>
                    {currentEmotion.intensity}%
                  </strong>
                </div>

                <div>
                  <span>Stability</span>

                  <strong>High</strong>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* =================================================
            EMOTION SIGNALS
        ================================================= */}

        <section className="monitoring-section">
          <div className="monitoring-section-header">
            <div>
              <span>
                EMOTION SIGNALS
              </span>

              <h2>
                What MindPulse is detecting
              </h2>

              <p>
                Relative intensity of detected emotional
                states.
              </p>
            </div>

            <div className="monitoring-signal-live">
              <span />
              Updating live
            </div>
          </div>

          <div className="monitoring-signals">
            {emotionSignals.map((signal) => (
              <Card
                key={signal.name}
                className={`monitoring-signal-card monitoring-signal-card--${signal.color}`}
                padding="medium"
              >
                <div className="monitoring-signal-card__top">
                  <div className="monitoring-signal-card__emotion">
                    <span>
                      {signal.emoji}
                    </span>

                    <strong>
                      {signal.name}
                    </strong>
                  </div>

                  <strong>
                    {signal.value}%
                  </strong>
                </div>

                <div className="monitoring-signal-card__track">
                  <span
                    style={{
                      width: `${signal.value}%`,
                    }}
                  />
                </div>

                <small>
                  {signal.value >= 70
                    ? "Strong signal"
                    : signal.value >= 40
                      ? "Moderate signal"
                      : "Low signal"}
                </small>
              </Card>
            ))}
          </div>
        </section>

        {/* =================================================
            AI OBSERVATION
        ================================================= */}

        <section className="monitoring-bottom-grid">
          <Card
            className="monitoring-observation"
            padding="medium"
          >
            <div className="monitoring-observation__header">
              <div className="monitoring-observation__icon">
                <Sparkles size={18} />
              </div>

              <div>
                <span>
                  AI OBSERVATION
                </span>

                <h2>
                  Your current emotional snapshot
                </h2>
              </div>
            </div>

            <p>
              Your current signals suggest a relatively
              calm emotional state. Facial cues indicate
              low stress activity with a stable level of
              positive engagement.
            </p>

            <div className="monitoring-observation__tags">
              <span>Calm dominant</span>
              <span>Low stress</span>
              <span>Stable</span>
            </div>

            <div className="monitoring-observation__notice">
              <AlertCircle size={15} />

              <span>
                This is an AI-generated observation and
                should not be considered a medical diagnosis.
              </span>
            </div>
          </Card>

          <Card
            className="monitoring-wellbeing"
            padding="medium"
          >
            <div className="monitoring-wellbeing__header">
              <span>
                LIVE WELL-BEING
              </span>

              <HeartPulse size={17} />
            </div>

            <div className="monitoring-wellbeing__score">
              <strong>84</strong>
              <span>/ 100</span>
            </div>

            <div className="monitoring-wellbeing__meter">
              <span />
            </div>

            <p>
              Balanced emotional state
            </p>

            <div className="monitoring-wellbeing__legend">
              <span>
                <i />
                Current
              </span>

              <span>
                <i />
                Healthy range
              </span>
            </div>
          </Card>
        </section>

        {/* Footer */}

        <footer className="monitoring-footer">
          <span>
            MindPulse AI • Real-time emotional awareness
          </span>

          <span>
            Privacy-first • Human-centric
          </span>
        </footer>
      </section>
    </main>
  );
}

export default Monitoring;