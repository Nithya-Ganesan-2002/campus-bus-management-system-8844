//
// Client runtime for PieChart.astro
// PUBLIC_INTERFACE
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

function getTextColor() {
  return document.body.classList.contains("dark-theme") ? "#e5e7eb" : "#374151";
}

// PUBLIC_INTERFACE
export function initPieCharts() {
  const canvases = document.querySelectorAll('canvas.cbms-pie-chart');
  canvases.forEach((ctx) => {
    const labels = JSON.parse(ctx.dataset.labels || "[]");
    const values = JSON.parse(ctx.dataset.values || "[]");
    const colors = JSON.parse(ctx.dataset.colors || "[]");

    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors.map((c) => `${c}cc`),
            borderColor: colors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: getTextColor(), boxWidth: 12, usePointStyle: true, pointStyle: "circle" }
          },
          tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}` } },
        },
      },
    });

    const observer = new MutationObserver(() => {
      chart.options.plugins.legend.labels.color = getTextColor();
      chart.update();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPieCharts);
} else {
  initPieCharts();
}
