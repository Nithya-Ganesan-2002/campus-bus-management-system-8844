//
// Client runtime for LineChart.astro
// PUBLIC_INTERFACE
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

function getTextColor() {
  return document.body.classList.contains("dark-theme") ? "#e5e7eb" : "#374151";
}
function getGridColor() {
  return document.body.classList.contains("dark-theme") ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
}

// PUBLIC_INTERFACE
export function initLineCharts() {
  const canvases = document.querySelectorAll('canvas.cbms-line-chart');
  canvases.forEach((ctx) => {
    const labels = JSON.parse(ctx.dataset.labels || "[]");
    const values = JSON.parse(ctx.dataset.values || "[]");
    const color = ctx.dataset.color || "#0ea5e9";

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Bookings",
            data: values,
            fill: true,
            borderColor: color,
            backgroundColor: `${color}22`,
            pointRadius: 3,
            pointHoverRadius: 4,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: getTextColor() } },
          tooltip: { mode: "index", intersect: false },
        },
        scales: {
          x: {
            ticks: { color: getTextColor() },
            grid: { color: getGridColor() },
          },
          y: {
            ticks: { color: getTextColor() },
            grid: { color: getGridColor() },
            suggestedMin: 0,
          },
        },
      },
    });

    const observer = new MutationObserver(() => {
      const textColor = getTextColor();
      const gridColor = getGridColor();
      chart.options.plugins.legend.labels.color = textColor;
      chart.options.scales.x.ticks.color = textColor;
      chart.options.scales.y.ticks.color = textColor;
      chart.options.scales.x.grid.color = gridColor;
      chart.options.scales.y.grid.color = gridColor;
      chart.update();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLineCharts);
} else {
  initLineCharts();
}
