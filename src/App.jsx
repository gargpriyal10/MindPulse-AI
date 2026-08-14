import {
  Activity,
  HeartPulse,
  Sparkles,
  Brain,
  TrendingUp,
} from "lucide-react";

import Button from "./components/ui/Button";
import Card from "./components/ui/Card";

import "./App.css";

function App() {
  return (
    <main className="showcase">
      <div className="showcase__glow showcase__glow--teal" />
      <div className="showcase__glow showcase__glow--purple" />

      <section className="showcase__container">
        {/* Header */}
        <div className="showcase__header">
          <div className="showcase__brand">
            <div className="showcase__logo">
              <Brain size={28} />
            </div>

            <div>
              <p className="showcase__eyebrow">
                AURA BALANCE
              </p>

              <h1>
                MindPulse <span>AI</span>
              </h1>
            </div>
          </div>

          <div className="showcase__status">
            <span className="showcase__status-dot" />
            Frontend Online
          </div>
        </div>

        {/* Hero */}
        <section className="showcase__hero">
          <div className="showcase__hero-content">
            <span className="showcase__badge">
              <Sparkles size={15} />
              Emotion Intelligence
            </span>

            <h2>
              Understand your
              <span> emotional well-being.</span>
            </h2>

            <p>
              MindPulse AI helps you understand emotional
              patterns through intelligent emotion recognition
              and personalized well-being insights.
            </p>

            <div className="showcase__actions">
              <Button
                variant="primary"
                size="large"
                icon={<Activity size={18} />}
              >
                Start Monitoring
              </Button>

              <Button
                variant="secondary"
                size="large"
                icon={<HeartPulse size={18} />}
              >
                Explore Insights
              </Button>
            </div>
          </div>

          <div className="showcase__hero-visual">
            <div className="pulse-orb">
              <div className="pulse-orb__ring pulse-orb__ring--outer" />
              <div className="pulse-orb__ring pulse-orb__ring--middle" />

              <div className="pulse-orb__core">
                🧠
              </div>
            </div>

            <div className="showcase__emotion">
              <span>Current State</span>
              <strong>Calm 😌</strong>
              <small>94% confidence</small>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="showcase__cards">
          <Card
            title="Well-being Score"
            subtitle="Your overall emotional balance"
            icon={<HeartPulse size={19} />}
            variant="teal"
            hoverable
          >
            <div className="metric">
              <strong>78</strong>
              <span>/100</span>
            </div>

            <div className="metric__trend">
              <TrendingUp size={15} />
              +6.4% this week
            </div>
          </Card>

          <Card
            title="Current Emotion"
            subtitle="Detected during your latest session"
            icon={<Sparkles size={19} />}
            variant="lavender"
            hoverable
          >
            <div className="emotion">
              <span className="emotion__emoji">😌</span>

              <div>
                <strong>Calm</strong>
                <span>76% intensity</span>
              </div>
            </div>
          </Card>

          <Card
            title="Stress Level"
            subtitle="Your recent stress indicator"
            icon={<Activity size={19} />}
            variant="coral"
            hoverable
          >
            <div className="metric">
              <strong>32</strong>
              <span>/100</span>
            </div>

            <div className="stress-bar">
              <div
                className="stress-bar__fill"
                style={{ width: "32%" }}
              />
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="showcase__footer">
          <span>MindPulse AI</span>
          <span>•</span>
          <span>Emotion Recognition & Well-being Monitoring</span>
        </footer>
      </section>
    </main>
  );
}

export default App;