import { useMemo, useState } from "react";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    Brain,
    CalendarDays,
    ChevronDown,
    Clock3,
    Download,
    HeartPulse,
    Info,
    ShieldCheck,
    Sparkles,
    TrendingUp,
} from "lucide-react";

import Card from "../../components/ui/Card";
import { getMonitoringSessions } from "../../services/monitoringService";

import "./Reports.css";

const reportData = {
    "This week": {
        summary: {
            wellbeing: 84,
            sessions: 28,
            confidence: 93,
            duration: 18,
        },

        weekly: [
            { label: "Mon", score: 76 },
            { label: "Tue", score: 81 },
            { label: "Wed", score: 79 },
            { label: "Thu", score: 87 },
            { label: "Fri", score: 91 },
            { label: "Sat", score: 86 },
            { label: "Sun", score: 84 },
        ],

        emotions: [
            {
                name: "Calm",
                value: 42,
                type: "teal",
                emoji: "😌",
            },
            {
                name: "Happy",
                value: 28,
                type: "purple",
                emoji: "😊",
            },
            {
                name: "Neutral",
                value: 18,
                type: "blue",
                emoji: "😐",
            },
            {
                name: "Anxious",
                value: 7,
                type: "coral",
                emoji: "😟",
            },
            {
                name: "Stressed",
                value: 5,
                type: "red",
                emoji: "😣",
            },
        ],

        balance: {
            calm: 82,
            stress: 22,
        },

        monthly: [
            { label: "May", score: 72 },
            { label: "Jun", score: 77 },
            { label: "Jul", score: 81 },
            { label: "Aug", score: 84 },
        ],

        trend: 6.4,

        insight:
            "Your emotional balance is trending positively. Calm and positive emotional states have appeared more frequently across your recent sessions.",
    },

    "This month": {
        summary: {
            wellbeing: 88,
            sessions: 112,
            confidence: 94,
            duration: 19,
        },

        weekly: [
            { label: "Week 1", score: 72 },
            { label: "Week 2", score: 77 },
            { label: "Week 3", score: 82 },
            { label: "Week 4", score: 88 },
        ],

        emotions: [
            {
                name: "Calm",
                value: 45,
                type: "teal",
                emoji: "😌",
            },
            {
                name: "Happy",
                value: 25,
                type: "purple",
                emoji: "😊",
            },
            {
                name: "Neutral",
                value: 17,
                type: "blue",
                emoji: "😐",
            },
            {
                name: "Anxious",
                value: 8,
                type: "coral",
                emoji: "😟",
            },
            {
                name: "Stressed",
                value: 5,
                type: "red",
                emoji: "😣",
            },
        ],

        balance: {
            calm: 85,
            stress: 18,
        },

        monthly: [
            { label: "Week 1", score: 72 },
            { label: "Week 2", score: 77 },
            { label: "Week 3", score: 82 },
            { label: "Week 4", score: 88 },
        ],

        trend: 10.2,

        insight:
            "Your emotional balance has improved consistently throughout the month, with calm signals becoming increasingly dominant.",
    },

    "Last 3 months": {
        summary: {
            wellbeing: 84,
            sessions: 326,
            confidence: 92,
            duration: 18,
        },

        weekly: [
            { label: "May", score: 72 },
            { label: "Jun", score: 77 },
            { label: "Jul", score: 81 },
            { label: "Aug", score: 84 },
        ],

        emotions: [
            {
                name: "Calm",
                value: 48,
                type: "teal",
                emoji: "😌",
            },
            {
                name: "Happy",
                value: 24,
                type: "purple",
                emoji: "😊",
            },
            {
                name: "Neutral",
                value: 16,
                type: "blue",
                emoji: "😐",
            },
            {
                name: "Anxious",
                value: 7,
                type: "coral",
                emoji: "😟",
            },
            {
                name: "Stressed",
                value: 5,
                type: "red",
                emoji: "😣",
            },
        ],

        balance: {
            calm: 82,
            stress: 22,
        },

        monthly: [
            { label: "May", score: 72 },
            { label: "Jun", score: 77 },
            { label: "Jul", score: 81 },
            { label: "Aug", score: 84 },
        ],

        trend: 16.7,

        insight:
            "Your long-term emotional trajectory shows steady improvement, with stronger calm signals and a gradual reduction in stress.",
    },
};


function getPeriodStart(period) {
    const now = new Date();
    const days =
        period === "This week"
            ? 7
            : period === "This month"
                ? 30
                : 90;

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    return start;
}

function getCompletedSessions(period) {
    const sessions = getMonitoringSessions();

    const start = getPeriodStart(period);

    return sessions
        .filter((session) => {
            if (session.status !== "Completed") {
                return false;
            }

            const dateValue =
                session.endedAt ||
                session.startedAt;

            if (!dateValue) {
                return false;
            }

            const date = new Date(dateValue);

            return (
                !Number.isNaN(date.getTime()) &&
                date >= start
            );
        })
        .sort(
            (a, b) =>
                new Date(
                    b.endedAt || b.startedAt
                ) -
                new Date(
                    a.endedAt || a.startedAt
                )
        );
}

function getSessionEmotionTotals(sessions) {
    const totals = {
        Calm: 0,
        Happy: 0,
        Neutral: 0,
        Anxious: 0,
        Stressed: 0,
        Sad: 0,
    };

    sessions.forEach((session) => {
        const emotions = session.emotions || {};

        const values = Object.entries(totals).map(
            ([name]) => Number(emotions[name]) || 0
        );

        const total = values.reduce(
            (sum, value) => sum + value,
            0
        );

        if (total > 0) {
            Object.keys(totals).forEach((name) => {
                totals[name] +=
                    Number(emotions[name]) || 0;
            });
            return;
        }

        if (
            session.dominantEmotion &&
            Object.prototype.hasOwnProperty.call(
                totals,
                session.dominantEmotion
            )
        ) {
            totals[session.dominantEmotion] += 1;
        }
    });

    const total = Object.values(totals).reduce(
        (sum, value) => sum + value,
        0
    );

    if (!total) {
        return Object.fromEntries(
            Object.keys(totals).map((name) => [
                name,
                0,
            ])
        );
    }

    return Object.fromEntries(
        Object.entries(totals).map(
            ([name, value]) => [
                name,
                Math.round((value / total) * 100),
            ]
        )
    );
}

function createEmotionData(sessions) {
    const totals =
        getSessionEmotionTotals(sessions);

    const emotionMeta = {
        Calm: {
            type: "teal",
            emoji: "😌",
        },
        Happy: {
            type: "purple",
            emoji: "😊",
        },
        Neutral: {
            type: "blue",
            emoji: "😐",
        },
        Anxious: {
            type: "coral",
            emoji: "😟",
        },
        Stressed: {
            type: "red",
            emoji: "😣",
        },
        Sad: {
            type: "blue",
            emoji: "😔",
        },
    };

    return Object.entries(totals)
        .filter(([name]) => name !== "Sad" || totals[name] > 0)
        .map(([name, value]) => ({
            name,
            value,
            ...emotionMeta[name],
        }));
}

function getAverage(sessions, key) {
    if (!sessions.length) {
        return 0;
    }

    const values = sessions
        .map((session) => Number(session[key]))
        .filter((value) => Number.isFinite(value));

    if (!values.length) {
        return 0;
    }

    return Math.round(
        values.reduce(
            (sum, value) => sum + value,
            0
        ) / values.length
    );
}

function createWeeklyData(sessions, period) {
    if (!sessions.length) {
        if (period === "This week") {
            return [
                { label: "Mon", score: 0 },
                { label: "Tue", score: 0 },
                { label: "Wed", score: 0 },
                { label: "Thu", score: 0 },
                { label: "Fri", score: 0 },
                { label: "Sat", score: 0 },
                { label: "Sun", score: 0 },
            ];
        }

        if (period === "This month") {
            return [
                { label: "Week 1", score: 0 },
                { label: "Week 2", score: 0 },
                { label: "Week 3", score: 0 },
                { label: "Week 4", score: 0 },
            ];
        }

        return [
            { label: "May", score: 0 },
            { label: "Jun", score: 0 },
            { label: "Jul", score: 0 },
            { label: "Aug", score: 0 },
        ];
    }

    const now = new Date();

    if (period === "This week") {
        const days = Array.from(
            { length: 7 },
            (_, index) => {
                const date = new Date(now);
                date.setHours(0, 0, 0, 0);
                date.setDate(
                    now.getDate() - (6 - index)
                );
                return date;
            }
        );

        return days.map((date) => {
            const daySessions =
                sessions.filter((session) => {
                    const sessionDate = new Date(
                        session.endedAt ||
                        session.startedAt
                    );

                    return (
                        sessionDate.getFullYear() ===
                        date.getFullYear() &&
                        sessionDate.getMonth() ===
                        date.getMonth() &&
                        sessionDate.getDate() ===
                        date.getDate()
                    );
                });

            return {
                label: date.toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                ),
                score:
                    getAverage(
                        daySessions,
                        "wellbeingScore"
                    ) || 0,
            };
        });
    }

    if (period === "This month") {
        return Array.from(
            { length: 4 },
            (_, index) => {
                const end =
                    index === 3
                        ? 31
                        : (index + 1) * 7;

                const start =
                    index * 7 + 1;

                const weekSessions =
                    sessions.filter((session) => {
                        const date = new Date(
                            session.endedAt ||
                            session.startedAt
                        );

                        const day = date.getDate();

                        return (
                            day >= start &&
                            day <= end
                        );
                    });

                return {
                    label: `Week ${index + 1}`,
                    score:
                        getAverage(
                            weekSessions,
                            "wellbeingScore"
                        ) || 0,
                };
            }
        );
    }

    const months = [];

    for (let index = 3; index >= 0; index -= 1) {
        const date = new Date(now);
        date.setMonth(
            now.getMonth() - index
        );

        const monthSessions =
            sessions.filter((session) => {
                const sessionDate = new Date(
                    session.endedAt ||
                    session.startedAt
                );

                return (
                    sessionDate.getFullYear() ===
                    date.getFullYear() &&
                    sessionDate.getMonth() ===
                    date.getMonth()
                );
            });

        months.push({
            label: date.toLocaleDateString(
                "en-US",
                { month: "short" }
            ),
            score:
                getAverage(
                    monthSessions,
                    "wellbeingScore"
                ) || 0,
        });
    }

    return months;
}

function buildConnectedReportData(
    sessions,
    period
) {
    if (!sessions.length) {
        return {
            summary: {
                wellbeing: 0,
                sessions: 0,
                confidence: 0,
                duration: 0,
            },

            weekly: createWeeklyData(
                [],
                period
            ),

            emotions: [],

            balance: {
                positive: 0,
                neutral: 0,
                negative: 0,
            },

            monthly: [
                { label: "May", score: 0 },
                { label: "Jun", score: 0 },
                { label: "Jul", score: 0 },
                { label: "Aug", score: 0 },
            ],

            trend: 0,

            insight:
                "Complete a monitoring session to start building your emotional well-being report.",
        };
    }

    const wellbeing =
        getAverage(
            sessions,
            "wellbeingScore"
        );

    const confidence =
        getAverage(
            sessions,
            "confidence"
        );

    const duration =
        getAverage(
            sessions,
            "duration"
        );

    const emotions =
        createEmotionData(sessions);

    const calm =
        emotions.find(
            (emotion) =>
                emotion.name === "Calm"
        )?.value || 0;

    const stress =
        (emotions.find(
            (emotion) =>
                emotion.name === "Stressed"
        )?.value || 0) +
        (emotions.find(
            (emotion) =>
                emotion.name === "Anxious"
        )?.value || 0);

    const weekly =
        createWeeklyData(
            sessions,
            period
        );

    const validScores = weekly
        .map((item) => item.score)
        .filter((score) => score > 0);

    const average =
        validScores.length
            ? Math.round(
                validScores.reduce(
                    (sum, score) =>
                        sum + score,
                    0
                ) /
                validScores.length
            )
            : wellbeing;

    const firstScore =
        validScores[0] || wellbeing;

    const trend =
        firstScore > 0
            ? Number(
                (
                    ((wellbeing -
                        firstScore) /
                        firstScore) *
                    100
                ).toFixed(1)
            )
            : 0;

    return {
        summary: {
            wellbeing,
            sessions: sessions.length,
            confidence,
            duration,
        },

        weekly,

        emotions,

        balance: {
            calm,
            stress,
        },

        monthly: weekly,

        trend,

        insight:
            trend >= 0
                ? "Your recent monitoring sessions show a positive emotional pattern. Continue using regular check-ins to understand how your well-being changes over time."
                : "Your recent sessions show some changes in emotional balance. Regular check-ins can help you understand these patterns over time.",
    };
}

function Reports() {
    const [period, setPeriod] = useState("This week");
    const [showExportToast, setShowExportToast] =
        useState(false);

    const monitoringSessions =
        useMemo(
            () => getCompletedSessions(period),
            [period]
        );

    const currentData = useMemo(
        () =>
            buildConnectedReportData(
                monitoringSessions,
                period
            ),
        [monitoringSessions, period]
    );

    const averageScore = useMemo(() => {
        const total = currentData.weekly.reduce(
            (sum, item) => sum + item.score,
            0
        );

        return Math.round(
            total / currentData.weekly.length
        );
    }, [currentData]);

    const chartPoints = useMemo(() => {
        const data = currentData.weekly;

        if (data.length === 1) {
            return "50,50";
        }

        return data
            .map((item, index) => {
                const x =
                    (index / (data.length - 1)) * 100;

                const y = 100 - item.score;

                return `${x},${y}`;
            })
            .join(" ");
    }, [currentData]);

    const areaPoints = useMemo(() => {
        const data = currentData.weekly;

        if (data.length === 1) {
            return "0,100 50,50 100,100";
        }

        const points = data
            .map((item, index) => {
                const x =
                    (index / (data.length - 1)) * 100;

                const y = 100 - item.score;

                return `${x},${y}`;
            })
            .join(" ");

        return `0,100 ${points} 100,100`;
    }, [currentData]);

    const buildReportPayload = () => {
        return {
            application: "MindPulse AI",
            reportType:
                "Emotion Recognition & Well-being Monitoring",
            period,
            exportedAt: new Date().toISOString(),
            summary: currentData.summary,
            weekly: currentData.weekly,
            emotions: currentData.emotions,
            emotionalBalance: currentData.balance,
            monthly: currentData.monthly,
            trend: currentData.trend,
            insight: currentData.insight,
            sessions: monitoringSessions.map(
                (session) => ({
                    id: session.id,
                    startedAt: session.startedAt,
                    endedAt: session.endedAt,
                    duration: session.duration,
                    dominantEmotion:
                        session.dominantEmotion,
                    wellbeingScore:
                        session.wellbeingScore,
                    confidence:
                        session.confidence,
                    status: session.status,
                })
            ),
        };
    };

    const downloadBlob = (
        content,
        filename,
        type
    ) => {
        const blob = new Blob(
            [content],
            { type }
        );

        const url =
            URL.createObjectURL(blob);

        const anchor =
            document.createElement("a");

        anchor.href = url;
        anchor.download = filename;

        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();

        URL.revokeObjectURL(url);
    };

    const escapeCsvValue = (value) => {
        const textValue =
            value === null ||
                value === undefined
                ? ""
                : String(value);

        return `"${textValue.replace(
            /"/g,
            '""'
        )}"`;
    };

    const handleExportJson = () => {
        const exportDate = new Date()
            .toISOString()
            .slice(0, 10);

        const safePeriod = period.replace(
            /\s+/g,
            "_"
        );

        const json = JSON.stringify(
            buildReportPayload(),
            null,
            2
        );

        downloadBlob(
            json,
            `MindPulse_Report_${safePeriod}_${exportDate}.json`,
            "application/json;charset=utf-8"
        );

        setShowExportToast(true);

        setTimeout(() => {
            setShowExportToast(false);
        }, 2500);
    };

    const handleExportCsv = () => {
        const exportDate = new Date()
            .toISOString()
            .slice(0, 10);

        const safePeriod = period.replace(
            /\s+/g,
            "_"
        );

        const headers = [
            "Session ID",
            "Started At",
            "Ended At",
            "Duration (minutes)",
            "Dominant Emotion",
            "Well-being Score",
            "AI Confidence",
            "Status",
        ];

        const rows =
            monitoringSessions.map(
                (session) => [
                    session.id,
                    session.startedAt,
                    session.endedAt || "",
                    session.duration,
                    session.dominantEmotion ||
                    "",
                    session.wellbeingScore,
                    session.confidence,
                    session.status,
                ]
            );

        const csv = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map(escapeCsvValue)
                    .join(",")
            )
            .join("\r\n");

        downloadBlob(
            csv,
            `MindPulse_Sessions_${safePeriod}_${exportDate}.csv`,
            "text/csv;charset=utf-8"
        );

        setShowExportToast(true);

        setTimeout(() => {
            setShowExportToast(false);
        }, 2500);
    };

    return (
        <main className="reports-page">
            {/* =====================================================
          SIDEBAR
      ===================================================== */}

            <aside className="reports-sidebar">
                <a href="/" className="reports-brand">
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
                        <TrendingUp size={17} />
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
                            Your emotional insights remain private
                            and under your control.
                        </span>
                    </div>
                </div>
            </aside>

            {/* =====================================================
          MAIN
      ===================================================== */}

            <section className="reports-main">
                {/* HEADER */}

                <header className="reports-header">
                    <div>
                        <span className="reports-header__eyebrow">
                            ANALYTICS
                        </span>

                        <h1>Reports & Analytics</h1>

                        <p>
                            Understand your emotional patterns and
                            well-being trends.
                        </p>
                    </div>

                    <div className="reports-header__actions">
                        <div className="reports-period">
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
                        </div>

                        <div className="reports-export-group">
                            <button
                                type="button"
                                className="reports-export"
                                onClick={handleExportJson}
                            >
                                <Download size={13} />
                                JSON
                            </button>

                            <button
                                type="button"
                                className="reports-export reports-export--secondary"
                                onClick={handleExportCsv}
                            >
                                <Download size={13} />
                                CSV
                            </button>
                        </div>
                    </div>
                </header>

                {/* EXPORT TOAST */}

                {showExportToast && (
                    <div className="reports-export-toast">
                        <ShieldCheck size={14} />
                        Report export prepared successfully.
                    </div>
                )}

                {/* =================================================
            SUMMARY
        ================================================= */}

                <section className="reports-summary-grid">
                    <Card
                        className="reports-summary-card reports-summary-card--teal"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>WELL-BEING SCORE</span>

                            <div>
                                <HeartPulse size={15} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>{averageScore}</strong>
                            <span>/ 100</span>
                        </div>

                        <div className="reports-summary-card__trend reports-summary-card__trend--positive">
                            <ArrowUpRight size={12} />
                            <strong>+{currentData.trend}%</strong>
                            <span>vs previous period</span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>SESSIONS</span>

                            <div>
                                <Activity size={15} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>
                                {currentData.summary.sessions}
                            </strong>
                        </div>

                        <div className="reports-summary-card__trend">
                            <TrendingUp size={12} />
                            <span>
                                completed monitoring sessions
                            </span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>AI CONFIDENCE</span>

                            <div>
                                <Brain size={15} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>
                                {currentData.summary.confidence}
                            </strong>
                            <span>%</span>
                        </div>

                        <div className="reports-summary-card__trend reports-summary-card__trend--positive">
                            <ArrowUpRight size={12} />
                            <strong>High</strong>
                            <span>model confidence</span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>AVG. SESSION</span>

                            <div>
                                <Clock3 size={15} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>
                                {currentData.summary.duration}
                            </strong>
                            <span>min</span>
                        </div>

                        <div className="reports-summary-card__trend">
                            <span>average monitoring duration</span>
                        </div>
                    </Card>
                </section>

                {/* =================================================
            CHARTS
        ================================================= */}

                <section className="reports-chart-grid">
                    <Card padding="medium">
                        <div className="reports-card-header">
                            <div>
                                <span>EMOTIONAL TREND</span>

                                <h2>Well-being over time</h2>

                                <p>
                                    Your emotional well-being score for{" "}
                                    {period.toLowerCase()}.
                                </p>
                            </div>

                            <div className="reports-trend-badge">
                                <ArrowUpRight size={12} />
                                +{currentData.trend}%
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
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient
                                            id="reportsAreaGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#14B8A6"
                                                stopOpacity="0.22"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#14B8A6"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <polygon
                                        points={areaPoints}
                                        fill="url(#reportsAreaGradient)"
                                    />

                                    <polyline
                                        points={chartPoints}
                                        fill="none"
                                        stroke="#14B8A6"
                                        strokeWidth="2"
                                        vectorEffect="non-scaling-stroke"
                                    />

                                    {currentData.weekly.map(
                                        (item, index) => {
                                            const x =
                                                currentData.weekly.length ===
                                                    1
                                                    ? 50
                                                    : (index /
                                                        (currentData.weekly.length -
                                                            1)) *
                                                    100;

                                            const y = 100 - item.score;

                                            return (
                                                <circle
                                                    key={`${item.label}-${index}`}
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

                                <div className="reports-chart-labels">
                                    {currentData.weekly.map((item) => (
                                        <span key={item.label}>
                                            {item.label}
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
                                <strong>
                                    {Math.max(
                                        ...currentData.weekly.map(
                                            (item) => item.score
                                        )
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>Lowest</span>
                                <strong>
                                    {Math.min(
                                        ...currentData.weekly.map(
                                            (item) => item.score
                                        )
                                    )}
                                </strong>
                            </div>
                        </div>
                    </Card>

                    {/* DONUT */}

                    <Card padding="medium">
                        <div className="reports-card-header">
                            <div>
                                <span>EMOTION DISTRIBUTION</span>

                                <h2>How you've been feeling</h2>

                                <p>
                                    Distribution of detected emotional
                                    states.
                                </p>
                            </div>
                        </div>

                        <div className="reports-donut">
                            <div
                                className="reports-donut__ring"
                                style={{
                                    background: createDonutGradient(
                                        currentData.emotions
                                    ),
                                }}
                            >
                                <div className="reports-donut__center">
                                    <strong>
                                        {currentData.summary.sessions}
                                    </strong>

                                    <span>sessions</span>
                                </div>
                            </div>
                        </div>

                        <div className="reports-emotion-list">
                            {currentData.emotions.map((emotion) => (
                                <div
                                    className="reports-emotion-item"
                                    key={emotion.name}
                                >
                                    <div className="reports-emotion-item__name">
                                        <span
                                            className={`reports-emotion-dot reports-emotion-dot--${emotion.type}`}
                                        />

                                        <span>{emotion.name}</span>

                                        <strong>
                                            {emotion.emoji}
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

                                        <strong>{emotion.value}%</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                {/* =================================================
            SECONDARY
        ================================================= */}

                <section className="reports-secondary-grid">
                    <Card padding="medium">
                        <div className="reports-card-header">
                            <div>
                                <span>EMOTIONAL BALANCE</span>

                                <h2>Calm vs. stress</h2>

                                <p>
                                    Compare your positive and stressful
                                    emotional signals.
                                </p>
                            </div>
                        </div>

                        <div className="reports-balance-bars">
                            <div className="reports-balance-row">
                                <div>
                                    <span>
                                        <i className="reports-balance-dot reports-balance-dot--calm" />
                                        Calm
                                    </span>

                                    <strong>
                                        {currentData.balance.calm}%
                                    </strong>
                                </div>

                                <div className="reports-balance-track">
                                    <span
                                        className="reports-balance-fill reports-balance-fill--calm"
                                        style={{
                                            width: `${currentData.balance.calm}%`,
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

                                    <strong>
                                        {currentData.balance.stress}%
                                    </strong>
                                </div>

                                <div className="reports-balance-track">
                                    <span
                                        className="reports-balance-fill reports-balance-fill--stress"
                                        style={{
                                            width: `${currentData.balance.stress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="reports-balance-result">
                            <div>
                                <HeartPulse size={15} />
                            </div>

                            <span>
                                Your calm signals are currently{" "}
                                <strong>
                                    {Math.max(
                                        currentData.balance.calm -
                                        currentData.balance.stress,
                                        0
                                    )}
                                    % higher
                                </strong>{" "}
                                than your stress signals.
                            </span>
                        </div>
                    </Card>

                    <Card padding="medium">
                        <div className="reports-card-header">
                            <div>
                                <span>LONG-TERM TREND</span>

                                <h2>Well-being trajectory</h2>

                                <p>
                                    Progress across the selected period.
                                </p>
                            </div>
                        </div>

                        <div className="reports-monthly-chart">
                            {currentData.monthly.map((item) => (
                                <div
                                    className="reports-month-column"
                                    key={item.label}
                                >
                                    <span className="reports-month-value">
                                        {item.score}
                                    </span>

                                    <div className="reports-month-track">
                                        <span
                                            style={{
                                                height: `${item.score}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="reports-month-label">
                                        {item.label}
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
                        <span>AI WELL-BEING INSIGHT</span>

                        <h2>{currentData.insight}</h2>

                        <p>
                            MindPulse analyzes emotional patterns
                            across your monitoring sessions to help
                            you understand changes in your overall
                            well-being.
                        </p>

                        <div className="reports-ai-tags">
                            <span>
                                <TrendingUp size={11} />
                                Positive trend
                            </span>

                            <span>
                                <HeartPulse size={11} />
                                Balanced signals
                            </span>

                            <span>
                                <Brain size={11} />
                                AI analyzed
                            </span>
                        </div>
                    </div>
                </Card>

                {/* DISCLAIMER */}

                <div className="reports-disclaimer">
                    <Info size={13} />

                    <span>
                        MindPulse AI provides emotional pattern
                        insights for self-awareness and is not a
                        medical diagnostic system. These insights
                        should not replace professional medical
                        advice.
                    </span>
                </div>

                {/* FOOTER */}

                <footer className="reports-footer">
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

function createDonutGradient(emotions) {
    const colors = {
        teal: "#14B8A6",
        purple: "#C084FC",
        blue: "#60A5FA",
        coral: "#FB7185",
        red: "#F43F5E",
    };

    let currentDegree = 0;

    const segments = emotions.map((emotion) => {
        const start = currentDegree;

        currentDegree +=
            (emotion.value / 100) * 360;

        return `${colors[emotion.type]} ${start}deg ${currentDegree}deg`;
    });

    return `conic-gradient(${segments.join(", ")})`;
}

export default Reports;