import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Brain,
    Check,
    Eye,
    EyeOff,
    HeartPulse,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    User,
} from "lucide-react";

import Button from "../../components/ui/Button";

import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const passwordsMatch =
        formData.password === formData.confirmPassword;

    const isFormValid =
        formData.name.trim() &&
        formData.email.trim() &&
        formData.password &&
        formData.confirmPassword &&
        passwordsMatch &&
        agreeToTerms;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFormValid) {
            return;
        }

        setIsLoading(true);

        /*
         * Frontend-only mock registration.
         * Real registration will later use services/api.js.
         */

        await new Promise((resolve) =>
            setTimeout(resolve, 1000)
        );

        setIsLoading(false);

        console.log("Mock registration:", formData);

        alert("Account created successfully!");

        navigate("/login");
    };

    return (
        <main className="register-page">
            {/* Background decoration */}

            <div className="register-page__glow register-page__glow--one" />
            <div className="register-page__glow register-page__glow--two" />

            {/* Header */}

            <header className="register-header">
                <a href="/" className="register-brand">
                    <span className="register-brand__icon">
                        <Brain size={20} />
                    </span>

                    <span>
                        MindPulse <strong>AI</strong>
                    </span>
                </a>

                <a href="/" className="register-back">
                    <ArrowLeft size={15} />
                    Back to home
                </a>
            </header>

            <section className="register-content">
                {/* =================================================
            LEFT PANEL
        ================================================= */}

                <div className="register-intro">
                    <div className="register-intro__badge">
                        <Sparkles size={14} />
                        Begin your well-being journey
                    </div>

                    <h1>
                        Make space for
                        <span> self-awareness.</span>
                    </h1>

                    <p>
                        Create your MindPulse account and start
                        discovering the emotional patterns that shape
                        your everyday well-being.
                    </p>

                    <div className="register-benefits">
                        <div className="register-benefit">
                            <div className="register-benefit__icon">
                                <HeartPulse size={17} />
                            </div>

                            <div>
                                <strong>
                                    Understand your emotions
                                </strong>

                                <small>
                                    Recognize patterns across your sessions.
                                </small>
                            </div>
                        </div>

                        <div className="register-benefit">
                            <div className="register-benefit__icon">
                                <ShieldCheck size={17} />
                            </div>

                            <div>
                                <strong>
                                    Privacy-conscious by design
                                </strong>

                                <small>
                                    Your well-being data deserves protection.
                                </small>
                            </div>
                        </div>

                        <div className="register-benefit">
                            <div className="register-benefit__icon">
                                <Sparkles size={17} />
                            </div>

                            <div>
                                <strong>
                                    Turn awareness into action
                                </strong>

                                <small>
                                    Get meaningful insights from your journey.
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="register-emotion-orbit">
                        <span className="register-emotion-orbit__core">
                            🧠
                        </span>

                        <span className="register-emotion-orbit__item register-emotion-orbit__item--one">
                            😊
                        </span>

                        <span className="register-emotion-orbit__item register-emotion-orbit__item--two">
                            😌
                        </span>

                        <span className="register-emotion-orbit__item register-emotion-orbit__item--three">
                            💜
                        </span>
                    </div>
                </div>

                {/* =================================================
            REGISTER CARD
        ================================================= */}

                <div className="register-card">
                    <div className="register-card__header">
                        <div className="register-card__mobile-icon">
                            <Brain size={21} />
                        </div>

                        <span className="register-card__eyebrow">
                            CREATE YOUR ACCOUNT
                        </span>

                        <h2>Start with MindPulse</h2>

                        <p>
                            It only takes a moment to create your account.
                        </p>
                    </div>

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >
                        {/* Name */}

                        <div className="register-field">
                            <label htmlFor="name">
                                Full name
                            </label>

                            <div className="register-input-wrapper">
                                <User size={17} />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}

                        <div className="register-field">
                            <label htmlFor="register-email">
                                Email address
                            </label>

                            <div className="register-input-wrapper">
                                <Mail size={17} />

                                <input
                                    id="register-email"
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

                        {/* Password */}

                        <div className="register-field">
                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="register-input-wrapper">
                                <LockKeyhole size={17} />

                                <input
                                    id="register-password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) => !previous
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

                        {/* Password strength */}

                        {formData.password && (
                            <div className="register-password-strength">
                                <div className="register-strength-bars">
                                    <span
                                        className={
                                            formData.password.length >= 1
                                                ? "active"
                                                : ""
                                        }
                                    />
                                    <span
                                        className={
                                            formData.password.length >= 6
                                                ? "active"
                                                : ""
                                        }
                                    />
                                    <span
                                        className={
                                            formData.password.length >= 10
                                                ? "active"
                                                : ""
                                        }
                                    />
                                    <span
                                        className={
                                            /[A-Z]/.test(
                                                formData.password
                                            ) &&
                                                /[0-9]/.test(
                                                    formData.password
                                                )
                                                ? "active"
                                                : ""
                                        }
                                    />
                                </div>

                                <small>
                                    {formData.password.length < 6
                                        ? "Use at least 6 characters"
                                        : formData.password.length < 10
                                            ? "Good — make it stronger"
                                            : "Strong password"}
                                </small>
                            </div>
                        )}

                        {/* Confirm password */}

                        <div className="register-field">
                            <label htmlFor="confirm-password">
                                Confirm password
                            </label>

                            <div
                                className={`register-input-wrapper ${formData.confirmPassword &&
                                        !passwordsMatch
                                        ? "register-input-wrapper--error"
                                        : ""
                                    }`}
                            >
                                <LockKeyhole size={17} />

                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={17} />
                                    ) : (
                                        <Eye size={17} />
                                    )}
                                </button>
                            </div>

                            {formData.confirmPassword &&
                                !passwordsMatch && (
                                    <span className="register-error">
                                        Passwords do not match.
                                    </span>
                                )}
                        </div>

                        {/* Terms */}

                        <label className="register-checkbox">
                            <input
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(event) =>
                                    setAgreeToTerms(
                                        event.target.checked
                                    )
                                }
                            />

                            <span className="register-checkbox__box">
                                {agreeToTerms && (
                                    <Check size={11} />
                                )}
                            </span>

                            <span>
                                I agree to the{" "}
                                <button
                                    type="button"
                                    onClick={(event) =>
                                        event.preventDefault()
                                    }
                                >
                                    privacy policy
                                </button>{" "}
                                and terms of use.
                            </span>
                        </label>

                        {/* Submit */}

                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            disabled={!isFormValid}
                            loading={isLoading}
                            icon={
                                !isLoading && (
                                    <ArrowRight size={17} />
                                )
                            }
                        >
                            Create My Account
                        </Button>
                    </form>

                    <div className="register-divider">
                        <span>already registered?</span>
                    </div>

                    <p className="register-login">
                        Already have an account?
                        <a href="/login">
                            Sign in
                        </a>
                    </p>

                    <div className="register-security">
                        <ShieldCheck size={14} />
                        <span>
                            Your well-being journey starts privately.
                        </span>
                    </div>
                </div>
            </section>

            <footer className="register-footer">
                © 2026 MindPulse AI
                <span>•</span>
                Emotion Recognition & Well-being Monitoring
            </footer>
        </main>
    );
}

export default Register;