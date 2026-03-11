import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Users, Calendar, Trophy, Activity, PieChart, BarChart } from "lucide-react";
import axios from "axios";

// Register chart elements
ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Reports() {
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  const [stats, setStats] = useState(null); // null until data loads
  const [loading, setLoading] = useState(true);

  // Fetch report data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/admin/stats", {
          withCredentials: true,
        });

        // Validate response to prevent undefined datasets
        if (
          data &&
          typeof data.users === "number" &&
          typeof data.teams === "number" &&
          typeof data.events === "number" &&
          typeof data.sports === "number"
        ) {
          setStats(data);
        } else {
          // fallback if response is not as expected
          setStats({ users: 0, teams: 0, events: 0, sports: 0 });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({ users: 0, teams: 0, events: 0, sports: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen text-lg ${
          isDark ? "text-gray-200 bg-gray-900" : "text-gray-700 bg-gray-50"
        }`}
      >
        Loading reports...
      </div>
    );
  }

  // Chart Data (only after stats exists)
  const barData = {
    labels: ["Users", "Teams", "Events", "Sports"],
    datasets: [
      {
        label: "Activity Overview",
        data: [stats.users, stats.teams, stats.events, stats.sports],
        backgroundColor: isDark
          ? ["#60A5FA", "#34D399", "#FBBF24", "#F87171"]
          : ["#2563EB", "#059669", "#F59E0B", "#DC2626"],
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ["Users", "Teams", "Events", "Sports"],
    datasets: [
      {
        data: [stats.users, stats.teams, stats.events, stats.sports],
        backgroundColor: ["#2563EB", "#059669", "#F59E0B", "#DC2626"],
        borderWidth: 2,
      },
    ],
  };

  const cards = [
    { label: "Total Users", value: stats.users, icon: <Users />, color: "from-blue-500 to-blue-600" },
    { label: "Active Teams", value: stats.teams, icon: <Trophy />, color: "from-green-500 to-emerald-600" },
    { label: "Total Events", value: stats.events, icon: <Calendar />, color: "from-yellow-500 to-amber-600" },
    { label: "Sports Categories", value: stats.sports, icon: <Activity />, color: "from-red-500 to-pink-600" },
  ];

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-colors duration-300 font-[Poppins] ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center text-blue-500"
      >
        Statistics Overview
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${card.color} text-white flex items-center justify-between`}
          >
            <div>
              <p className="text-sm opacity-90">{card.label}</p>
              <h3 className="text-3xl font-semibold">{card.value}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">{card.icon}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl shadow-md p-6 border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-blue-500" /> Activity Distribution
          </h2>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: { mode: "index" },
              },
              scales: {
                x: { grid: { display: false } },
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                  grid: { color: isDark ? "#374151" : "#E5E7EB" },
                },
              },
            }}
          />
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl shadow-md p-6 border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-500" /> Category Breakdown
          </h2>
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: isDark ? "#E5E7EB" : "#374151",
                    font: { size: 12 },
                  },
                },
              },
            }}
          />
        </motion.div>
      </div>

      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
}
