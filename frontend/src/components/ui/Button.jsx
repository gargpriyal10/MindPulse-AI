import { Loader2 } from "lucide-react";
import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  onClick,
  className = "",
}) {
  const buttonClasses = [
    "mp-button",
    `mp-button--${variant}`,
    `mp-button--${size}`,
    fullWidth ? "mp-button--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader2 className="mp-button__loader" size={18} />
      ) : (
        icon && <span className="mp-button__icon">{icon}</span>
      )}

      <span className="mp-button__label">
        {loading ? "Please wait..." : children}
      </span>
    </button>
  );
}

export default Button;