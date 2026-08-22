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
import { getMonitoringSessions } from "../../services/monitoringService";

import "./History.css";

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

  const sessions = useMemo(() => {
    return getMonitoringSessions().map((session) => {
      const startDate = new Date(session.startedAt);

      const emotion =
        session.dominantEmotion || "Neutral";

      const emojiMap = {
        Happy: "😊",
        Calm: "😌",
        Neutral: "😐",
        Anxious: "😟",
        Stressed: "😣",
        Sad: "😔",
        Surprised: "😮",
      };

      return {
        id: session.id,
        date: startDate.toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        ),
        timestamp: startDate.toISOString(),
        time: startDate.toLocaleTimeString(
          "en-US",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
        duration: Math.max(
          1,
          Math.round(
            Number(session.duration || 0) / 60
          )
        ),
        emotion,
        emoji: emojiMap[emotion] || "🙂",
        score: Number(
          session.wellbeingScore || 0
        ),
        confidence: Number(
          session.confidence || 0
        ),
        status: session.status || "Completed",
        note:
          session.note ||
          "Recorded from your monitoring session.",
      };
    });
  }, []);

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
  }, [sessions, search, emotionFilter, dateFilter]);

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
              <strong>{sessions.length}</strong>
              <span>Total sessions</span>
            </div>

            <div>
              <strong>
                {sessions.length
                  ? Math.round(
                    sessions.reduce(
                      (total, session) =>
                        total + Number(session.wellbeingScore || 0),
                      0
                    ) / sessions.length
                  )
                  : 0}
              </strong>
              <span>Avg. score</span>
            </div>

            <div>
              <strong>
                {sessions.length
                  ? Math.round(
                    sessions.reduce(
                      (total, session) =>
                        total + Number(session.confidence || 0),
                      0
                    ) / sessions.length
                  )
                  : 0}
                %
              </strong>
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

            {(() => {
              if (sessions.length === 0) {
                return (
                  <>
                    <h3>
                      Your emotional pattern will appear here.
                    </h3>

                    <p>
                      Complete a monitoring session to start
                      building your personal emotional history.
                    </p>
                  </>
                );
              }

              const emotionCounts = sessions.reduce(
                (counts, session) => {
                  counts[session.emotion] =
                    (counts[session.emotion] || 0) + 1;

                  return counts;
                },
                {}
              );

              const topEmotion = Object.entries(
                emotionCounts
              ).sort((a, b) => b[1] - a[1])[0][0];

              const averageScore = Math.round(
                sessions.reduce(
                  (total, session) =>
                    total + Number(session.score || 0),
                  0
                ) / sessions.length
              );

              return (
                <>
                  <h3>
                    {topEmotion} has been your most frequent
                    emotional state.
                  </h3>

                  <p>
                    Across your recorded sessions,{" "}
                    {topEmotion.toLowerCase()} signals appeared
                    most often. Your average well-being score
                    is currently {averageScore}.
                  </p>
                </>
              );
            })()}
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
                This session is stored through the MindPulse monitoring service.
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default History;