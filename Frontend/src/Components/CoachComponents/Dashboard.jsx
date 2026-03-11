import { Link, Outlet } from "react-router-dom";
import DashboardCard from "./DashboardCard";
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

// Lucide icons
import {
  Users,
  CalendarDays,
  UserPlus,
  MessageSquare,
  FileBarChart,
  ClipboardList,
} from "lucide-react";

const cards = [
  {
    title: "Schedule Events",
    icon: <CalendarDays className="w-6 h-6 text-blue-500" />,
    path: "/coach-dashboard/create-events",
  },
  {
    title: "Schedule Teams",
    icon: <UserPlus className="w-6 h-6 text-teal-500" />,
    path: "/coach-dashboard/create-teams",
  },
  {
    title: "Reports",
    icon: <FileBarChart className="w-6 h-6 text-rose-500" />,
    path: "/coach-dashboard/reports",
  },
  {
    title: "Event Registrations",
    icon: <ClipboardList className="w-6 h-6 text-amber-500" />,
    path: "/coach-dashboard/eventRegister",
  }
];

export default function DashboardCoach() {
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  const bgColor = isDark ? "bg-black" : "bg-gray-50";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const headerColor = isDark ? "text-gray-200" : "text-gray-800";
  const dividerColor = isDark ? "border-gray-800" : "border-gray-200";

  return (
    <div
      className={`min-h-screen w-full ${bgColor} ${textColor} transition-colors duration-300 font-[Poppins]`}
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold ${headerColor}`}>
              Coach Dashboard
            </h1>
            <p
              className={`text-sm md:text-base mt-2 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage your teams, events, and participants with ease.
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className={`border-t mt-6 ${dividerColor}`} />
      </div>

      {/* Cards Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 md:px-10 pb-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link to={card.path}>
                <DashboardCard {...card} />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Outlet />

      {/* Poppins font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
