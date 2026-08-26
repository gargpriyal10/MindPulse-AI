import {
  CalendarDays,
  Clock3,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";

import Card from "../ui/Card";

import "./SessionCard.css";

const emotionEmojis = {
  Happy: "😊",
  Sad: "😔",
  Neutral: "😐",
  Anxious: "😟",
  Stressed: "😣",
  Calm: "😌",
};

function SessionCard({
  session,
  onClick,
  compact = false,
}) {
  if (!session) {
    return null;
  }

  const {
    date,
    startTime,
    duration,
    dominantEmotion,
    wellbeingScore,
    confidence,
    status,
  } = session;

  const emoji =
    emotionEmojis[dominantEmotion] || "😐";

  return (
    <Card
      className={`session-card ${
        compact ? "session-card--compact" : ""
      }`}
      hoverable={Boolean(onClick)}
      onClick={onClick}
      padding="medium"
    >
      <div className="session-card__header">
        <div className="session-card__emotion">
          <span className="session-card__emoji">
            {emoji}
          </span>

          <div>
            <span className="session-card__label">
              Dominant emotion
            </span>

            <h3>{dominantEmotion}</h3>
          </div>
        </div>

        {status && (
          <span
            className={`session-card__status session-card__status--${status.toLowerCase()}`}
          >
            {status}
          </span>
        )}
      </div>

      <div className="session-card__details">
        <div>
          <CalendarDays size={15} />
          <span>{date}</span>
        </div>

        <div>
          <Clock3 size={15} />
          <span>
            {startTime} · {duration} min
          </span>
        </div>

        <div>
          <ShieldCheck size={15} />
          <span>{confidence}% confidence</span>
        </div>
      </div>

      <div className="session-card__score">
        <div>
          <span>Well-being score</span>

          <strong>{wellbeingScore}/100</strong>
        </div>

        <div className="session-card__score-bar">
          <div
            style={{
              width: `${Math.min(
                Math.max(wellbeingScore, 0),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {onClick && (
        <div className="session-card__action">
          View session
          <ChevronRight size={15} />
        </div>
      )}
    </Card>
  );
}

export default SessionCard;