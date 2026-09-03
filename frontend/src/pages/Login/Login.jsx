import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { setAuthState } from "../../services/auth";
import { loginUser } from "../../services/api";
import Button from "../../components/ui/Button";

import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const email =
      formData.email.trim();

    const password =
      formData.password;

    /* =====================================================
      FRONTEND VALIDATION
    ===================================================== */

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    if (!email.includes("@")) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    /* =====================================================
      FRONTEND-ONLY LOGIN
      
      This will later be replaced by the backend API.
    ===================================================== */
    setIsLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      const { success, access_token, user, message } =
        response.data;

      if (!success) {
        setError(message || "Login failed.");
        return;
      }

      localStorage.setItem(
        "access_token",
        access_token
      );

      setAuthState(user, rememberMe);

      window.location.href = "/dashboard";
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to connect to the server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError("");

    setMessage(
      "Password recovery will be available when the backend authentication service is connected."
    );
  };

  return (
    <main className="login-page">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="login-page__glow login-page__glow--one" />

      <div className="login-page__glow login-page__glow--two" />

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="login-header">

        <a
          href="/"
          className="login-brand"
        >
          <span className="login-brand__icon">
            <Brain size={20} />
          </span>

          <span>
            MindPulse <strong>AI</strong>
          </span>
        </a>

        <a
          href="/"
          className="login-back"
        >
          <ArrowLeft size={15} />
          Back to home
        </a>

      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="login-content">

        {/* =================================================
            LEFT INFORMATION PANEL
        ================================================= */}

        <div className="login-intro">

          <div className="login-intro__badge">
            <Sparkles size={14} />
            Your emotional journey continues
          </div>

          <h1>
            Welcome
            <span> back.</span>
          </h1>

          <p>
            Pick up where you left off and continue
            understanding your emotional well-being
            with MindPulse AI.
          </p>

          <div className="login-intro__features">

            <div>

              <span>
                <ShieldCheck size={17} />
              </span>

              <div>
                <strong>
                  Privacy-first
                </strong>

                <small>
                  Your emotional data stays protected.
                </small>
              </div>

            </div>

            <div>

              <span>
                <LockKeyhole size={17} />
              </span>

              <div>
                <strong>
                  Secure sessions
                </strong>

                <small>
                  Designed with your personal privacy
                  in mind.
                </small>
              </div>

            </div>

          </div>

          <div className="login-intro__quote">

            <span>“</span>

            <p>
              Awareness is the first step toward
              meaningful change.
            </p>

          </div>

        </div>

        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div className="login-card">

          <div className="login-card__header">

            <div className="login-card__mobile-icon">
              <Brain size={21} />
            </div>

            <span className="login-card__eyebrow">
              ACCOUNT ACCESS
            </span>

            <h2>
              Sign in to MindPulse
            </h2>

            <p>
              Enter your details to access your
              well-being dashboard.
            </p>

          </div>

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && (
            <div
              role="alert"
              style={{
                marginBottom: "16px",
                padding: "12px 14px",
                borderRadius: "10px",
                background:
                  "rgba(239, 68, 68, 0.10)",
                border:
                  "1px solid rgba(239, 68, 68, 0.25)",
                color: "#FCA5A5",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              {error}
            </div>
          )}

          {/* =================================================
              INFORMATION MESSAGE
          ================================================= */}

          {message && (
            <div
              role="status"
              style={{
                marginBottom: "16px",
                padding: "12px 14px",
                borderRadius: "10px",
                background:
                  "rgba(20, 184, 166, 0.10)",
                border:
                  "1px solid rgba(20, 184, 166, 0.25)",
                color: "#99F6E4",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              {message}
            </div>
          )}

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="login-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="login-input-wrapper">

                <Mail size={17} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />

              </div>

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="login-field">

              <div className="login-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="login-forgot"
                  onClick={
                    handleForgotPassword
                  }
                >
                  Forgot password?
                </button>

              </div>

              <div className="login-input-wrapper">

                <LockKeyhole size={17} />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* =================================================
                REMEMBER ME
            ================================================= */}

            <label className="login-checkbox">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
              />

              <span className="login-checkbox__box" />

              <span>
                Remember me
              </span>

            </label>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <Button
              type="submit"
              fullWidth
              size="large"
              loading={isLoading}
              icon={
                !isLoading && (
                  <ArrowRight size={17} />
                )
              }
            >
              Sign In
            </Button>

          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <p className="login-register">

            Don't have an account?

            <a href="/register">
              Create an account
            </a>

          </p>

          <div className="login-security">

            <ShieldCheck size={14} />

            <span>
              Secure & privacy-conscious experience
            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="login-footer">

        © 2026 MindPulse AI

        <span>•</span>

        Emotion Recognition & Well-being Monitoring

      </footer>

    </main>
  );
}

export default Login;