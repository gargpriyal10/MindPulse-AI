import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  HeartPulse,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  LogOut,
  X,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmotionCard from "../../components/domain/EmotionCard";
import SessionCard from "../../components/domain/SessionCard";
import ChartContainer from "../../components/domain/ChartContainer";

import {
  notifications,
} from "../../services/mockData";

import {
  getMonitoringSessions,
} from "../../services/monitoringService";
import { getCurrentUser } from "../../services/auth";
import "./Dashboard.css";
import { logout } from "../../services/auth";


function getCompletedSessions() {
  return getMonitoringSessions()
    .filter((session) => session.status === "Completed")
    .sort(
      (a, b) =>
        new Date(b.endedAt || b.startedAt) -
        new Date(a.endedAt || a.startedAt)
    );
}

function getWeekStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  date.setDate(date.getDate() - diff);
  return date;
}

function getAverage(values) {
  const valid = values
    .map(Number)
    .filter((value) => Number.isFinite(value));

  if (!valid.length) return 0;

  return Math.round(
    valid.reduce((sum, value) => sum + value, 0) /
    valid.length
  );
}

function getDominantEmotion(sessions) {
  const totals = {};

  sessions.forEach((session) => {
    const emotions = session.emotions || {};

    Object.entries(emotions).forEach(
      ([emotion, value]) => {
        const numericValue = Number(value) || 0;
        totals[emotion] =
          (totals[emotion] || 0) + numericValue;
      }
    );

    if (
      !Object.keys(emotions).length &&
      session.dominantEmotion
    ) {
      totals[session.dominantEmotion] =
        (totals[session.dominantEmotion] || 0) + 1;
    }
  });

  const fallback = {
    name: "Calm",
    emoji: "😌",
    intensity: 0,
  };

  const entries = Object.entries(totals);

  if (!entries.length) return fallback;

  const [name, value] = entries.sort(
    (a, b) => b[1] - a[1]
  )[0];

  const emojiMap = {
    Happy: "😊",
    Calm: "😌",
    Neutral: "😐",
    Anxious: "😟",
    Stressed: "😣",
    Sad: "😔",
  };

  return {
    name,
    emoji: emojiMap[name] || "🙂",
    intensity: Math.min(100, Math.round(value)),
  };
}

function getEmotionData(sessions) {
  const totals = {
    Happy: 0,
    Calm: 0,
    Neutral: 0,
    Anxious: 0,
    Stressed: 0,
    Sad: 0,
  };

  sessions.forEach((session) => {
    const emotions = session.emotions || {};

    Object.keys(totals).forEach((emotion) => {
      totals[emotion] +=
        Number(emotions[emotion]) || 0;
    });

    if (
      !Object.values(emotions).some(
        (value) => Number(value) > 0
      ) &&
      session.dominantEmotion &&
      totals[session.dominantEmotion] !== undefined
    ) {
      totals[session.dominantEmotion] += 1;
    }
  });

  const total = Object.values(totals).reduce(
    (sum, value) => sum + value,
    0
  );

  const emojiMap = {
    Happy: "😊",
    Calm: "😌",
    Neutral: "😐",
    Anxious: "😟",
    Stressed: "😣",
    Sad: "😔",
  };

  if (!total) return [];

  return Object.entries(totals)
    .map(([emotion, value]) => ({
      emotion,
      intensity: Math.round(
        (value / total) * 100
      ),
      confidence:
        getAverage(
          sessions.map(
            (session) => session.confidence
          )
        ),
      trend: 0,
      emoji: emojiMap[emotion] || "🙂",
    }))
    .sort((a, b) => b.intensity - a.intensity)
    .slice(0, 4);
}

function getTrendData(sessions) {
  const daily = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);

    const daySessions = sessions.filter(
      (session) => {
        const sessionDate = new Date(
          session.endedAt || session.startedAt
        );

        return (
          sessionDate.getFullYear() ===
          date.getFullYear() &&
          sessionDate.getMonth() ===
          date.getMonth() &&
          sessionDate.getDate() ===
          date.getDate()
        );
      }
    );

    daily.push({
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      score: getAverage(
        daySessions.map(
          (session) => session.wellbeingScore
        )
      ),
    });
  }

  return daily;
}

function Dashboard() {
  const currentUser = getCurrentUser();

  /* ============================================================
     TIME-BASED GREETING
  ============================================================ */

  const currentHour = new Date().getHours();

  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17 && currentHour < 21) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }

  /* ============================================================
     FIRST NAME
  ============================================================ */

  const rawName =
    currentUser?.name ||
    currentUser?.email?.split("@")[0] ||
    "User";

  /*
   * Take only the first word.
   *
   * Examples:
   * "Priyal Garg Cs Aiml24" → "Priyal"
   * "Priyal"                → "Priyal"
   * "priyal@example.com"    → "priyal"
   */

  const firstName =
    rawName
      .trim()
      .split(/\s+/)[0]
      .replace(/[^a-zA-Z]/g, "") || "User";

  /* ============================================================
     AVATAR INITIALS
  ============================================================ */

  const initials =
    firstName
      .slice(0, 2)
      .toUpperCase();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notificationList, setNotificationList] =
    useState(notifications);

  const monitoringSessions =
    getCompletedSessions();

  const hasRealSessions =
    monitoringSessions.length > 0;

  const weekStart = getWeekStart();

  const sessionsThisWeek =
    monitoringSessions.filter((session) => {
      const date = new Date(
        session.endedAt || session.startedAt
      );

      return date >= weekStart;
    });

  const averageWellbeing =
    getAverage(
      monitoringSessions.map(
        (session) => session.wellbeingScore
      )
    );

  const previousAverage =
    getAverage(
      monitoringSessions
        .slice(
          sessionsThisWeek.length,
          sessionsThisWeek.length * 2 || 1
        )
        .map(
          (session) => session.wellbeingScore
        )
    );

  const wellbeingChange =
    previousAverage > 0
      ? Number(
        (
          ((averageWellbeing -
            previousAverage) /
            previousAverage) *
          100
        ).toFixed(1)
      )
      : 0;

  const recentEmotionData =
    getEmotionData(monitoringSessions);

  const emotionData =
    hasRealSessions
      ? recentEmotionData
      : [];

  const sessions = monitoringSessions
    .slice(0, 3)
    .map((session) => ({
      id: session.id,

      date: new Date(
        session.endedAt ||
        session.startedAt
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),

      startTime: new Date(
        session.startedAt
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),

      duration: session.duration || 0,
      dominantEmotion:
        session.dominantEmotion || "Calm",
      wellbeingScore:
        session.wellbeingScore || 0,
      confidence:
        session.confidence || 0,
      status: session.status,
    }));

  const trendData =
    getTrendData(monitoringSessions);

  const fallbackTrend = [
    62, 67, 65, 72, 70, 78, 75,
  ];

  const chartData =
    hasRealSessions
      ? trendData
      : fallbackTrend.map(
        (score, index) => ({
          date: String(index),
          label: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ][index],
          score,
        })
      );

  const chartScores =
    chartData.map((item) => item.score);

  const chartPoints = chartScores
    .map((value, index) => {
      const x =
        chartScores.length === 1
          ? 50
          : (index /
            (chartScores.length - 1)) *
          100;

      const y = 100 - value;

      return `${x},${y}`;
    })
    .join(" ");

  const dominantEmotion =
    getDominantEmotion(
      monitoringSessions
    );

  const latestSession =
    monitoringSessions[0];

  const latestInsight = hasRealSessions
    ? {
      title:
        "Your latest monitoring pattern",
      description:
        latestSession?.dominantEmotion
          ? `Your latest session was primarily ${latestSession.dominantEmotion.toLowerCase()}. Keep using regular check-ins to understand how your emotional patterns change over time.`
          : "Complete more monitoring sessions to build a personalized well-being trend.",
      metric:
        averageWellbeing > 0
          ? `${averageWellbeing}%`
          : "—",
    }
    : {
      title:
        "Your emotional balance is building.",
      description:
        "Complete a monitoring session to start generating personalized well-being insights.",
      metric: "Ready",
    };

  const dashboardOverview = {
    wellbeingScore:
      averageWellbeing || 84,
    wellbeingChange:
      hasRealSessions
        ? wellbeingChange
        : 6.4,
    totalSessions:
      monitoringSessions.length || 28,
    sessionsThisWeek:
      sessionsThisWeek.length ||
      0,
    dominantEmotion,
  };

  const recentEmotions =
    hasRealSessions
      ? emotionData
      : [
        {
          emotion: "Calm",
          intensity: 76,
          confidence: 93,
          trend: 0,
        },
        {
          emotion: "Happy",
          intensity: 68,
          confidence: 95,
          trend: 0,
        },
        {
          emotion: "Neutral",
          intensity: 52,
          confidence: 89,
          trend: 0,
        },
        {
          emotion: "Anxious",
          intensity: 31,
          confidence: 86,
          trend: 0,
        },
      ];

  const unreadCount = notificationList.filter(
    (notification) => !notification.read
  ).length;

  const markAllAsRead = () => {
    setNotificationList((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <main className="dashboard-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="dashboard-sidebar">

        <a href="/" className="dashboard-brand">
          <span className="dashboard-brand__icon">
            <Brain size={20} />
          </span>

          <span>
            MindPulse <strong>AI</strong>
          </span>
        </a>

        <nav className="dashboard-nav">

          <span className="dashboard-nav__label">
            WORKSPACE
          </span>

          <a
            href="/dashboard"
            className="dashboard-nav__item dashboard-nav__item--active"
          >
            <Activity size={17} />
            Overview
          </a>

          <a
            href="/monitoring"
            className="dashboard-nav__item"
          >
            <Play size={17} />
            Monitoring
          </a>

          <a
            href="/history"
            className="dashboard-nav__item"
          >
            <Clock3 size={17} />
            History
          </a>

          <a
            href="/reports"
            className="dashboard-nav__item"
          >
            <TrendingUp size={17} />
            Reports
          </a>

          <span className="dashboard-nav__label dashboard-nav__label--second">
            ACCOUNT
          </span>

          <a
            href="/profile"
            className="dashboard-nav__item"
          >
            <HeartPulse size={17} />
            Profile
          </a>

          <a
            href="/settings"
            className="dashboard-nav__item"
          >
            <ShieldCheck size={17} />
            Settings
          </a>

        </nav>

        <div className="dashboard-sidebar__bottom">

          <div className="dashboard-sidebar__tip">

            <Sparkles size={16} />

            <div>
              <strong>Daily insight</strong>

              <p>
                {latestInsight.description}
              </p>
            </div>

          </div>

          <a
            href="/login"
            className="dashboard-sidebar__logout"
            onClick={logout}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </a>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="dashboard-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="dashboard-header">

          <div>

            <span className="dashboard-header__eyebrow">
              YOUR WELL-BEING SPACE
            </span>

            <h1>
              {greeting}, {firstName}.
              <span> 👋</span>
            </h1>

            <p>
              Here's a look at your emotional
              well-being today.
            </p>

          </div>

          <div className="dashboard-header__actions">

            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <div className="dashboard-notification-wrapper">

              <button
                type="button"
                className="dashboard-notification"
                aria-label="Notifications"
                aria-expanded={showNotifications}
                onClick={() =>
                  setShowNotifications(
                    (current) => !current
                  )
                }
              >
                <Bell size={18} />

                {unreadCount > 0 && (
                  <span className="dashboard-notification__badge">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="dashboard-notification-panel">

                  <div className="dashboard-notification-panel__header">

                    <div>
                      <strong>
                        Notifications
                      </strong>

                      <span>
                        {unreadCount > 0
                          ? `${unreadCount} unread`
                          : "All caught up"}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={closeNotifications}
                      aria-label="Close notifications"
                    >
                      <X size={15} />
                    </button>

                  </div>

                  <div className="dashboard-notification-panel__list">

                    {notificationList.length === 0 ? (
                      <div className="dashboard-notification-empty">
                        <Bell size={20} />

                        <span>
                          No notifications
                        </span>
                      </div>
                    ) : (
                      notificationList.map(
                        (notification) => (
                          <div
                            key={notification.id}
                            className={`dashboard-notification-item ${notification.read
                              ? "dashboard-notification-item--read"
                              : ""
                              }`}
                          >

                            <div className="dashboard-notification-item__icon">
                              <Bell size={14} />
                            </div>

                            <div className="dashboard-notification-item__content">

                              <strong>
                                {notification.title}
                              </strong>

                              <p>
                                {notification.message ||
                                  notification.description}
                              </p>

                              <small>
                                {notification.time ||
                                  notification.date ||
                                  "Recently"}
                              </small>

                            </div>

                            {!notification.read && (
                              <span className="dashboard-notification-item__dot" />
                            )}

                          </div>
                        )
                      )
                    )}

                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="dashboard-notification-panel__read-all"
                      onClick={markAllAsRead}
                    >
                      <Check size={14} />
                      Mark all as read
                    </button>
                  )}

                </div>
              )}

            </div>

            <div className="dashboard-avatar">
              {initials}
            </div>

          </div>

        </header>

        {/* =================================================
            QUICK START
        ================================================= */}

        <section className="dashboard-quick-start">

          <div className="dashboard-quick-start__content">

            <div className="dashboard-quick-start__badge">
              <span />
              READY WHEN YOU ARE
            </div>

            <h2>
              Check in with yourself.
            </h2>

            <p>
              Start a new monitoring session and
              discover what your emotions are
              telling you today.
            </p>

            <Button
              icon={<ArrowRight size={17} />}
              onClick={() => {
                window.location.href =
                  "/monitoring";
              }}
            >
              Start Monitoring
            </Button>

          </div>

          <div className="dashboard-quick-start__visual">

            <div className="dashboard-pulse-ring dashboard-pulse-ring--one" />

            <div className="dashboard-pulse-ring dashboard-pulse-ring--two" />

            <div className="dashboard-pulse-core">
              <Brain size={32} />
            </div>

            <div className="dashboard-floating-emotion dashboard-floating-emotion--one">
              😊
            </div>

            <div className="dashboard-floating-emotion dashboard-floating-emotion--two">
              😌
            </div>

          </div>

        </section>

        {/* =================================================
            METRICS
        ================================================= */}

        <section className="dashboard-metrics">

          <Card
            className="dashboard-metric-card"
            padding="medium"
          >

            <div className="dashboard-metric__icon dashboard-metric__icon--teal">
              <HeartPulse size={18} />
            </div>

            <div>

              <span>Well-being score</span>

              <strong>
                {dashboardOverview.wellbeingScore}
              </strong>

              <small>
                <TrendingUp size={12} />

                +{dashboardOverview.wellbeingChange}%
                this week
              </small>

            </div>

            <div className="dashboard-metric__ring">

              <svg viewBox="0 0 42 42">

                <circle
                  cx="21"
                  cy="21"
                  r="16"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="4"
                />

                <circle
                  cx="21"
                  cy="21"
                  r="16"
                  fill="none"
                  stroke="#14B8A6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${dashboardOverview.wellbeingScore} 100`}
                  transform="rotate(-90 21 21)"
                />

              </svg>

              <span>
                {dashboardOverview.wellbeingScore}%
              </span>

            </div>

          </Card>

          <Card
            className="dashboard-metric-card"
            padding="medium"
          >

            <div className="dashboard-metric__icon dashboard-metric__icon--lavender">
              <CalendarDays size={18} />
            </div>

            <div>

              <span>Total sessions</span>

              <strong>
                {dashboardOverview.totalSessions}
              </strong>

              <small>
                <TrendingUp size={12} />

                {dashboardOverview.sessionsThisWeek}
                {" "}this week
              </small>

            </div>

          </Card>

          <Card
            className="dashboard-metric-card"
            padding="medium"
          >

            <div className="dashboard-metric__icon dashboard-metric__icon--coral">
              {dashboardOverview.dominantEmotion.emoji}
            </div>

            <div>

              <span>Dominant emotion</span>

              <strong>
                {dashboardOverview.dominantEmotion.name}
              </strong>

              <small>
                Intensity{" "}
                {dashboardOverview.dominantEmotion.intensity}%
              </small>

            </div>

          </Card>

          <Card
            className="dashboard-metric-card"
            padding="medium"
          >

            <div className="dashboard-metric__icon dashboard-metric__icon--blue">
              <ShieldCheck size={18} />
            </div>

            <div>

              <span>Avg. confidence</span>

              <strong>
                {recentEmotions[0]?.confidence ?? 0}%
              </strong>

              <small>
                Consistent detection quality
              </small>

            </div>

          </Card>

        </section>

        {/* =================================================
            EMOTIONAL SNAPSHOT
        ================================================= */}

        <section className="dashboard-section">

          <div className="dashboard-section__header">

            <div>

              <span className="dashboard-section__kicker">
                EMOTIONAL SNAPSHOT
              </span>

              <h2>
                How you've been feeling
              </h2>

              <p>
                Your most recent emotional patterns.
              </p>

            </div>

            <a href="/reports">
              View reports
              <ChevronRight size={15} />
            </a>

          </div>

          <div className="dashboard-emotions">

            {emotionData.map((item) => (
              <EmotionCard
                key={item.emotion}
                {...item}
                compact
              />
            ))}

          </div>

        </section>

        {/* =================================================
            TREND + INSIGHT
        ================================================= */}

        <section className="dashboard-analysis">

          <ChartContainer
            title="Well-being trend"
            subtitle="Your score across recent check-ins"
            height={300}
          >

            <div className="dashboard-chart">

              <div className="dashboard-chart__y-axis">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <div className="dashboard-chart__area">

                <div className="dashboard-chart__grid">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="dashboard-chart__svg"
                >

                  <defs>

                    <linearGradient
                      id="wellbeingGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#14B8A6"
                        stopOpacity="0.24"
                      />

                      <stop
                        offset="100%"
                        stopColor="#14B8A6"
                        stopOpacity="0"
                      />

                    </linearGradient>

                  </defs>

                  <polygon
                    points={`0,100 ${chartPoints} 100,100`}
                    fill="url(#wellbeingGradient)"
                  />

                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="#14B8A6"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />

                  {chartData.map(
                    (item, index) => {

                      const x =
                        chartData.length === 1
                          ? 50
                          : (index /
                            (chartData.length -
                              1)) *
                          100;

                      const y =
                        100 - item.score;

                      return (
                        <circle
                          key={`${item.date}-${index}`}
                          cx={x}
                          cy={y}
                          r="1.5"
                          fill="#0F172A"
                          stroke="#14B8A6"
                          strokeWidth="1"
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    }
                  )}

                </svg>

                <div className="dashboard-chart__x-axis">

                  {chartData.map((item) => (
                    <span key={item.date}>
                      {item.label}
                    </span>
                  ))}

                </div>

              </div>

            </div>

          </ChartContainer>

          <Card
            className="dashboard-insight"
            padding="medium"
          >

            <div className="dashboard-insight__top">

              <div className="dashboard-insight__icon">
                <Sparkles size={18} />
              </div>

              <span>
                AI WELL-BEING INSIGHT
              </span>

            </div>

            <h3>
              {latestInsight.title}
            </h3>

            <p>
              {latestInsight.description}
            </p>

            <div className="dashboard-insight__stat">

              <TrendingUp size={16} />

              <strong>
                {latestInsight.metric}
              </strong>

              <span>
                well-being insight
              </span>

            </div>

            <a href="/reports">
              Explore your insights
              <ArrowRight size={15} />
            </a>

          </Card>

        </section>

        {/* =================================================
            RECENT SESSIONS
        ================================================= */}

        <section className="dashboard-section dashboard-recent">

          <div className="dashboard-section__header">

            <div>

              <span className="dashboard-section__kicker">
                RECENT ACTIVITY
              </span>

              <h2>
                Recent sessions
              </h2>

              <p>
                Your latest emotional check-ins.
              </p>

            </div>

            <a href="/history">
              View all
              <ChevronRight size={15} />
            </a>

          </div>

          <div className="dashboard-sessions">

            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                compact
              />
            ))}

          </div>

        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="dashboard-footer">

          <span>
            MindPulse AI • Emotion Recognition &
            Well-being Monitoring
          </span>

          <span>
            Privacy-first • Human-centric • 2026
          </span>

        </footer>

      </section>

    </main>
  );
}

export default Dashboard;