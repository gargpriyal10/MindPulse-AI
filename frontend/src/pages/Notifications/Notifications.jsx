import { useEffect, useState } from "react";
import { Bell, Check, Clock, RefreshCw } from "lucide-react";
import Card from "../../components/ui/Card";
import {
    getNotifications,
    markNotificationAsRead,
} from "../../services/api";
import "./Notifications.css";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const loadNotifications = async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getNotifications();
            setNotifications(data.notifications || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Notifications load nahi ho paayi."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const markAsRead = async (id) => {
        setUpdatingId(id);
        setError("");

        try {
            await markNotificationAsRead(id);

            setNotifications((current) =>
                current.map((item) =>
                    item.id === id ? { ...item, is_read: true } : item
                )
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Notification update nahi ho paayi."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const unreadCount = notifications.filter(
        (item) => !item.is_read
    ).length;

    return (
        <main className="notifications-page">
            <header className="notifications-header">
                <div>
                    <span className="notifications-eyebrow">
                        YOUR UPDATES
                    </span>
                    <h1>Notifications</h1>
                    <p>
                        Stay updated with your MindPulse activity.
                    </p>
                </div>

                <button
                    type="button"
                    className="notifications-refresh"
                    onClick={loadNotifications}
                    disabled={loading}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </header>

            <Card className="notifications-summary" padding="medium">
                <Bell size={22} />
                <div>
                    <strong>{unreadCount} unread</strong>
                    <span>
                        You have {notifications.length} total notifications.
                    </span>
                </div>
            </Card>

            {error && (
                <p className="notifications-error" role="alert">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="notifications-message">
                    Loading notifications...
                </p>
            ) : notifications.length === 0 ? (
                <Card className="notifications-empty" padding="medium">
                    <Bell size={30} />
                    <h2>No notifications yet</h2>
                    <p>
                        Your updates will appear here when available.
                    </p>
                </Card>
            ) : (
                <section className="notifications-list">
                    {notifications.map((item) => (
                        <Card
                            key={item.id}
                            className={`notification-item ${item.is_read ? "notification-item--read" : ""
                                }`}
                            padding="medium"
                        >
                            <div className="notification-item__icon">
                                <Bell size={18} />
                            </div>

                            <div className="notification-item__content">
                                <div className="notification-item__title">
                                    <h2>{item.title}</h2>
                                    {!item.is_read && (
                                        <span className="notification-unread-dot" />
                                    )}
                                </div>

                                <p>{item.message}</p>

                                <span className="notification-date">
                                    <Clock size={13} />
                                    {item.created_at}
                                </span>
                            </div>

                            {!item.is_read && (
                                <button
                                    type="button"
                                    className="notification-read-button"
                                    onClick={() => markAsRead(item.id)}
                                    disabled={updatingId === item.id}
                                >
                                    <Check size={14} />
                                    {updatingId === item.id
                                        ? "Saving..."
                                        : "Mark as read"}
                                </button>
                            )}
                        </Card>
                    ))}
                </section>
            )}
        </main>
    );
}

export default Notifications;
