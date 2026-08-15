import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  HeartPulse,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Card from "../../components/ui/Card";

import "./History.css";

const sessions = [
  {
    id: 1,
    date: "Aug 15, 2026",
    timestamp: "2026-08-15",
    time: "10:30 AM",
    duration: 18,
    emotion: "Calm",
    emoji: "😌",
    score: 82,
    confidence: 94,
    status: "Completed",
    note: "Stable and balanced emotional signals.",
  },
  {
    id: 2,
    date: "Aug 14, 2026",
    timestamp: "2026-08-14",
    time: "06:15 PM",
    duration: 24,
    emotion: "Happy",
    emoji: "😊",
    score: 89,
    confidence: 96,
    status: "Completed",
    note: "Strong positive engagement detected.",
  },
  {
    id: 3,
    date: "Aug 13, 2026",
    timestamp: "2026-08-13",
    time: "09:45 AM",
    duration: 15,
    emotion: "Neutral",
    emoji: "😐",
    score: 74,
    confidence: 90,
    status: "Completed",
    note: "Low emotional variation during session.",
  },
  {
    id: 4,
    date: "Aug 12, 2026",
    timestamp: "2026-08-12",
    time: "08:20 PM",
    duration: 21,
    emotion: "Happy",
    emoji: "😊",
    score: 86,
    confidence: 93,
    status: "Completed",
    note: "Positive emotional state remained consistent.",
  },
  {
    id: 5,
    date: "Aug 11, 2026",
    timestamp: "2026-08-11",
    time: "11:10 AM",
    duration: 12,
    emotion: "Anxious",
    emoji: "😟",
    score: 58,
    confidence: 87,
    status: "Completed",
    note: "Some elevated anxious signals detected.",
  },
  {
    id: 6,
    date: "Aug 10, 2026",
    timestamp: "2026-08-10",
    time: "05:40 PM",
    duration: 27,
    emotion: "Calm",
    emoji: "😌",
    score: 84,
    confidence: 95,
    status: "Completed",
    note: "Relaxed and steady emotional pattern.",
  },
  {
    id: 7,
    date: "Aug 9, 2026",
    timestamp: "2026-08-09",
    time: "09:05 AM",
    duration: 16,
    emotion: "Stressed",
    emoji: "😣",
    score: 61,
    confidence: 89,
    status: "Completed",
    note: "Short period of elevated stress activity.",
  },
  {
    id: 8,
    date: "Aug 8, 2026",
    timestamp: "2026-08-08",
    time: "07:30 PM",
    duration: 20,
    emotion: "Calm",
    emoji: "😌",
    score: 81,
    confidence: 92,
    status: "Completed",
    note: "Stable emotional state throughout session.",
  },
  {
    id: 9,
    date: "Aug 7, 2026",
    timestamp: "2026-08-07",
    time: "10:00 AM",
    duration: 14,
    emotion: "Sad",
    emoji: "😔",
    score: 64,
    confidence: 86,
    status: "Completed",
    note: "Lower positive engagement detected.",
  },
  {
    id: 10,
    date: "Aug 6, 2026",
    timestamp: "2026-08-06",
    time: "04:15 PM",
    duration: 22,
    emotion: "Happy",
    emoji: "😊",
    score: 87,
    confidence: 94,
    status: "Completed",
    note: "Strong positive emotional signals.",
  },
  {
    id: 11,
    date: "Aug 5, 2026",
    timestamp: "2026-08-05",
    time: "09:30 AM",
    duration: 17,
    emotion: "Neutral",
    emoji: "😐",
    score: 72,
    confidence: 91,
    status: "Completed",
    note: "Mostly neutral emotional activity.",
  },
  {
    id: 12,
    date: "Aug 4, 2026",
    timestamp: "2026-08-04",
    time: "06:50 PM",
    duration: 19,
    emotion: "Calm",
    emoji: "😌",
    score: 79,
    confidence: 93,
    status: "Completed",
    note: "Calm emotional state with low variation.",
  },
];

const ITEMS_PER_PAGE = 6;

function History() {
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] =
    useState("All emotions");
  const [dateFilter, setDateFilter] =
    useState("Newest first");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSession, setSelectedSession] =
    useState(null);

  const filteredSessions = useMemo(() => {
    let result = [...sessions];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (session) =>
          session.emotion
            .toLowerCase()
            .includes(query) ||
          session.note
            .toLowerCase()
            .includes(query) ||
          session.date
            .toLowerCase()
            .includes(query)
      );
    }

    if (emotionFilter !== "All emotions") {
      result = result.filter(
        (session) =>
          session.emotion === emotionFilter
      );
    }

    result.sort((a, b) => {
      if (dateFilter === "Newest first") {
        return (
          new Date(b.timestamp) -
          new Date(a.timestamp)
        );
      }

      return (
        new Date(a.timestamp) -
        new Date(b.timestamp)
      );
    });

    return result;
  }, [search, emotionFilter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSessions.length / ITEMS_PER_PAGE
    )
  );

  const visibleSessions = filteredSessions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleEmotionFilter = (value) => {
    setEmotionFilter(value);
    setCurrentPage(1);
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  return (
    <main className="history-page">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="history-sidebar">
        <a
          href="/dashboard"
          className="history-brand"
        >
          <span className="history-brand__icon">
            <HeartPulse size={20} />
          </span>

          <span>
            MindPulse <strong>AI</strong>
          </span>
        </a>

        <nav className="history-nav">
          <span className="history-nav__label">
            WORKSPACE
          </span>

          <a
            href="/dashboard"
            className="history-nav__item"
          >
            <Activity size={17} />
            Overview
          </a>

          <a
            href="/monitoring"
            className="history-nav__item"
          >
            <Eye size={17} />
            Monitoring
          </a>

          <a
            href="/history"
            className="history-nav__item history-nav__item--active"
          >
            <Clock3 size={17} />
            History
          </a>

          <a
            href="/reports"
            className="history-nav__item"
          >
            <TrendingUp size={17} />
            Reports
          </a>

          <span className="history-nav__label history-nav__label--second">
            ACCOUNT
          </span>

          <a
            href="/profile"
            className="history-nav__item"
          >
            <HeartPulse size={17} />
            Profile
          </a>

          <a
            href="/settings"
            className="history-nav__item"
          >
            <ShieldCheck size={17} />
            Settings
          </a>
        </nav>

        <div className="history-sidebar__bottom">
          <div className="history-sidebar__tip">
            <Sparkles size={15} />

            <span>
              Review your past sessions to understand
              your emotional patterns.
            </span>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="history-main">
        <header className="history-header">
          <div>
            <span className="history-header__eyebrow">
              YOUR JOURNEY
            </span>

            <h1>Session History</h1>

            <p>
              Explore your previous emotional
              monitoring sessions.
            </p>
          </div>

          <div className="history-header__summary">
            <div>
              <strong>28</strong>
              <span>Total sessions</span>
            </div>

            <div>
              <strong>84</strong>
              <span>Avg. score</span>
            </div>

            <div>
              <strong>93%</strong>
              <span>Confidence</span>
            </div>
          </div>
        </header>

        {/* =================================================
            FILTERS
        ================================================= */}

        <Card
          className="history-filters-card"
          padding="medium"
        >
          <div className="history-filter-title">
            <Filter size={16} />

            <span>Filter sessions</span>
          </div>

          <div className="history-filters">
            <div className="history-search">
              <Search size={15} />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  handleSearch(event.target.value)
                }
                placeholder="Search sessions..."
              />
            </div>

            <label className="history-select">
              <span>Emotion</span>

              <div>
                <select
                  value={emotionFilter}
                  onChange={(event) =>
                    handleEmotionFilter(
                      event.target.value
                    )
                  }
                >
                  <option>
                    All emotions
                  </option>

                  <option>Happy</option>
                  <option>Sad</option>
                  <option>Neutral</option>
                  <option>Anxious</option>
                  <option>Stressed</option>
                  <option>Calm</option>
                </select>

                <ChevronDown size={14} />
              </div>
            </label>

            <label className="history-select">
              <span>Sort by</span>

              <div>
                <select
                  value={dateFilter}
                  onChange={(event) =>
                    handleDateFilter(
                      event.target.value
                    )
                  }
                >
                  <option>
                    Newest first
                  </option>

                  <option>
                    Oldest first
                  </option>
                </select>

                <ChevronDown size={14} />
              </div>
            </label>
          </div>
        </Card>

        {/* =================================================
            SESSION TABLE
        ================================================= */}

        <section className="history-session-section">
          <div className="history-section-header">
            <div>
              <span>
                MONITORING SESSIONS
              </span>

              <h2>
                {filteredSessions.length} sessions found
              </h2>
            </div>

            <div className="history-results-info">
              Showing{" "}
              {filteredSessions.length === 0
                ? 0
                : (currentPage - 1) *
                    ITEMS_PER_PAGE +
                  1}
              –
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredSessions.length
              )}{" "}
              of {filteredSessions.length}
            </div>
          </div>

          <Card
            className="history-table-card"
            padding="none"
          >
            <div className="history-table">
              <div className="history-table__head">
                <span>SESSION</span>
                <span>EMOTION</span>
                <span>DURATION</span>
                <span>WELL-BEING</span>
                <span>CONFIDENCE</span>
                <span>STATUS</span>
                <span />
              </div>

              {visibleSessions.length > 0 ? (
                visibleSessions.map((session) => (
                  <div
                    className="history-table__row"
                    key={session.id}
                  >
                    <div className="history-session-info">
                      <div className="history-session-icon">
                        <CalendarDays size={15} />
                      </div>

                      <div>
                        <strong>
                          {session.date}
                        </strong>

                        <span>
                          {session.time}
                        </span>
                      </div>
                    </div>

                    <div className="history-emotion">
                      <span>
                        {session.emoji}
                      </span>

                      <strong>
                        {session.emotion}
                      </strong>
                    </div>

                    <div className="history-duration">
                      <Clock3 size={13} />

                      {session.duration} min
                    </div>

                    <div className="history-score">
                      <strong>
                        {session.score}
                      </strong>

                      <div>
                        <span
                          style={{
                            width: `${session.score}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="history-confidence">
                      {session.confidence}%
                    </div>

                    <div>
                      <span className="history-status">
                        <i />
                        {session.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="history-view-button"
                      onClick={() =>
                        setSelectedSession(session)
                      }
                    >
                      View
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="history-empty">
                  <Search size={22} />

                  <strong>
                    No sessions found
                  </strong>

                  <span>
                    Try changing your search or filters.
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {filteredSessions.length > 0 && (
            <div className="history-pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={
                    currentPage === page
                      ? "history-pagination__active"
                      : ""
                  }
                  onClick={() =>
                    setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </section>

        {/* =================================================
            INSIGHT
        ================================================= */}

        <Card
          className="history-insight"
          padding="medium"
        >
          <div className="history-insight__icon">
            <Sparkles size={18} />
          </div>

          <div>
            <span>YOUR PATTERN</span>

            <h3>
              Calm has been your most frequent emotional
              state.
            </h3>

            <p>
              Across your recent sessions, calm signals
              appeared more often than any other tracked
              emotion. Your average well-being score has
              also remained above 80.
            </p>
          </div>

          <a href="/reports">
            View analytics
            <ChevronRight size={15} />
          </a>
        </Card>

        <footer className="history-footer">
          <span>
            MindPulse AI • Emotional awareness journey
          </span>

          <span>
            Privacy-first • Human-centric
          </span>
        </footer>
      </section>

      {/* =====================================================
          SESSION DETAIL MODAL
      ===================================================== */}

      {selectedSession && (
        <div
          className="history-modal-overlay"
          onClick={() =>
            setSelectedSession(null)
          }
        >
          <div
            className="history-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="history-modal__header">
              <div>
                <span>SESSION DETAILS</span>

                <h2>
                  {selectedSession.date}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedSession(null)
                }
                aria-label="Close session details"
              >
                ×
              </button>
            </div>

            <div className="history-modal__emotion">
              <span>
                {selectedSession.emoji}
              </span>

              <div>
                <small>
                  Dominant emotion
                </small>

                <strong>
                  {selectedSession.emotion}
                </strong>
              </div>
            </div>

            <div className="history-modal__stats">
              <div>
                <span>Well-being</span>
                <strong>
                  {selectedSession.score}
                </strong>
              </div>

              <div>
                <span>Confidence</span>
                <strong>
                  {selectedSession.confidence}%
                </strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>
                  {selectedSession.duration} min
                </strong>
              </div>
            </div>

            <div className="history-modal__note">
              <span>SESSION NOTE</span>

              <p>
                {selectedSession.note}
              </p>
            </div>

            <div className="history-modal__footer">
              <ShieldCheck size={14} />

              <span>
                This session is represented using
                locally stored mock data.
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default History;