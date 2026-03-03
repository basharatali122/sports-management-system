import React, { useContext } from 'react';
import Sidebar from '../Components/ParticipantComponents/Sidebar';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';
import MainBg from "../assets/bg.jpg";

export default function ParticipantDashboard() {
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === 'dark';

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = isDark ? 'text-white' : 'text-gray-900';

  return (
    <div className={`relative flex min-h-screen ${bgColor} ${textColor}`}>
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img
          src={MainBg}
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      <motion.div
        className="w-64"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Sidebar userType="participant" transparent />
      </motion.div>

      {/* Main content */}
      <motion.main
        className="flex-1 p-6 overflow-y-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
