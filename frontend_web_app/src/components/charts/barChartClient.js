//
// Client runtime for BarChart.astro
// PUBLIC_INTERFACE
// Initializes all canvases whose id starts with "bar-chart-canvas-"
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

function getTextColor() {
  return document.body.classList.contains("dark-theme") ? "#e5e7eb" : "#374151";
}
function getGridColor() {
  return document.body.classList.contains("dark-theme") ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
}

// PUBLIC_INTERFACE
export function initBarCharts() {
  const canvases = document.querySelectorAll('canvas.cbms-bar-chart');
  canvases.forEach((ctx) => {
    const labels = JSON.parse(ctx.dataset.labels || "[]");
    const values = JSON.parse(ctx.dataset.values || "[]");
    const color = ctx.dataset.color || "#1e40af";

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Avg. Occupancy (%)",
            data: values,
            backgroundColor: `${color}22`,
            borderColor: color,
            borderWidth: 1.5,
            borderRadius: 6,
            maxBarThickness: 28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2,
        plugins: {
          legend: { display: true, labels: { color: getTextColor() } },
          tooltip: { mode: "index", intersect: false },
          title: { display: false },
        },
        scales: {
          x: {
            ticks: { color: getTextColor() },
            grid: { color: getGridColor() },
          },
          y: {
            ticks: { color: getTextColor(), callback: (v) => v + "%" },
            grid: { color: getGridColor() },
            suggestedMin: 0,
            suggestedMax: 100,
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
  document.addEventListener("DOMContentLoaded", initBarCharts);
} else {
  initBarCharts();
}
