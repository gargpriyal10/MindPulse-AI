import {
  Activity,
  ArrowRight,
  Bell,
  Brain,
  CalendarDays,
  ChevronRight,
  Clock3,
  HeartPulse,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmotionCard from "../../components/domain/EmotionCard";
import SessionCard from "../../components/domain/SessionCard";
import ChartContainer from "../../components/domain/ChartContainer";

import {
  dashboardOverview,
  recentEmotions,
  sessionHistory,
  dailyWellbeing,
  wellbeingInsights,
} from "../../services/mockData";

import "./Dashboard.css";

function Dashboard() {
  /* ============================================================
     DASHBOARD DATA
  ============================================================ */

  const emotionData = recentEmotions
    .slice(0, 4)
    .map((item) => ({
      emotion: item.emotion,
      intensity: item.intensity,
      confidence: item.confidence,
      trend: 0,
    }));

  const sessions = sessionHistory
    .slice(0, 3)
    .map((session) => ({
      id: session.id,

      date: new Date(session.date).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      ),

      startTime: session.startTime,
      duration: session.duration,
      dominantEmotion: session.dominantEmotion,
      wellbeingScore: session.wellbeingScore,
      confidence: session.confidence,
      status: session.status,
    }));

  const trendData = dailyWellbeing.map(
    (item) => item.score
  );

  const chartPoints = trendData
    .map((value, index) => {
      const x =
        trendData.length === 1
          ? 50
          : (index / (trendData.length - 1)) * 100;

      const y = 100 - value;

      return `${x},${y}`;
    })
    .join(" ");

  const latestInsight =
    wellbeingInsights[0];

  /* ============================================================
     RENDER
  ============================================================ */

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
            href="/"
            className="dashboard-sidebar__logout"
          >
            ← Back to home
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
              Good afternoon, Priyal.
              <span> 👋</span>
            </h1>

            <p>
              Here's a look at your emotional
              well-being today.
            </p>

          </div>

          <div className="dashboard-header__actions">

            <button
              type="button"
              className="dashboard-notification"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span />
            </button>

            <div className="dashboard-avatar">
              PG
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

          {/* WELL-BEING */}

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

          {/* TOTAL SESSIONS */}

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

          {/* DOMINANT EMOTION */}

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

          {/* CONFIDENCE */}

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
            EMOTION OVERVIEW
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

                  {dailyWellbeing.map(
                    (item, index) => {

                      const x =
                        dailyWellbeing.length === 1
                          ? 50
                          : (index /
                            (dailyWellbeing.length -
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

                  {dailyWellbeing.map((item) => (
                    <span key={item.date}>
                      {item.label}
                    </span>
                  ))}

                </div>

              </div>

            </div>

          </ChartContainer>

          {/* AI INSIGHT */}

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