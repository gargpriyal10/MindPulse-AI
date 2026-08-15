import { useMemo, useState } from "react";
import {
    Activity,
    BarChart3,
    Brain,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Download,
    HeartPulse,
    Lightbulb,
    ShieldCheck,
    Sparkles,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import Card from "../../components/ui/Card";

import "./Reports.css";

const weeklyData = [
    { day: "Mon", score: 76, calm: 72, stress: 31 },
    { day: "Tue", score: 81, calm: 78, stress: 25 },
    { day: "Wed", score: 79, calm: 75, stress: 28 },
    { day: "Thu", score: 87, calm: 84, stress: 18 },
    { day: "Fri", score: 91, calm: 88, stress: 14 },
    { day: "Sat", score: 86, calm: 82, stress: 20 },
    { day: "Sun", score: 84, calm: 80, stress: 22 },
];

const emotionData = [
    {
        name: "Calm",
        value: 42,
        emoji: "😌",
        type: "teal",
    },
    {
        name: "Happy",
        value: 28,
        emoji: "😊",
        type: "purple",
    },
    {
        name: "Neutral",
        value: 18,
        emoji: "😐",
        type: "blue",
    },
    {
        name: "Anxious",
        value: 7,
        emoji: "😟",
        type: "coral",
    },
    {
        name: "Stressed",
        value: 5,
        emoji: "😣",
        type: "red",
    },
];

const monthlyScores = [
    { month: "May", score: 72 },
    { month: "Jun", score: 77 },
    { month: "Jul", score: 81 },
    { month: "Aug", score: 84 },
];

function Reports() {
    const [period, setPeriod] = useState("This week");
    const [showExportMessage, setShowExportMessage] =
        useState(false);

    const maxScore = Math.max(
        ...weeklyData.map((item) => item.score)
    );

    const minScore = Math.min(
        ...weeklyData.map((item) => item.score)
    );

    const averageScore = Math.round(
        weeklyData.reduce(
            (total, item) => total + item.score,
            0
        ) / weeklyData.length
    );

    const trend = useMemo(() => {
        const first = weeklyData[0].score;
        const last =
            weeklyData[weeklyData.length - 1].score;

        return Math.round(
            ((last - first) / first) * 100
        );
    }, []);

    const handleExport = () => {
        setShowExportMessage(true);

        setTimeout(() => {
            setShowExportMessage(false);
        }, 2500);
    };

    return (
        <main className="reports-page">
            {/* =====================================================
          SIDEBAR
      ===================================================== */}

            <aside className="reports-sidebar">
                <a
                    href="/dashboard"
                    className="reports-brand"
                >
                    <span className="reports-brand__icon">
                        <Brain size={20} />
                    </span>

                    <span>
                        MindPulse <strong>AI</strong>
                    </span>
                </a>

                <nav className="reports-nav">
                    <span className="reports-nav__label">
                        WORKSPACE
                    </span>

                    <a
                        href="/dashboard"
                        className="reports-nav__item"
                    >
                        <Activity size={17} />
                        Overview
                    </a>

                    <a
                        href="/monitoring"
                        className="reports-nav__item"
                    >
                        <HeartPulse size={17} />
                        Monitoring
                    </a>

                    <a
                        href="/history"
                        className="reports-nav__item"
                    >
                        <Clock3 size={17} />
                        History
                    </a>

                    <a
                        href="/reports"
                        className="reports-nav__item reports-nav__item--active"
                    >
                        <BarChart3 size={17} />
                        Reports
                    </a>

                    <span className="reports-nav__label reports-nav__label--second">
                        ACCOUNT
                    </span>

                    <a
                        href="/profile"
                        className="reports-nav__item"
                    >
                        <HeartPulse size={17} />
                        Profile
                    </a>

                    <a
                        href="/settings"
                        className="reports-nav__item"
                    >
                        <ShieldCheck size={17} />
                        Settings
                    </a>
                </nav>

                <div className="reports-sidebar__bottom">
                    <div className="reports-sidebar__privacy">
                        <ShieldCheck size={15} />

                        <span>
                            Your emotional data stays private.
                        </span>
                    </div>
                </div>
            </aside>

            {/* =====================================================
          MAIN
      ===================================================== */}

            <section className="reports-main">
                {/* Header */}

                <header className="reports-header">
                    <div>
                        <span className="reports-header__eyebrow">
                            INSIGHTS & ANALYTICS
                        </span>

                        <h1>Reports & Analytics</h1>

                        <p>
                            Understand how your emotional patterns
                            change over time.
                        </p>
                    </div>

                    <div className="reports-header__actions">
                        <label className="reports-period">
                            <CalendarDays size={14} />

                            <select
                                value={period}
                                onChange={(event) =>
                                    setPeriod(event.target.value)
                                }
                            >
                                <option>This week</option>
                                <option>This month</option>
                                <option>Last 3 months</option>
                            </select>

                            <ChevronDown size={13} />
                        </label>

                        <button
                            type="button"
                            className="reports-export"
                            onClick={handleExport}
                        >
                            <Download size={14} />
                            Export
                        </button>
                    </div>
                </header>

                {showExportMessage && (
                    <div className="reports-export-toast">
                        <CheckCircle2 size={15} />

                        Report export is ready in the demo.
                    </div>
                )}

                {/* =================================================
            SUMMARY CARDS
        ================================================= */}

                <section className="reports-summary-grid">
                    <Card
                        className="reports-summary-card reports-summary-card--teal"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>WELL-BEING SCORE</span>

                            <div>
                                <HeartPulse size={16} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>84</strong>

                            <span>/ 100</span>
                        </div>

                        <div className="reports-summary-card__trend reports-summary-card__trend--positive">
                            <TrendingUp size={12} />

                            <strong>+6.2%</strong>

                            <span>vs last period</span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>SESSIONS</span>

                            <div>
                                <Activity size={16} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>28</strong>

                            <span>sessions</span>
                        </div>

                        <div className="reports-summary-card__trend">
                            <TrendingUp size={12} />

                            <strong>+4</strong>

                            <span>this period</span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>AI CONFIDENCE</span>

                            <div>
                                <Brain size={16} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>93</strong>

                            <span>%</span>
                        </div>

                        <div className="reports-summary-card__trend reports-summary-card__trend--positive">
                            <CheckCircle2 size={12} />

                            <strong>Excellent</strong>

                            <span>signal quality</span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>AVG. SESSION</span>

                            <div>
                                <Clock3 size={16} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>18</strong>

                            <span>min</span>
                        </div>

                        <div className="reports-summary-card__trend">
                            <span>Consistent session length</span>
                        </div>
                    </Card>
                </section>

                {/* =================================================
            CHART AREA
        ================================================= */}

                <section className="reports-chart-grid">
                    {/* WEEKLY TREND */}

                    <Card
                        className="reports-trend-card"
                        padding="medium"
                    >
                        <div className="reports-card-header">
                            <div>
                                <span>
                                    EMOTIONAL TREND
                                </span>

                                <h2>
                                    Well-being over the week
                                </h2>

                                <p>
                                    Your daily emotional balance score.
                                </p>
                            </div>

                            <div className="reports-trend-badge">
                                <TrendingUp size={13} />

                                +{trend}% trend
                            </div>
                        </div>

                        <div className="reports-line-chart">
                            <div className="reports-chart-y-axis">
                                <span>100</span>
                                <span>80</span>
                                <span>60</span>
                                <span>40</span>
                                <span>20</span>
                                <span>0</span>
                            </div>

                            <div className="reports-chart-area">
                                <div className="reports-chart-grid-lines">
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                    <span />
                                </div>

                                <svg
                                    className="reports-chart-svg"
                                    viewBox="0 0 700 260"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient
                                            id="reportsGradient"
                                            x1="0"
                                            x2="0"
                                            y1="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#14b8a6"
                                                stopOpacity="0.2"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#14b8a6"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <path
                                        d="M0 115 L116 91 L233 100 L350 65 L466 40 L583 55 L700 62 L700 260 L0 260 Z"
                                        fill="url(#reportsGradient)"
                                    />

                                    <path
                                        d="M0 115 L116 91 L233 100 L350 65 L466 40 L583 55 L700 62"
                                        fill="none"
                                        stroke="#14b8a6"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />

                                    <circle
                                        cx="0"
                                        cy="115"
                                        r="5"
                                        fill="#14b8a6"
                                    />

                                    <circle
                                        cx="116"
                                        cy="91"
                                        r="5"
                                        fill="#14b8a6"
                                    />

                                    <circle
                                        cx="233"
                                        cy="100"
                                        r="5"
                                        fill="#14b8a6"
                                    />

                                    <circle
                                        cx="350"
                                        cy="65"
                                        r="5"
                                        fill="#14b8a6"
                                    />

                                    <circle
                                        cx="466"
                                        cy="40"
                                        r="6"
                                        fill="#14b8a6"
                                    />

                                    <circle
                                        cx="583"
                                        cy="55"
                                        r="5"
                                        fill="#14b8a6"
                                    />

                                    <circle
                                        cx="700"
                                        cy="62"
                                        r="5"
                                        fill="#14b8a6"
                                    />
                                </svg>

                                <div className="reports-chart-labels">
                                    {weeklyData.map((item) => (
                                        <span key={item.day}>
                                            {item.day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="reports-chart-footer">
                            <div>
                                <span>Average</span>

                                <strong>{averageScore}</strong>
                            </div>

                            <div>
                                <span>Highest</span>

                                <strong>{maxScore}</strong>
                            </div>

                            <div>
                                <span>Lowest</span>

                                <strong>{minScore}</strong>
                            </div>
                        </div>
                    </Card>

                    {/* EMOTION DISTRIBUTION */}

                    <Card
                        className="reports-emotion-card"
                        padding="medium"
                    >
                        <div className="reports-card-header">
                            <div>
                                <span>
                                    EMOTION DISTRIBUTION
                                </span>

                                <h2>
                                    Your emotional mix
                                </h2>
                            </div>

                            <BarChart3
                                size={17}
                                className="reports-card-icon"
                            />
                        </div>

                        <div className="reports-donut">
                            <div className="reports-donut__ring">
                                <div className="reports-donut__center">
                                    <strong>42%</strong>

                                    <span>Calm</span>
                                </div>
                            </div>
                        </div>

                        <div className="reports-emotion-list">
                            {emotionData.map((emotion) => (
                                <div
                                    className="reports-emotion-item"
                                    key={emotion.name}
                                >
                                    <div className="reports-emotion-item__name">
                                        <i
                                            className={`reports-emotion-dot reports-emotion-dot--${emotion.type}`}
                                        />

                                        <span>
                                            {emotion.emoji}
                                        </span>

                                        <strong>
                                            {emotion.name}
                                        </strong>
                                    </div>

                                    <div className="reports-emotion-item__value">
                                        <div>
                                            <span
                                                className={`reports-emotion-bar reports-emotion-bar--${emotion.type}`}
                                                style={{
                                                    width: `${emotion.value}%`,
                                                }}
                                            />
                                        </div>

                                        <strong>
                                            {emotion.value}%
                                        </strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* =================================================
            CALM VS STRESS
        ================================================= */}

                <section className="reports-secondary-grid">
                    <Card
                        className="reports-balance-card"
                        padding="medium"
                    >
                        <div className="reports-card-header">
                            <div>
                                <span>
                                    BALANCE ANALYSIS
                                </span>

                                <h2>
                                    Calm vs. stress
                                </h2>

                                <p>
                                    Comparing your strongest positive and
                                    negative signals.
                                </p>
                            </div>

                            <ShieldCheck
                                size={17}
                                className="reports-card-icon"
                            />
                        </div>

                        <div className="reports-balance-bars">
                            <div className="reports-balance-row">
                                <div>
                                    <span>
                                        <i className="reports-balance-dot reports-balance-dot--calm" />
                                        Calm
                                    </span>

                                    <strong>82%</strong>
                                </div>

                                <div className="reports-balance-track">
                                    <span
                                        className="reports-balance-fill reports-balance-fill--calm"
                                        style={{
                                            width: "82%",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="reports-balance-row">
                                <div>
                                    <span>
                                        <i className="reports-balance-dot reports-balance-dot--stress" />
                                        Stress
                                    </span>

                                    <strong>22%</strong>
                                </div>

                                <div className="reports-balance-track">
                                    <span
                                        className="reports-balance-fill reports-balance-fill--stress"
                                        style={{
                                            width: "22%",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="reports-balance-result">
                            <div>
                                <CheckCircle2 size={17} />
                            </div>

                            <span>
                                Your calm signals are currently
                                <strong> 3.7× stronger </strong>
                                than your stress signals.
                            </span>
                        </div>
                    </Card>

                    {/* MONTHLY PROGRESS */}

                    <Card
                        className="reports-progress-card"
                        padding="medium"
                    >
                        <div className="reports-card-header">
                            <div>
                                <span>
                                    LONG-TERM PROGRESS
                                </span>

                                <h2>
                                    Well-being trajectory
                                </h2>
                            </div>

                            <TrendingUp
                                size={17}
                                className="reports-card-icon"
                            />
                        </div>

                        <div className="reports-monthly-chart">
                            {monthlyScores.map((item) => (
                                <div
                                    className="reports-month-column"
                                    key={item.month}
                                >
                                    <div className="reports-month-value">
                                        {item.score}
                                    </div>

                                    <div className="reports-month-track">
                                        <span
                                            style={{
                                                height: `${item.score}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="reports-month-label">
                                        {item.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* =================================================
            AI INSIGHT
        ================================================= */}

                <Card
                    className="reports-ai-card"
                    padding="medium"
                >
                    <div className="reports-ai-icon">
                        <Sparkles size={19} />
                    </div>

                    <div className="reports-ai-content">
                        <span>AI-GENERATED INSIGHT</span>

                        <h2>
                            Your emotional balance is trending positively.
                        </h2>

                        <p>
                            MindPulse detected a gradual improvement in
                            your well-being score across recent sessions.
                            Calm signals remained consistently strong,
                            while stress-related signals stayed relatively
                            low. Maintaining regular breaks and reflective
                            sessions may help preserve this balance.
                        </p>

                        <div className="reports-ai-tags">
                            <span>
                                <TrendingUp size={12} />
                                Positive trend
                            </span>

                            <span>
                                <ShieldCheck size={12} />
                                Low stress
                            </span>

                            <span>
                                <Lightbulb size={12} />
                                Stable pattern
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Disclaimer */}

                <div className="reports-disclaimer">
                    <Lightbulb size={14} />

                    <span>
                        MindPulse insights are intended for personal
                        awareness and reflection. They are not a medical
                        diagnosis or substitute for professional care.
                    </span>
                </div>

                <footer className="reports-footer">
                    <span>
                        MindPulse AI • Emotional analytics
                    </span>

                    <span>
                        Privacy-first • Human-centric
                    </span>
                </footer>
            </section>
        </main>
    );
}

export default Reports;