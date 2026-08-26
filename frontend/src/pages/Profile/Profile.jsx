import { useState } from "react";
import {
    Activity,
    Bell,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Edit3,
    HeartPulse,
    LockKeyhole,
    Mail,
    MapPin,
    ShieldCheck,
    Sparkles,
    User,
} from "lucide-react";

import Card from "../../components/ui/Card";
import {
    getCurrentUser,
    updateCurrentUser,
} from "../../services/auth";
import { getMonitoringSessions } from "../../services/monitoringService";

import "./Profile.css";

function Profile() {
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    const currentUser = getCurrentUser();

    const defaultProfile = {
        name:
            currentUser?.name ||
            currentUser?.email?.split("@")[0] ||
            "User",
        email:
            currentUser?.email ||
            "",
        location: "India",
        timezone: "IST (UTC +5:30)",
    };

    const [profile, setProfile] = useState(() => {
        try {
            const stored = localStorage.getItem(
                "mindpulse_profile"
            );

            return stored
                ? {
                    ...defaultProfile,
                    ...JSON.parse(stored),
                }
                : defaultProfile;
        } catch (error) {
            console.error(
                "Unable to load profile:",
                error
            );

            return defaultProfile;
        }
    });

    const [draftProfile, setDraftProfile] =
        useState(profile);

    const handleEdit = () => {
        setDraftProfile(profile);
        setSaved(false);
        setEditing(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setDraftProfile((current) => ({
            ...current,
            [name]: value,
        }));

        setSaved(false);
    };

    const handleSave = () => {
        const updatedProfile = {
            ...draftProfile,
            name: draftProfile.name.trim(),
            email: draftProfile.email.trim().toLowerCase(),
            location: draftProfile.location.trim(),
            timezone: draftProfile.timezone.trim(),
        };

        setProfile(updatedProfile);

        localStorage.setItem(
            "mindpulse_profile",
            JSON.stringify(updatedProfile)
        );

        updateCurrentUser({
            name: updatedProfile.name,
            email: updatedProfile.email,
            location: updatedProfile.location,
            timezone: updatedProfile.timezone,
        });

        setEditing(false);
        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    const monitoringSessions =
        getMonitoringSessions().filter(
            (session) =>
                session.status === "Completed"
        );

    const sessionCount =
        monitoringSessions.length;

    const averageWellbeing =
        sessionCount > 0
            ? Math.round(
                monitoringSessions.reduce(
                    (sum, session) =>
                        sum +
                        (Number(
                            session.wellbeingScore
                        ) || 0),
                    0
                ) / sessionCount
            )
            : 0;

    const averageConfidence =
        sessionCount > 0
            ? Math.round(
                monitoringSessions.reduce(
                    (sum, session) =>
                        sum +
                        (Number(
                            session.confidence
                        ) || 0),
                    0
                ) / sessionCount
            )
            : 93;

    const totalMinutes =
        monitoringSessions.reduce(
            (sum, session) =>
                sum +
                (Number(session.duration) || 0),
            0
        );

    const monitoringHours =
        sessionCount > 0
            ? (totalMinutes / 60).toFixed(1)
            : "0.0";

    const memberSinceLabel = currentUser?.createdAt
        ? new Date(
            currentUser.createdAt
        ).toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
        })
        : "August 2026";

    return (
        <main className="profile-page">
            {/* =====================================================
          SIDEBAR
      ===================================================== */}

            <aside className="profile-sidebar">
                <a href="/dashboard" className="profile-brand">
                    <span className="profile-brand__icon">
                        <HeartPulse size={20} />
                    </span>

                    <span>
                        MindPulse <strong>AI</strong>
                    </span>
                </a>

                <nav className="profile-nav">
                    <span className="profile-nav__label">
                        WORKSPACE
                    </span>

                    <a
                        href="/dashboard"
                        className="profile-nav__item"
                    >
                        <Activity size={17} />
                        Overview
                    </a>

                    <a
                        href="/monitoring"
                        className="profile-nav__item"
                    >
                        <HeartPulse size={17} />
                        Monitoring
                    </a>

                    <a
                        href="/history"
                        className="profile-nav__item"
                    >
                        <Clock3 size={17} />
                        History
                    </a>

                    <a
                        href="/reports"
                        className="profile-nav__item"
                    >
                        <Activity size={17} />
                        Reports
                    </a>

                    <span className="profile-nav__label profile-nav__label--second">
                        ACCOUNT
                    </span>

                    <a
                        href="/profile"
                        className="profile-nav__item profile-nav__item--active"
                    >
                        <User size={17} />
                        Profile
                    </a>

                    <a
                        href="/settings"
                        className="profile-nav__item"
                    >
                        <ShieldCheck size={17} />
                        Settings
                    </a>
                </nav>

                <div className="profile-sidebar__bottom">
                    <div className="profile-privacy-tip">
                        <LockKeyhole size={15} />

                        <span>
                            Your personal information is protected
                            with privacy-first controls.
                        </span>
                    </div>
                </div>
            </aside>

            {/* =====================================================
          MAIN
      ===================================================== */}

            <section className="profile-main">
                <header className="profile-header">
                    <div>
                        <span className="profile-header__eyebrow">
                            ACCOUNT
                        </span>

                        <h1>Profile</h1>

                        <p>
                            Manage your personal information and
                            MindPulse account.
                        </p>
                    </div>

                    {editing ? (
                        <button
                            type="button"
                            className="profile-save-button"
                            onClick={handleSave}
                        >
                            <CheckCircle2 size={14} />
                            Save changes
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="profile-edit-button"
                            onClick={handleEdit}
                        >
                            <Edit3 size={14} />
                            Edit profile
                        </button>
                    )}
                </header>

                {/* SAVE CONFIRMATION */}

                {saved && (
                    <div className="profile-save-message">
                        <CheckCircle2 size={14} />
                        Profile changes saved successfully.
                    </div>
                )}

                {/* =================================================
            PROFILE HERO
        ================================================= */}

                <Card
                    className="profile-hero"
                    padding="medium"
                >
                    <div className="profile-avatar">
                        <span>
                            {profile.name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </span>

                        <i>
                            <CheckCircle2 size={11} />
                        </i>
                    </div>

                    <div className="profile-identity">
                        <div className="profile-name-row">
                            <h2>{profile.name}</h2>

                            <span className="profile-active-badge">
                                <i />
                                Active
                            </span>
                        </div>

                        <p>
                            <Mail size={13} />
                            {profile.email}
                        </p>

                        <div className="profile-meta">
                            <span>
                                <CalendarDays size={12} />
                                Member since {memberSinceLabel}
                            </span>

                            <span>
                                <MapPin size={12} />
                                {profile.location}
                            </span>
                        </div>
                    </div>

                    <div className="profile-member-card">
                        <Sparkles size={15} />

                        <div>
                            <span>MEMBERSHIP</span>

                            <strong>MindPulse Member</strong>
                        </div>
                    </div>
                </Card>

                {/* =================================================
            INFORMATION + STATS
        ================================================= */}

                <section className="profile-content-grid">
                    <Card
                        className="profile-info-card"
                        padding="medium"
                    >
                        <div className="profile-card-heading">
                            <div>
                                <span>PERSONAL INFORMATION</span>

                                <h2>Your details</h2>
                            </div>

                            <User size={17} />
                        </div>

                        <div className="profile-form">
                            <label>
                                <span>Full name</span>

                                <div>
                                    <User size={14} />

                                    <input
                                        name="name"
                                        value={draftProfile.name}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                </div>
                            </label>

                            <label>
                                <span>Email address</span>

                                <div>
                                    <Mail size={14} />

                                    <input
                                        name="email"
                                        type="email"
                                        value={draftProfile.email}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                </div>
                            </label>

                            <label>
                                <span>Location</span>

                                <div>
                                    <MapPin size={14} />

                                    <input
                                        name="location"
                                        value={draftProfile.location}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                </div>
                            </label>

                            <label>
                                <span>Timezone</span>

                                <div>
                                    <Clock3 size={14} />

                                    <input
                                        name="timezone"
                                        value={draftProfile.timezone}
                                        onChange={handleChange}
                                        disabled={!editing}
                                    />
                                </div>
                            </label>
                        </div>
                    </Card>

                    <Card
                        className="profile-stats-card"
                        padding="medium"
                    >
                        <div className="profile-card-heading">
                            <div>
                                <span>EMOTIONAL OVERVIEW</span>

                                <h2>Your journey</h2>
                            </div>

                            <HeartPulse size={17} />
                        </div>

                        <div className="profile-stat-list">
                            <div className="profile-stat">
                                <div className="profile-stat__icon">
                                    <HeartPulse size={16} />
                                </div>

                                <div>
                                    <strong>{averageWellbeing}</strong>
                                    <span>Well-being score</span>
                                </div>

                                <small>Based on sessions</small>
                            </div>

                            <div className="profile-stat">
                                <div className="profile-stat__icon">
                                    <Activity size={16} />
                                </div>

                                <div>
                                    <strong>{sessionCount}</strong>
                                    <span>Total sessions</span>
                                </div>

                                <small>Active</small>
                            </div>

                            <div className="profile-stat">
                                <div className="profile-stat__icon">
                                    <ShieldCheck size={16} />
                                </div>

                                <div>
                                    <strong>{averageConfidence}%</strong>
                                    <span>AI confidence</span>
                                </div>

                                <small>
                                    {averageConfidence >= 90
                                        ? "Excellent"
                                        : averageConfidence >= 75
                                        ? "Good"
                                        : "Developing"}
                                </small>
                            </div>

                            <div className="profile-stat">
                                <div className="profile-stat__icon">
                                    <Clock3 size={16} />
                                </div>

                                <div>
                                    <strong>{monitoringHours}h</strong>
                                    <span>Monitoring time</span>
                                </div>

                                <small>Total</small>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* =================================================
            ACTIVITY
        ================================================= */}

                <section className="profile-lower-grid">
                    <Card
                        className="profile-activity-card"
                        padding="medium"
                    >
                        <div className="profile-card-heading">
                            <div>
                                <span>RECENT ACTIVITY</span>

                                <h2>Latest account activity</h2>
                            </div>

                            <Bell size={17} />
                        </div>

                        <div className="profile-activity-list">
                            <div className="profile-activity">
                                <div className="profile-activity__icon">
                                    <HeartPulse size={14} />
                                </div>

                                <div>
                                    <strong>
                                        Completed monitoring session
                                    </strong>

                                    <span>
                                        Well-being score: 84
                                    </span>
                                </div>

                                <small>Today</small>
                            </div>

                            <div className="profile-activity">
                                <div className="profile-activity__icon">
                                    <BarChartIcon />
                                </div>

                                <div>
                                    <strong>
                                        Viewed emotional report
                                    </strong>

                                    <span>
                                        Weekly analytics
                                    </span>
                                </div>

                                <small>Yesterday</small>
                            </div>

                            <div className="profile-activity">
                                <div className="profile-activity__icon">
                                    <ShieldCheck size={14} />
                                </div>

                                <div>
                                    <strong>
                                        Privacy settings reviewed
                                    </strong>

                                    <span>
                                        Account security
                                    </span>
                                </div>

                                <small>2 days ago</small>
                            </div>
                        </div>
                    </Card>

                    <Card
                        className="profile-security-card"
                        padding="medium"
                    >
                        <div className="profile-security-icon">
                            <ShieldCheck size={19} />
                        </div>

                        <span>PRIVACY & SECURITY</span>

                        <h2>
                            Your data belongs to you.
                        </h2>

                        <p>
                            MindPulse is designed with a
                            privacy-first approach. Your emotional
                            insights and account information should
                            remain protected and under your control.
                        </p>

                        <a href="/settings">
                            Manage security
                            <Edit3 size={13} />
                        </a>
                    </Card>
                </section>

                <footer className="profile-footer">
                    <span>
                        MindPulse AI â€¢ Personal account
                    </span>

                    <span>
                        Privacy-first â€¢ Human-centric
                    </span>
                </footer>
            </section>
        </main>
    );
}

function BarChartIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M8 16v-5" />
            <path d="M12 16V7" />
            <path d="M16 16v-8" />
        </svg>
    );
}

export default Profile;