import React, { useContext } from "react";
import Sidebar from "../Components/AdminComponents/Sidebar";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  const mainBg = isDark
    ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
    : "bg-gradient-to-br from-emerald-50 via-white to-emerald-100";

  const sidebarBg = isDark
    ? "bg-gray-900/70 border-gray-800 text-gray-100 backdrop-blur-xl"
    : "bg-white/80 border-gray-200 text-gray-900 backdrop-blur-md";

  const headingColor = isDark ? "text-gray-100" : "text-gray-800";

  return (
    <div
      className={`flex min-h-screen ${mainBg} transition-all duration-500 font-[Poppins]`}
    >
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col w-64 border-r shadow-xl ${sidebarBg} transition-all duration-500`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 relative overflow-y-auto transition-colors duration-500`}
      >
        {/* Sticky Header */}
        <div
          className={`sticky top-0 z-40 px-6 py-4 border-b ${
            isDark
              ? "bg-gray-900/80 border-gray-800 backdrop-blur-xl"
              : "bg-white/70 border-gray-200 backdrop-blur-xl"
          } flex items-center justify-between shadow-sm`}
        >
          <h1
            className={`text-2xl md:text-3xl font-bold tracking-tight ${headingColor}`}
          >
            Admin Dashboard
          </h1>
          <div
            className={`hidden md:flex items-center text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <span className="mr-2">🔒 Secure Area</span>
            <span className="text-emerald-500 font-semibold">|</span>
            <span className="ml-2">Welcome Back</span>
          </div>
        </div>

        {/* Main Body */}
        <motion.div
          className={`p-6 md:p-10 min-h-[calc(100vh-64px)]`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className={`rounded-2xl shadow-lg border ${
              isDark
                ? "bg-gray-900/60 border-gray-800"
                : "bg-white/70 h-full border-gray-200"
            } backdrop-blur-md px-6 py-8`}
          >
            

            {/* Outlet for Nested Routes */}
            <Outlet />
          </div>
        </motion.div>
      </main>

      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
