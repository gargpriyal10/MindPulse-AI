import { useEffect, useMemo, useState } from "react";
import {
    Activity,
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
import { getEmotionReport } from "../../services/api";
import "./Reports.css";

const PERIODS = [
    "This week",
    "This month",
    "Last 3 months",
];

const EMOTION_META = {
    anger: {
        type: "red",
        emoji: "😠",
    },
    neutral: {
        type: "blue",
        emoji: "😐",
    },
    happiness: {
        type: "purple",
        emoji: "😊",
    },
    happy: {
        type: "purple",
        emoji: "😊",
    },
    sadness: {
        type: "coral",
        emoji: "😔",
    },
    sad: {
        type: "coral",
        emoji: "😔",
    },
    fear: {
        type: "coral",
        emoji: "😟",
    },
    surprise: {
        type: "teal",
        emoji: "😮",
    },
    disgust: {
        type: "red",
        emoji: "😣",
    },
    calm: {
        type: "teal",
        emoji: "😌",
    },
    anxious: {
        type: "coral",
        emoji: "😟",
    },
    stressed: {
        type: "red",
        emoji: "😣",
    },
};

function formatEmotionName(emotion) {
    if (!emotion) {
        return "Unknown";
    }

    return emotion.charAt(0).toUpperCase() + emotion.slice(1);
}

function getEmotionMeta(emotion) {
    return (
        EMOTION_META[emotion?.toLowerCase()] || {
            type: "blue",
            emoji: "🙂",
        }
    );
}

function createDonutGradient(emotions) {
    if (!emotions.length) {
        return "conic-gradient(#E2E8F0 0deg 360deg)";
    }

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
            (Number(emotion.value) / 100) * 360;

        return `${colors[emotion.type] || colors.blue} ${start}deg ${currentDegree}deg`;
    });

    return `conic-gradient(${segments.join(", ")})`;
}

function getAverageConfidence(report) {
    const confidence =
        Number(report?.report?.average_confidence) || 0;

    return (confidence * 100).toFixed(1);
}

function buildEmotionData(report) {
    const percentages =
        report?.report?.emotion_percentages || {};

    return Object.entries(percentages)
        .map(([name, value]) => {
            const meta = getEmotionMeta(name);

            return {
                name: formatEmotionName(name),
                value: Number(value) || 0,
                type: meta.type,
                emoji: meta.emoji,
            };
        })
        .sort((a, b) => b.value - a.value);
}

function buildChartData(report) {
    const percentages =
        report?.report?.emotion_percentages || {};

    const entries = Object.entries(percentages);

    if (!entries.length) {
        return [
            { label: "No data", score: 0 },
        ];
    }

    return entries.map(([name, value]) => ({
        label: formatEmotionName(name),
        score: Number(value) || 0,
    }));
}

function Reports() {
    const [period, setPeriod] =
        useState("This week");

    const [report, setReport] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [showExportToast, setShowExportToast] =
        useState(false);

    // ============================================================
    // FETCH REAL BACKEND REPORT
    // ============================================================

    useEffect(() => {
        let isMounted = true;

        const fetchReport = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getEmotionReport(
                        period === "This week"
                            ? "week"
                            : period === "This month"
                                ? "month"
                                : "3months"
                    );

                console.log(
                    "Reports API response:",
                    response.data
                );

                if (!isMounted) {
                    return;
                }

                setReport(response.data);
            } catch (err) {
                console.error(
                    "Failed to fetch report:",
                    err
                );

                if (!isMounted) {
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Unable to load your report."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchReport();

        return () => {
            isMounted = false;
        };
    }, [period]);

    // ============================================================
    // BACKEND DATA
    // ============================================================

    const backendReport =
        report?.report || {};

    const totalRecords =
        Number(report?.total_records) || 0;

    const averageConfidence =
        getAverageConfidence(report);

    const dominantEmotion =
        backendReport.dominant_emotion ||
        "No data";

    const latestEmotion =
        backendReport.latest_emotion ||
        "No data";

    const firstSession =
        backendReport.first_session ||
        "No data";

    const latestSession =
        backendReport.latest_session ||
        "No data";

    const emotionData = useMemo(
        () => buildEmotionData(report),
        [report]
    );

    const chartData = useMemo(
        () => buildChartData(report),
        [report]
    );

    const highestEmotion =
        emotionData.length
            ? emotionData[0]
            : null;

    // ============================================================
    // REPORT VALUES
    // ============================================================

    /*
     * Current backend does not provide a separate
     * well-being score.
     *
     * Therefore we use average AI confidence as the
     * available overall score instead of inventing
     * a diagnostic/well-being value.
     */

    const overallScore =
        Number(backendReport.average_confidence)
            ? Math.round(
                Number(
                    backendReport.average_confidence
                ) * 100
            )
            : 0;

    const dominantPercentage =
        emotionData.length
            ? emotionData[0].value
            : 0;

    const secondEmotion =
        emotionData.length > 1
            ? emotionData[1]
            : null;

    // ============================================================
    // EXPORT HELPERS
    // ============================================================

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
        if (!report) {
            return;
        }

        const exportDate =
            new Date()
                .toISOString()
                .slice(0, 10);

        const safePeriod =
            period.replace(
                /\s+/g,
                "_"
            );

        const exportData = {
            application: "MindPulse AI",

            reportType:
                "Emotion Recognition & Well-being Monitoring",

            period,

            exportedAt:
                new Date().toISOString(),

            generatedAt:
                report.generated_at,

            totalRecords:
                report.total_records,

            report:
                report.report,
        };

        const json =
            JSON.stringify(
                exportData,
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
        if (!report) {
            return;
        }

        const exportDate =
            new Date()
                .toISOString()
                .slice(0, 10);

        const safePeriod =
            period.replace(
                /\s+/g,
                "_"
            );

        const emotionCounts =
            backendReport.emotion_counts ||
            {};

        const emotionPercentages =
            backendReport.emotion_percentages ||
            {};

        const headers = [
            "Emotion",
            "Count",
            "Percentage",
        ];

        const rows =
            Object.keys(
                emotionPercentages
            ).map((emotion) => [
                formatEmotionName(
                    emotion
                ),
                emotionCounts[emotion] || 0,
                emotionPercentages[
                emotion
                ] || 0,
            ]);

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
            `MindPulse_Emotion_Report_${safePeriod}_${exportDate}.csv`,
            "text/csv;charset=utf-8"
        );

        setShowExportToast(true);

        setTimeout(() => {
            setShowExportToast(false);
        }, 2500);
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <main className="reports-page">
                <section
                    className="reports-main"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                >
                    <div>
                        <h2>
                            Loading report...
                        </h2>

                        <p>
                            Fetching your latest
                            emotion insights.
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <main className="reports-page">
                <section
                    className="reports-main"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                >
                    <Card padding="medium">
                        <div>
                            <h2>
                                Unable to load report
                            </h2>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Retry
                            </button>
                        </div>
                    </Card>
                </section>
            </main>
        );
    }

    // ============================================================
    // NO DATA
    // ============================================================

    if (
        !report ||
        !report.success ||
        totalRecords === 0
    ) {
        return (
            <main className="reports-page">
                <aside className="reports-sidebar">
                    <a
                        href="/"
                        className="reports-brand"
                    >
                        <span className="reports-brand__icon">
                            <Brain size={20} />
                        </span>

                        <span>
                            MindPulse{" "}
                            <strong>AI</strong>
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
                                Your emotional insights
                                remain private and under
                                your control.
                            </span>
                        </div>
                    </div>
                </aside>

                <section className="reports-main">
                    <header className="reports-header">
                        <div>
                            <span className="reports-header__eyebrow">
                                ANALYTICS
                            </span>

                            <h1>
                                Reports & Analytics
                            </h1>

                            <p>
                                Understand your
                                emotional patterns
                                and well-being trends.
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
                                    {PERIODS.map((item) => (
                                        <option key={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown size={13} />
                            </div>
                        </div>
                    </header>

                    <Card padding="medium">
                        <div>
                            <h2>
                                No report data available
                            </h2>

                            <p>
                                Complete a monitoring
                                session to start
                                building your emotion
                                report.
                            </p>

                            <a href="/monitoring">
                                Go to Monitoring
                            </a>
                        </div>
                    </Card>
                </section>
            </main>
        );
    }

    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <main className="reports-page">
            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="reports-sidebar">
                <a
                    href="/"
                    className="reports-brand"
                >
                    <span className="reports-brand__icon">
                        <Brain size={20} />
                    </span>

                    <span>
                        MindPulse{" "}
                        <strong>AI</strong>
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
                            Your emotional insights
                            remain private and under
                            your control.
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

                        <h1>
                            Reports & Analytics
                        </h1>

                        <p>
                            Understand your emotional
                            patterns and well-being
                            trends.
                        </p>
                    </div>

                    <div className="reports-header__actions">
                        <div className="reports-period">
                            <CalendarDays size={14} />

                            <select
                                value={period}
                                onChange={(event) =>
                                    setPeriod(
                                        event.target.value
                                    )
                                }
                            >
                                {PERIODS.map(
                                    (item) => (
                                        <option
                                            key={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>

                            <ChevronDown
                                size={13}
                            />
                        </div>

                        <div className="reports-export-group">
                            <button
                                type="button"
                                className="reports-export"
                                onClick={
                                    handleExportJson
                                }
                            >
                                <Download size={13} />
                                JSON
                            </button>

                            <button
                                type="button"
                                className="reports-export reports-export--secondary"
                                onClick={
                                    handleExportCsv
                                }
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

                        Report export prepared
                        successfully.
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
                            <span>
                                AI CONFIDENCE
                            </span>

                            <div>
                                <Brain size={15} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>
                                {averageConfidence}
                            </strong>

                            <span>%</span>
                        </div>

                        <div className="reports-summary-card__trend reports-summary-card__trend--positive">
                            <ArrowUpRight
                                size={12}
                            />

                            <strong>
                                AI analyzed
                            </strong>

                            <span>
                                emotion records
                            </span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>
                                TOTAL RECORDS
                            </span>

                            <div>
                                <Activity size={15} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>
                                {totalRecords}
                            </strong>
                        </div>

                        <div className="reports-summary-card__trend">
                            <TrendingUp size={12} />

                            <span>
                                emotion records
                                analyzed
                            </span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>
                                DOMINANT EMOTION
                            </span>

                            <div>
                                <HeartPulse size={15} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>
                                {formatEmotionName(
                                    dominantEmotion
                                )}
                            </strong>
                        </div>

                        <div className="reports-summary-card__trend reports-summary-card__trend--positive">
                            <span>
                                {dominantPercentage}%
                                of detected
                                emotions
                            </span>
                        </div>
                    </Card>

                    <Card
                        className="reports-summary-card"
                        padding="medium"
                    >
                        <div className="reports-summary-card__top">
                            <span>
                                LATEST EMOTION
                            </span>

                            <div>
                                <Clock3 size={15} />
                            </div>
                        </div>

                        <div className="reports-summary-card__value">
                            <strong>
                                {formatEmotionName(
                                    latestEmotion
                                )}
                            </strong>
                        </div>

                        <div className="reports-summary-card__trend">
                            <span>
                                Latest recorded
                                emotion
                            </span>
                        </div>
                    </Card>
                </section>

                {/* =================================================
                    CHARTS
                ================================================= */}

                <section className="reports-chart-grid">
                    {/* EMOTION OVERVIEW */}

                    <Card padding="medium">
                        <div className="reports-card-header">
                            <div>
                                <span>
                                    EMOTION OVERVIEW
                                </span>

                                <h2>
                                    Detected emotions
                                </h2>

                                <p>
                                    Emotional states
                                    detected across
                                    your recorded
                                    sessions.
                                </p>
                            </div>

                            <div className="reports-trend-badge">
                                <Activity
                                    size={12}
                                />

                                {totalRecords} records
                            </div>
                        </div>

                        <div className="reports-line-chart">
                            <div className="reports-chart-y-axis">
                                <span>
                                    100
                                </span>

                                <span>
                                    80
                                </span>

                                <span>
                                    60
                                </span>

                                <span>
                                    40
                                </span>

                                <span>
                                    20
                                </span>

                                <span>
                                    0
                                </span>
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
                                    {chartData.map(
                                        (
                                            item,
                                            index
                                        ) => {
                                            const width =
                                                chartData.length >
                                                    1
                                                    ? 100 /
                                                    (chartData.length -
                                                        1)
                                                    : 50;

                                            const x =
                                                chartData.length >
                                                    1
                                                    ? index *
                                                    width
                                                    : 50;

                                            const y =
                                                100 -
                                                item.score;

                                            return (
                                                <circle
                                                    key={`${item.label}-${index}`}
                                                    cx={x}
                                                    cy={y}
                                                    r="2"
                                                    fill="#0F172A"
                                                    stroke="#14B8A6"
                                                    strokeWidth="1"
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                            );
                                        }
                                    )}

                                    {chartData.length >
                                        1 && (
                                            <polyline
                                                points={chartData
                                                    .map(
                                                        (
                                                            item,
                                                            index
                                                        ) => {
                                                            const x =
                                                                (index /
                                                                    (chartData.length -
                                                                        1)) *
                                                                100;

                                                            const y =
                                                                100 -
                                                                item.score;

                                                            return `${x},${y}`;
                                                        }
                                                    )
                                                    .join(
                                                        " "
                                                    )}
                                                fill="none"
                                                stroke="#14B8A6"
                                                strokeWidth="2"
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        )}
                                </svg>

                                <div className="reports-chart-labels">
                                    {chartData.map(
                                        (item) => (
                                            <span
                                                key={
                                                    item.label
                                                }
                                            >
                                                {
                                                    item.label
                                                }
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="reports-chart-footer">
                            <div>
                                <span>
                                    Average AI
                                    confidence
                                </span>

                                <strong>
                                    {
                                        averageConfidence
                                    }
                                    %
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Highest emotion
                                </span>

                                <strong>
                                    {highestEmotion
                                        ? `${highestEmotion.name} ${highestEmotion.value}%`
                                        : "—"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Second highest
                                </span>

                                <strong>
                                    {secondEmotion
                                        ? `${secondEmotion.name} ${secondEmotion.value}%`
                                        : "—"}
                                </strong>
                            </div>
                        </div>
                    </Card>

                    {/* DONUT */}

                    <Card padding="medium">
                        <div className="reports-card-header">
                            <div>
                                <span>
                                    EMOTION
                                    DISTRIBUTION
                                </span>

                                <h2>
                                    How you've been
                                    feeling
                                </h2>

                                <p>
                                    Distribution of
                                    detected
                                    emotional
                                    states.
                                </p>
                            </div>
                        </div>

                        <div className="reports-donut">
                            <div
                                className="reports-donut__ring"
                                style={{
                                    background:
                                        createDonutGradient(
                                            emotionData
                                        ),
                                }}
                            >
                                <div className="reports-donut__center">
                                    <strong>
                                        {
                                            totalRecords
                                        }
                                    </strong>

                                    <span>
                                        records
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="reports-emotion-list">
                            {emotionData.map(
                                (emotion) => (
                                    <div
                                        className="reports-emotion-item"
                                        key={
                                            emotion.name
                                        }
                                    >
                                        <div className="reports-emotion-item__name">
                                            <span
                                                className={`reports-emotion-dot reports-emotion-dot--${emotion.type}`}
                                            />

                                            <span>
                                                {
                                                    emotion.name
                                                }
                                            </span>

                                            <strong>
                                                {
                                                    emotion.emoji
                                                }
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
                                                {
                                                    emotion.value
                                                }
                                                %
                                            </strong>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </Card>
                </section>

                {/* =================================================
                    SECONDARY
                ================================================= */}

                <section className="reports-secondary-grid">
                    {/* EMOTIONAL BALANCE */}

                    <Card padding="medium">
                        <div className="reports-card-header">
                            <div>
                                <span>
                                    EMOTIONAL
                                    BALANCE
                                </span>

                                <h2>
                                    Emotion signals
                                </h2>

                                <p>
                                    Compare the
                                    strongest detected
                                    emotional signals.
                                </p>
                            </div>
                        </div>

                        <div className="reports-balance-bars">
                            {emotionData
                                .slice(0, 2)
                                .map((emotion) => (
                                    <div
                                        className="reports-balance-row"
                                        key={
                                            emotion.name
                                        }
                                    >
                                        <div>
                                            <span>
                                                <i
                                                    className={`reports-balance-dot reports-balance-dot--${emotion.type}`}
                                                />

                                                {
                                                    emotion.name
                                                }
                                            </span>

                                            <strong>
                                                {
                                                    emotion.value
                                                }
                                                %
                                            </strong>
                                        </div>

                                        <div className="reports-balance-track">
                                            <span
                                                className={`reports-balance-fill reports-balance-fill--${emotion.type}`}
                                                style={{
                                                    width: `${emotion.value}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                        </div>

                        <div className="reports-balance-result">
                            <div>
                                <HeartPulse
                                    size={15}
                                />
                            </div>

                            <span>
                                <strong>
                                    {formatEmotionName(
                                        dominantEmotion
                                    )}
                                </strong>{" "}
                                is currently the
                                dominant detected
                                emotion at{" "}
                                <strong>
                                    {
                                        dominantPercentage
                                    }
                                    %
                                </strong>
                                .
                            </span>
                        </div>
                    </Card>

                    {/* REPORT DETAILS */}

                    <Card padding="medium">
                        <div className="reports-card-header">
                            <div>
                                <span>
                                    REPORT DETAILS
                                </span>

                                <h2>
                                    Monitoring
                                    timeline
                                </h2>

                                <p>
                                    Key dates from
                                    your recorded
                                    emotion history.
                                </p>
                            </div>
                        </div>

                        <div className="reports-monthly-chart">
                            <div className="reports-month-column">
                                <span className="reports-month-value">
                                    First
                                </span>

                                <div className="reports-month-track">
                                    <span
                                        style={{
                                            height: "55%",
                                        }}
                                    />
                                </div>

                                <span className="reports-month-label">
                                    Session
                                </span>
                            </div>

                            <div className="reports-month-column">
                                <span className="reports-month-value">
                                    Latest
                                </span>

                                <div className="reports-month-track">
                                    <span
                                        style={{
                                            height: "85%",
                                        }}
                                    />
                                </div>

                                <span className="reports-month-label">
                                    Session
                                </span>
                            </div>

                            <div className="reports-month-column">
                                <span className="reports-month-value">
                                    {totalRecords}
                                </span>

                                <div className="reports-month-track">
                                    <span
                                        style={{
                                            height: "70%",
                                        }}
                                    />
                                </div>

                                <span className="reports-month-label">
                                    Records
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                marginTop:
                                    "20px",
                                display:
                                    "grid",
                                gap: "10px",
                                fontSize:
                                    "13px",
                            }}
                        >
                            <div>
                                <strong>
                                    First session:
                                </strong>{" "}
                                {firstSession}
                            </div>

                            <div>
                                <strong>
                                    Latest session:
                                </strong>{" "}
                                {latestSession}
                            </div>
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
                        <span>
                            AI WELL-BEING INSIGHT
                        </span>

                        <h2>
                            Your most frequently
                            detected emotion is{" "}
                            {formatEmotionName(
                                dominantEmotion
                            )}
                            .
                        </h2>

                        <p>
                            MindPulse AI analyzes
                            emotional patterns from
                            your monitoring records
                            to help you understand
                            changes in your emotional
                            well-being over time.
                        </p>

                        <div className="reports-ai-tags">
                            <span>
                                <TrendingUp
                                    size={11}
                                />
                                Emotion analyzed
                            </span>

                            <span>
                                <HeartPulse
                                    size={11}
                                />
                                Pattern insight
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
                        MindPulse AI provides
                        emotional pattern insights
                        for self-awareness and is not
                        a medical diagnostic system.
                        These insights should not
                        replace professional medical
                        advice.
                    </span>
                </div>

                {/* FOOTER */}

                <footer className="reports-footer">
                    <span>
                        MindPulse AI • Emotion
                        Recognition & Well-being
                        Monitoring
                    </span>

                    <span>
                        Privacy-first •
                        Human-centric • 2026
                    </span>
                </footer>
            </section>
        </main>
    );
}

export default Reports;