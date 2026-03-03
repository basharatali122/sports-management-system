import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import toast from "react-hot-toast";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { ThemeContext } from "../../context/ThemeContext";
import useUser from "../../context/UserContext";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const statsData = {
  2023: {
    wins: 11,
    losses: 7,
    mvps: 3,
    recentMatches: [
      { id: 1, opponent: "Uni A", result: "Win", score: "3-1", date: "2023-10-01" },
      { id: 2, opponent: "Uni B", result: "Loss", score: "1-2", date: "2023-09-24" },
      { id: 3, opponent: "Uni C", result: "Win", score: "2-0", date: "2023-09-15" },
      { id: 4, opponent: "Uni D", result: "Win", score: "4-3", date: "2023-09-08" },
    ],
  },
  2024: {
    wins: 15,
    losses: 7,
    mvps: 5,
    recentMatches: [
      { id: 1, opponent: "Uni X", result: "Win", score: "4-2", date: "2024-05-01" },
      { id: 2, opponent: "Uni Y", result: "Win", score: "3-0", date: "2024-04-25" },
      { id: 3, opponent: "Uni Z", result: "Loss", score: "0-1", date: "2024-04-15" },
      { id: 4, opponent: "Uni W", result: "Win", score: "5-1", date: "2024-04-10" },
    ],
  },
};

const StatCard = ({ label, value, previous, gradient }) => {
  const [displayValue, setDisplayValue] = useState(0);
  

  useEffect(() => {
    let start = 0;
    const end = value;
    const step = end / 20;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(Math.round(start));
    }, 25);
    return () => clearInterval(timer);
  }, [value]);

  const trend =
    previous === undefined ? null : value > previous ? "▲" : value < previous ? "▼" : "=";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center min-w-[140px] bg-gradient-to-br ${gradient} backdrop-blur-lg transition-transform`}
    >
      <div className="text-4xl font-bold flex items-center gap-2">
        {displayValue} <span className="text-sm">{trend}</span>
      </div>
      <div className="mt-2 text-lg uppercase tracking-wide font-semibold opacity-90">
        {label}
      </div>
    </motion.div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <span className="opacity-70">{label}:</span>{" "}
    <span className="font-medium">{value}</span>
  </div>
);

const UserStatsDashboard = () => {
  const { user } = useUser();
  


  const { theme } = useContext(ThemeContext);
  
  const [selectedSeason, setSelectedSeason] = useState("2024");
  const stats = statsData[selectedSeason];
  const prevStats = statsData[(parseInt(selectedSeason) - 1).toString()];
  const isDark = theme === "dark";

  // Prepare chart data
  const chartData = {
    labels: Object.keys(statsData),
    datasets: [
      {
        label: "Wins",
        data: Object.keys(statsData).map((year) => statsData[year].wins),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Losses",
        data: Object.keys(statsData).map((year) => statsData[year].losses),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "MVPs",
        data: Object.keys(statsData).map((year) => statsData[year].mvps),
        borderColor: "#facc15",
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          font: { family: "Poppins" },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#9ca3af" : "#374151",
          font: { family: "Poppins" },
        },
        grid: { color: isDark ? "#374151" : "#e5e7eb" },
      },
      y: {
        ticks: {
          color: isDark ? "#9ca3af" : "#374151",
          font: { family: "Poppins" },
        },
        grid: { color: isDark ? "#374151" : "#e5e7eb" },
      },
    },
  };

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-colors duration-300 font-[Poppins] ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Player Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl shadow-lg backdrop-blur-xl ${
            isDark
              ? "bg-gray-800/70 border border-gray-700"
              : "bg-white/70 border border-gray-200"
          }`}
        >
          <img
            src={user?.avatar || "https://via.placeholder.com/80"}
            alt={user?.name || "Player"}
            className="rounded-full border-4 border-green-400 w-24 h-24 object-cover"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 text-sm w-full">
            <Info label="Name" value={user?.name || "John Doe"} />
            <Info label="Email" value={user?.email || "johndoe@example.com"} />
            <Info label="Team" value={user?.team || "University Team"} />
            <Info label="Position" value={user?.position || "Forward"} />
            <Info label="Jersey No" value={user?.jersey || "10"} />
            <Info label="Years Active" value={user?.years || "2021 - Present"} />
            <Info label="Age" value={user?.age || "21"} />
            <Info label="Height / Weight" value={user?.hw || `5'11" / 72kg`} />
            <Info label="Sport" value={user?.sport || "Football"} />
            <Info label="Coach" value={user?.coach || "Mr. Allen Smith"} />
          </div>
        </motion.div>

        {/* Season Selector */}
        <div className="text-center">
          <label htmlFor="season" className="mr-3 text-lg font-medium">
            Select Season:
          </label>
          <select
            id="season"
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className={`rounded-xl px-4 py-2 border focus:outline-none ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {Object.keys(statsData).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <StatCard
            label="Wins"
            value={stats.wins}
            previous={prevStats?.wins}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            label="Losses"
            value={stats.losses}
            previous={prevStats?.losses}
            gradient="from-red-500 to-rose-600"
          />
          <StatCard
            label="MVP Awards"
            value={stats.mvps}
            previous={prevStats?.mvps}
            gradient="from-yellow-400 to-amber-500"
          />
        </motion.div>

        {/* Chart.js Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl shadow-lg backdrop-blur-xl ${
            isDark
              ? "bg-gray-800/70 border border-gray-700"
              : "bg-white/70 border border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold mb-6 text-center text-yellow-500">
            Season Performance Overview
          </h2>
          <Line data={chartData} options={chartOptions} />
        </motion.div>
      </div>
    </div>
  );
};

export default UserStatsDashboard;
