import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Chart from "chart.js/auto";

export default function DashboardCard({
  title,
  icon,
  sub = [],
  type,
  value,
  chartData = [],
}) {
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";
  const chartRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(0);

  const cardBg = isDark
    ? "bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-gray-900/80 text-gray-100 border-gray-700"
    : "bg-gradient-to-br from-white via-emerald-50 to-white text-gray-800 border-emerald-100";

  const hoverGlow = isDark
    ? "hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
    : "hover:shadow-[0_0_20px_rgba(5,150,105,0.25)]";

  // Animate number for stats
  useEffect(() => {
    if (!value) return;
    let start = 0;
    const increment = value / 20;
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(timer);
      }
      setDisplayValue(Math.round(start));
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  // Chart.js setup
  useEffect(() => {
    if (type !== "chart" || !chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Reports Trend",
            data: chartData,
            borderColor: isDark ? "#10B981" : "#059669",
            backgroundColor: isDark
              ? "rgba(16,185,129,0.15)"
              : "rgba(5,150,105,0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: isDark ? "#d1fae5" : "#064e3b",
              font: { family: "Poppins", size: 12 },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: isDark ? "#e5e7eb" : "#374151" },
            grid: { color: isDark ? "#374151" : "#d1d5db" },
          },
          y: {
            ticks: { color: isDark ? "#e5e7eb" : "#374151" },
            grid: { color: isDark ? "#374151" : "#d1d5db" },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [isDark, chartData, type]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-6 border shadow-lg ${cardBg} ${hoverGlow} transition-all duration-300 backdrop-blur-md cursor-pointer`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{icon}</div>
          <h3 className="text-lg md:text-xl font-semibold tracking-wide">{title}</h3>
        </div>
        {value && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-emerald-500"
          >
            {displayValue}
          </motion.span>
        )}
      </div>

      {/* Sub items */}
      {sub.length > 0 && (
        <ul className="mt-3 text-sm opacity-90 list-disc list-inside space-y-1">
          {sub.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}

      {/* Chart */}
      {type === "chart" && (
        <div className="mt-5 h-32">
          <canvas ref={chartRef} className="w-full h-full" />
        </div>
      )}
    </motion.div>
  );
}
