import { LoaderCircle } from "lucide-react";
import "./Loader.css";

function Loader({
  size = "medium",
  text = "",
  fullScreen = false,
}) {
  const loaderClasses = [
    "mp-loader",
    `mp-loader--${size}`,
    fullScreen ? "mp-loader--fullscreen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={loaderClasses}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className="mp-loader__icon" />

      {text && (
        <span className="mp-loader__text">
          {text}
        </span>
      )}
    </div>
  );
}

export default Loader;