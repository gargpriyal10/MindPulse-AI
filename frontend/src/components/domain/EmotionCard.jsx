import {
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

import Card from "../ui/Card";

import "./EmotionCard.css";

const emotionStyles = {
  Happy: {
    emoji: "😊",
    color: "#FACC15",
    className: "happy",
  },

  Sad: {
    emoji: "😔",
    color: "#60A5FA",
    className: "sad",
  },

  Neutral: {
    emoji: "😐",
    color: "#C084FC",
    className: "neutral",
  },

  Anxious: {
    emoji: "😟",
    color: "#FB7185",
    className: "anxious",
  },

  Stressed: {
    emoji: "😣",
    color: "#FF6B6B",
    className: "stressed",
  },

  Calm: {
    emoji: "😌",
    color: "#14B8A6",
    className: "calm",
  },
};

function EmotionCard({
  emotion = "Calm",
  intensity = 76,
  confidence = 94,
  trend = null,
  compact = false,
  onClick,
}) {
  const style =
    emotionStyles[emotion] || emotionStyles.Neutral;

  const TrendIcon =
    trend > 0
      ? TrendingUp
      : trend < 0
        ? TrendingDown
        : Minus;

  return (
    <Card
      className={`emotion-card emotion-card--${style.className} ${
        compact ? "emotion-card--compact" : ""
      }`}
      hoverable={Boolean(onClick)}
      onClick={onClick}
      padding="medium"
    >
      <div className="emotion-card__top">
        <div
          className="emotion-card__emoji"
          style={{
            "--emotion-color": style.color,
          }}
        >
          {style.emoji}
        </div>

        <div className="emotion-card__heading">
          <span className="emotion-card__label">
            Detected Emotion
          </span>

          <h3>{emotion}</h3>
        </div>
      </div>

      <div className="emotion-card__metrics">
        <div className="emotion-card__metric">
          <span>Intensity</span>

          <strong>{intensity}%</strong>
        </div>

        <div className="emotion-card__metric">
          <span>Confidence</span>

          <strong>{confidence}%</strong>
        </div>
      </div>

      <div className="emotion-card__progress">
        <div
          className="emotion-card__progress-fill"
          style={{
            width: `${Math.min(
              Math.max(intensity, 0),
              100
            )}%`,
            background: style.color,
          }}
        />
      </div>

      {trend !== null && (
        <div
          className={`emotion-card__trend ${
            trend > 0
              ? "emotion-card__trend--up"
              : trend < 0
                ? "emotion-card__trend--down"
                : "emotion-card__trend--neutral"
          }`}
        >
          <TrendIcon size={14} />

          <span>
            {trend > 0 ? "+" : ""}
            {trend}% from previous session
          </span>
        </div>
      )}
    </Card>
  );
}

export default EmotionCard;