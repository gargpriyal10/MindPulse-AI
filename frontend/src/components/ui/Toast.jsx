import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react";

import "./Toast.css";

const toastIcons = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

function Toast({
  type = "info",
  title,
  message,
  onClose,
}) {
  const Icon = toastIcons[type] || Info;

  return (
    <div
      className={`mp-toast mp-toast--${type}`}
      role="alert"
    >
      <div className="mp-toast__icon">
        <Icon size={19} />
      </div>

      <div className="mp-toast__content">
        {title && (
          <strong>{title}</strong>
        )}

        {message && (
          <p>{message}</p>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          className="mp-toast__close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default Toast;