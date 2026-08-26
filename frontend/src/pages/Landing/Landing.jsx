import {
  ArrowRight,
  Brain,
  Camera,
  ChartNoAxesCombined,
  Check,
  HeartPulse,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

import "./Landing.css";

function Landing() {
  return (
    <main className="landing">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="landing-nav">
        <a href="/" className="landing-brand">
          <div className="landing-brand__icon">
            <Brain size={22} />
          </div>

          <span>
            MindPulse <strong>AI</strong>
          </span>
        </a>

        <div className="landing-nav__links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="landing-nav__actions">
          <a href="/login" className="landing-nav__login">
            Sign In
          </a>

          <Button
            size="small"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="landing-hero">
        <div className="landing-hero__content">
          <div className="landing-badge">
            <span className="landing-badge__dot" />

            <Sparkles size={14} />

            AI-powered emotional intelligence
          </div>

          <h1>
            Understand your emotions.
            <span> Improve your well-being.</span>
          </h1>

          <p>
            MindPulse AI transforms emotion recognition into
            meaningful well-being insights, helping you
            understand how you feel and build healthier
            emotional patterns.
          </p>

          <div className="landing-hero__actions">
            <Button
              size="large"
              icon={<ArrowRight size={18} />}
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Start Your Journey
            </Button>

            <Button
              variant="secondary"
              size="large"
              icon={<Play size={17} />}
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              See How It Works
            </Button>
          </div>

          <div className="landing-trust">
            <div>
              <ShieldCheck size={16} />
              Privacy-first design
            </div>

            <div>
              <Lock size={16} />
              Your emotions stay yours
            </div>
          </div>
        </div>

        {/* Hero visual */}

        <div className="landing-hero__visual">
          <div className="emotion-orbit emotion-orbit--one" />
          <div className="emotion-orbit emotion-orbit--two" />

          <div className="emotion-core">
            <div className="emotion-core__glow" />

            <div className="emotion-core__brain">
              🧠
            </div>

            <span>MindPulse</span>
            <strong>Emotion AI</strong>
          </div>

          <div className="emotion-float emotion-float--happy">
            <span>😊</span>

            <div>
              <small>Detected</small>
              <strong>Happy</strong>
            </div>

            <b>92%</b>
          </div>

          <div className="emotion-float emotion-float--calm">
            <span>😌</span>

            <div>
              <small>Detected</small>
              <strong>Calm</strong>
            </div>

            <b>87%</b>
          </div>

          <div className="emotion-float emotion-float--stress">
            <span>😣</span>

            <div>
              <small>Stress level</small>
              <strong>Low</strong>
            </div>

            <b>24%</b>
          </div>
        </div>
      </section>

      {/* =====================================================
          EMOTION STRIP
      ===================================================== */}

      <section className="landing-emotions">
        <div className="landing-section-label">
          <span>UNDERSTAND YOUR EMOTIONAL STATE</span>
        </div>

        <div className="landing-emotions__grid">
          <div className="landing-emotion landing-emotion--happy">
            <span>😊</span>
            <strong>Happy</strong>
            <small>Positive energy</small>
          </div>

          <div className="landing-emotion landing-emotion--calm">
            <span>😌</span>
            <strong>Calm</strong>
            <small>Balanced state</small>
          </div>

          <div className="landing-emotion landing-emotion--neutral">
            <span>😐</span>
            <strong>Neutral</strong>
            <small>Steady mood</small>
          </div>

          <div className="landing-emotion landing-emotion--stressed">
            <span>😣</span>
            <strong>Stressed</strong>
            <small>Needs attention</small>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="landing-section"
      >
        <div className="landing-section__heading">
          <span className="landing-kicker">
            WHY MINDPULSE
          </span>

          <h2>
            Emotional intelligence,
            <span> made actionable.</span>
          </h2>

          <p>
            Go beyond simply detecting emotions. MindPulse
            helps turn emotional patterns into insights you
            can understand and act upon.
          </p>
        </div>

        <div className="landing-features">
          <Card
            title="Emotion Recognition"
            subtitle="Understand what your expressions reveal."
            icon={<Camera size={19} />}
            variant="teal"
            hoverable
          >
            <div className="landing-feature-icon">
              😊
            </div>

            <p>
              Detect emotional states using intelligent
              recognition technology and track changes
              throughout your sessions.
            </p>
          </Card>

          <Card
            title="Well-being Analytics"
            subtitle="See patterns, not isolated moments."
            icon={<ChartNoAxesCombined size={19} />}
            variant="lavender"
            hoverable
          >
            <div className="landing-feature-chart">
              <span style={{ height: "35%" }} />
              <span style={{ height: "55%" }} />
              <span style={{ height: "42%" }} />
              <span style={{ height: "75%" }} />
              <span style={{ height: "65%" }} />
              <span style={{ height: "90%" }} />
            </div>

            <p>
              Explore emotion trends and well-being scores
              through simple, meaningful visualizations.
            </p>
          </Card>

          <Card
            title="Personalized Insights"
            subtitle="Turn awareness into better habits."
            icon={<HeartPulse size={19} />}
            variant="coral"
            hoverable
          >
            <div className="landing-feature-insight">
              <TrendingUp size={22} />

              <div>
                <strong>+18%</strong>
                <span>well-being trend</span>
              </div>
            </div>

            <p>
              Discover patterns in your emotional well-being
              and receive insights designed around your
              journey.
            </p>
          </Card>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="landing-how"
      >
        <div className="landing-section__heading">
          <span className="landing-kicker">
            HOW IT WORKS
          </span>

          <h2>
            Three steps toward
            <span> better awareness.</span>
          </h2>
        </div>

        <div className="landing-steps">
          <div className="landing-step">
            <div className="landing-step__number">
              01
            </div>

            <div className="landing-step__icon">
              <Camera size={22} />
            </div>

            <h3>Detect</h3>

            <p>
              Start a monitoring session and let MindPulse
              analyze emotional signals in real time.
            </p>
          </div>

          <div className="landing-step__line" />

          <div className="landing-step">
            <div className="landing-step__number">
              02
            </div>

            <div className="landing-step__icon">
              <Brain size={22} />
            </div>

            <h3>Understand</h3>

            <p>
              See your detected emotions, confidence levels,
              trends, and well-being indicators.
            </p>
          </div>

          <div className="landing-step__line" />

          <div className="landing-step">
            <div className="landing-step__number">
              03
            </div>

            <div className="landing-step__icon">
              <HeartPulse size={22} />
            </div>

            <h3>Improve</h3>

            <p>
              Use meaningful insights to understand patterns
              and build healthier emotional habits.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRICING
      ===================================================== */}

      <section
        id="pricing"
        className="landing-section landing-pricing"
      >
        <div className="landing-section__heading">
          <span className="landing-kicker">
            SIMPLE PLANS
          </span>

          <h2>
            Start understanding
            <span> yourself today.</span>
          </h2>
        </div>

        <div className="landing-pricing__grid">
          <Card
            title="Personal"
            subtitle="For individual well-being tracking"
            hoverable
          >
            <div className="landing-price">
              <strong>Free</strong>
              <span>forever</span>
            </div>

            <ul>
              <li>
                <Check size={15} />
                Emotion recognition
              </li>

              <li>
                <Check size={15} />
                Basic session history
              </li>

              <li>
                <Check size={15} />
                Well-being overview
              </li>
            </ul>

            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Get Started
            </Button>
          </Card>

          <Card
            title="MindPulse Plus"
            subtitle="For deeper emotional insights"
            variant="teal"
            hoverable
          >
            <div className="landing-pricing__popular">
              MOST POPULAR
            </div>

            <div className="landing-price">
              <strong>₹199</strong>
              <span>/ month</span>
            </div>

            <ul>
              <li>
                <Check size={15} />
                Everything in Personal
              </li>

              <li>
                <Check size={15} />
                Advanced analytics
              </li>

              <li>
                <Check size={15} />
                Detailed reports
              </li>

              <li>
                <Check size={15} />
                Personalized insights
              </li>
            </ul>

            <Button
              fullWidth
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Start Free Trial
            </Button>
          </Card>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="landing-cta">
        <div className="landing-cta__glow" />

        <Sparkles size={25} />

        <h2>
          Your emotions tell a story.
          <span> Let's understand it.</span>
        </h2>

        <p>
          Start your MindPulse journey and turn emotional
          awareness into meaningful well-being.
        </p>

        <Button
          size="large"
          icon={<ArrowRight size={18} />}
          onClick={() => {
            window.location.href = "/register";
          }}
        >
          Begin Your Journey
        </Button>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <div className="landing-brand__icon">
            <Brain size={19} />
          </div>

          <span>
            MindPulse <strong>AI</strong>
          </span>
        </div>

        <p>
          Emotion Recognition & Well-being Monitoring System
        </p>

        <span>
          © 2026 MindPulse AI
        </span>
      </footer>
    </main>
  );
}

export default Landing;