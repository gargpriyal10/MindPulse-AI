import { X } from "lucide-react";
import "./Modal.css";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  showCloseButton = true,
  closeOnOverlay = true,
}) {
  if (!isOpen) {
    return null;
  }

  const modalClasses = [
    "mp-modal",
    `mp-modal--${size}`,
  ].join(" ");

  const handleOverlayClick = (event) => {
    if (
      closeOnOverlay &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className="mp-modal__overlay"
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mp-modal-title"
      >
        <div className="mp-modal__header">
          <h2 id="mp-modal-title">{title}</h2>

          {showCloseButton && (
            <button
              type="button"
              className="mp-modal__close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={19} />
            </button>
          )}
        </div>

        <div className="mp-modal__body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;