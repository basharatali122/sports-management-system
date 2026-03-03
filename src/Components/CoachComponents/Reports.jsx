// src/components/coachdashboard/Reports.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Users,
  Trophy,
  Activity,
  CalendarDays,
  BarChart2,
  TrendingUp,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

export default function Reports() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dark = theme === "dark";

  // Theme-based colors
  const textColor = dark ? "#e5e7eb" : "#111827";
  const gridColor = dark ? "rgba(75,75,75,0.3)" : "rgba(220,220,220,0.5)";

  // Static Demo Data
  const stats = [
    {
      label: "Total Teams",
      value: 12,
      icon: <Users className="w-6 h-6 text-blue-500" />,
      color: "bg-blue-600",
    },
    {
      label: "Ongoing Events",
      value: 5,
      icon: <CalendarDays className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-600",
    },
    {
      label: "Trophies Won",
      value: 8,
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
      color: "bg-amber-600",
    },
    {
      label: "Active Players",
      value: 64,
      icon: <Activity className="w-6 h-6 text-rose-500" />,
      color: "bg-rose-600",
    },
  ];

  // Charts Data
  const teamPerformanceData = {
    labels: ["Football", "Basketball", "Tennis", "Cricket", "Hockey"],
    datasets: [
      {
        label: "Win Rate (%)",
        data: [85, 78, 66, 90, 72],
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#6366f1",
        ],
      },
    ],
  };

  const eventParticipationData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Participants",
        data: [50, 75, 100, 120, 90, 130],
        fill: true,
        backgroundColor: "rgba(37, 99, 235, 0.2)",
        borderColor: "#3b82f6",
        tension: 0.3,
      },
    ],
  };

  const categoryBarData = {
    labels: ["Junior", "Senior", "Amateur", "Pro"],
    datasets: [
      {
        label: "Team Count",
        data: [6, 8, 4, 10],
        backgroundColor: "#10b981",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: textColor } } },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } },
    },
  };

  return (
    <div
      className={`min-h-screen ${
        dark ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"
      } font-[Poppins] p-6 md:p-10 transition-colors duration-300`}
    >
      {/* Header Section with Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Performance <span className="text-teal-600">Reports</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Insightful overview of teams, participation, and achievements.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm ${
              dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
            } hover:shadow-lg transition`}
          >
            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doughnut Chart */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`p-6 rounded-2xl border shadow-sm ${
            dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Team Performance</h2>
          </div>
          <Doughnut
            data={teamPerformanceData}
            options={{
              plugins: {
                legend: { position: "bottom", labels: { color: textColor } },
              },
            }}
          />
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`p-6 rounded-2xl border shadow-sm ${
            dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold">Category Breakdown</h2>
          </div>
          <Bar data={categoryBarData} options={chartOptions} />
        </motion.div>

        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`p-6 rounded-2xl border shadow-sm ${
            dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold">Event Participation Trend</h2>
          </div>
          <Line data={eventParticipationData} options={chartOptions} />
        </motion.div>
      </div>

      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
}
