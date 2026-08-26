import { Maximize2 } from "lucide-react";

import Card from "../ui/Card";

import "./ChartContainer.css";

function ChartContainer({
  title,
  subtitle,
  children,
  action = null,
  height = 320,
  onExpand,
}) {
  return (
    <Card
      className="chart-container"
      title={title}
      subtitle={subtitle}
      action={
        action || (
          onExpand && (
            <button
              type="button"
              className="chart-container__expand"
              onClick={onExpand}
              aria-label="Expand chart"
            >
              <Maximize2 size={16} />
            </button>
          )
        )
      }
      padding="medium"
    >
      <div
        className="chart-container__canvas"
        style={{ height: `${height}px` }}
      >
        {children}
      </div>
    </Card>
  );
}

export default ChartContainer;