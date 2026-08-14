import "./Card.css";

function Card({
  children,
  title = "",
  subtitle = "",
  icon = null,
  action = null,
  variant = "default",
  padding = "medium",
  hoverable = false,
  className = "",
  onClick,
}) {
  const cardClasses = [
    "mp-card",
    `mp-card--${variant}`,
    `mp-card--padding-${padding}`,
    hoverable ? "mp-card--hoverable" : "",
    onClick ? "mp-card--clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={cardClasses}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                onClick(event);
              }
            }
          : undefined
      }
    >
      {(title || subtitle || icon || action) && (
        <div className="mp-card__header">
          <div className="mp-card__heading">
            {icon && (
              <div className="mp-card__icon">
                {icon}
              </div>
            )}

            <div>
              {title && (
                <h3 className="mp-card__title">
                  {title}
                </h3>
              )}

              {subtitle && (
                <p className="mp-card__subtitle">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {action && (
            <div className="mp-card__action">
              {action}
            </div>
          )}
        </div>
      )}

      <div className="mp-card__body">
        {children}
      </div>
    </section>
  );
}

export default Card;