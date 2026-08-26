import { useState } from "react";
import {
    Activity,
    Bell,
    Check,
    ChevronRight,
    Eye,
    HeartPulse,
    LockKeyhole,
    Save,
    ShieldCheck,
    SlidersHorizontal,
    Trash2,
    User,
} from "lucide-react";

import Card from "../../components/ui/Card";
import {
    getCurrentUser,
    updateCurrentUser,
} from "../../services/auth";

import "./Settings.css";

function Settings() {
    const defaultSettings = {
        notifications: true,
        sessionReminders: true,
        weeklyReports: true,
        emotionAlerts: false,
        autoStartCamera: false,
        anonymousAnalytics: false,
    };

    const [settings, setSettings] = useState(() => {
        try {
            const stored = localStorage.getItem(
                "mindpulse_settings"
            );

            return stored
                ? {
                    ...defaultSettings,
                    ...JSON.parse(stored),
                }
                : defaultSettings;
        } catch (error) {
            console.error(
                "Unable to load settings:",
                error
            );

            return defaultSettings;
        }
    });

    const [saved, setSaved] = useState(false);

    const updateSetting = (key) => {
        setSettings((current) => {
            const updatedSettings = {
                ...current,
                [key]: !current[key],
            };

            localStorage.setItem(
                "mindpulse_settings",
                JSON.stringify(updatedSettings)
            );

            return updatedSettings;
        });

        setSaved(false);
    };

    const saveSettings = () => {
        localStorage.setItem(
            "mindpulse_settings",
            JSON.stringify(settings)
        );

        updateCurrentUser({
            preferences: {
                ...(getCurrentUser()?.preferences || {}),
                notifications: settings.notifications,
                weeklyReports: settings.weeklyReports,
                emotionAlerts: settings.emotionAlerts,
            },
        });

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2500);
    };

    return (
        <main className="settings-page">
            {/* SIDEBAR */}

            <aside className="settings-sidebar">
                <a href="/dashboard" className="settings-brand">
                    <span className="settings-brand__icon">
                        <HeartPulse size={20} />
                    </span>

                    <span>
                        MindPulse <strong>AI</strong>
                    </span>
                </a>

                <nav className="settings-nav">
                    <span className="settings-nav__label">
                        WORKSPACE
                    </span>

                    <a href="/dashboard" className="settings-nav__item">
                        <Activity size={17} />
                        Overview
                    </a>

                    <a href="/monitoring" className="settings-nav__item">
                        <Eye size={17} />
                        Monitoring
                    </a>

                    <a href="/history" className="settings-nav__item">
                        <SlidersHorizontal size={17} />
                        History
                    </a>

                    <a href="/reports" className="settings-nav__item">
                        <Activity size={17} />
                        Reports
                    </a>

                    <span className="settings-nav__label settings-nav__label--second">
                        ACCOUNT
                    </span>

                    <a href="/profile" className="settings-nav__item">
                        <User size={17} />
                        Profile
                    </a>

                    <a
                        href="/settings"
                        className="settings-nav__item settings-nav__item--active"
                    >
                        <ShieldCheck size={17} />
                        Settings
                    </a>
                </nav>

                <div className="settings-sidebar__bottom">
                    <div className="settings-privacy">
                        <LockKeyhole size={15} />

                        <span>
                            Your privacy controls are always
                            available from your account settings.
                        </span>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}

            <section className="settings-main">
                <header className="settings-header">
                    <div>
                        <span className="settings-header__eyebrow">
                            PREFERENCES
                        </span>

                        <h1>Settings</h1>

                        <p>
                            Manage your MindPulse preferences,
                            monitoring behavior and privacy.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="settings-save-button"
                        onClick={saveSettings}
                    >
                        {saved ? (
                            <>
                                <Check size={14} />
                                Saved
                            </>
                        ) : (
                            <>
                                <Save size={14} />
                                Save changes
                            </>
                        )}
                    </button>
                </header>

                {/* NOTIFICATIONS */}

                <Card
                    className="settings-section-card"
                    padding="medium"
                >
                    <div className="settings-section-heading">
                        <div className="settings-section-icon">
                            <Bell size={17} />
                        </div>

                        <div>
                            <span>NOTIFICATIONS</span>

                            <h2>Stay informed</h2>

                            <p>
                                Control the reminders and updates you
                                receive from MindPulse.
                            </p>
                        </div>
                    </div>

                    <SettingRow
                        icon={<Bell size={15} />}
                        title="Push notifications"
                        description="Receive important MindPulse updates."
                        checked={settings.notifications}
                        onChange={() =>
                            updateSetting("notifications")
                        }
                    />

                    <SettingRow
                        icon={<Activity size={15} />}
                        title="Session reminders"
                        description="Get reminded to maintain regular monitoring."
                        checked={settings.sessionReminders}
                        onChange={() =>
                            updateSetting("sessionReminders")
                        }
                    />

                    <SettingRow
                        icon={<SlidersHorizontal size={15} />}
                        title="Weekly reports"
                        description="Receive a summary of your weekly emotional patterns."
                        checked={settings.weeklyReports}
                        onChange={() =>
                            updateSetting("weeklyReports")
                        }
                    />

                    <SettingRow
                        icon={<HeartPulse size={15} />}
                        title="Emotion alerts"
                        description="Receive alerts when significant changes are detected."
                        checked={settings.emotionAlerts}
                        onChange={() =>
                            updateSetting("emotionAlerts")
                        }
                    />
                </Card>

                {/* MONITORING */}

                <Card
                    className="settings-section-card"
                    padding="medium"
                >
                    <div className="settings-section-heading">
                        <div className="settings-section-icon">
                            <Eye size={17} />
                        </div>

                        <div>
                            <span>MONITORING</span>

                            <h2>Session preferences</h2>

                            <p>
                                Control how MindPulse behaves during
                                monitoring sessions.
                            </p>
                        </div>
                    </div>

                    <SettingRow
                        icon={<Eye size={15} />}
                        title="Auto-start camera"
                        description="Automatically prepare the camera when monitoring begins."
                        checked={settings.autoStartCamera}
                        onChange={() =>
                            updateSetting("autoStartCamera")
                        }
                    />

                    
                </Card>

                {/* PRIVACY */}

                <Card
                    className="settings-section-card"
                    padding="medium"
                >
                    <div className="settings-section-heading">
                        <div className="settings-section-icon">
                            <ShieldCheck size={17} />
                        </div>

                        <div>
                            <span>PRIVACY</span>

                            <h2>Data & privacy</h2>

                            <p>
                                Control how optional analytics and
                                session information are handled.
                            </p>
                        </div>
                    </div>

                    <SettingRow
                        icon={<ShieldCheck size={15} />}
                        title="Anonymous analytics"
                        description="Help improve MindPulse using anonymous usage statistics."
                        checked={settings.anonymousAnalytics}
                        onChange={() =>
                            updateSetting("anonymousAnalytics")
                        }
                    />

                    <div className="settings-security-banner">
                        <LockKeyhole size={17} />

                        <div>
                            <strong>
                                Privacy-first architecture
                            </strong>

                            <span>
                                Your emotional insights should only be
                                accessible to you and authorized systems.
                            </span>
                        </div>

                        <ChevronRight size={15} />
                    </div>
                </Card>

                {/* ACCOUNT */}

                <Card
                    className="settings-account-card"
                    padding="medium"
                >
                    <div>
                        <span>ACCOUNT</span>

                        <h2>Account actions</h2>

                        <p>
                            Manage your profile and account data.
                        </p>
                    </div>

                    <div className="settings-account-actions">
                        <a href="/profile">
                            <User size={15} />
                            Manage profile
                            <ChevronRight size={14} />
                        </a>

                        <button type="button">
                            <Trash2 size={15} />
                            Delete account
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </Card>

                <footer className="settings-footer">
                    <span>
                        MindPulse AI • Preferences
                    </span>

                    <span>
                        Privacy-first • Human-centric
                    </span>
                </footer>
            </section>
        </main>
    );
}

function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            className={`settings-toggle ${checked ? "settings-toggle--on" : ""
                }`}
            onClick={onChange}
            aria-pressed={checked}
        >
            <span />
        </button>
    );
}

function SettingRow({
    icon,
    title,
    description,
    checked,
    onChange,
}) {
    return (
        <div className="settings-option">
            <div className="settings-option__icon">
                {icon}
            </div>

            <div className="settings-option__content">
                <strong>{title}</strong>

                <span>{description}</span>
            </div>

            <Toggle
                checked={checked}
                onChange={onChange}
            />
        </div>
    );
}

export default Settings;