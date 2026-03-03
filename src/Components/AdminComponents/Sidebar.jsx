import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import useUser from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import { User, Users, Calendar, MessageSquare, FileText, Trophy } from "lucide-react";

const navItems = [
  { label: "View Users", path: "/admin/user-management", icon: <Users className="w-5 h-5" /> },
  { label: "Create Events", path: "/admin/pending-event", icon: <Calendar className="w-5 h-5" /> },
  { label: "Create Teams", path: "/admin/pending-teams", icon: <User className="w-5 h-5" /> },
  { label: "Categories", path: "/admin/sports-categories", icon: <Trophy className="w-5 h-5" /> },
  { label: "Reports", path: "/admin/reports", icon: <FileText className="w-5 h-5" /> },
];

export default function Sidebar() {
  const { user } = useUser() || {};
  const { themeMode } = useContext(ThemeContext);
  const location = useLocation();

  const isDark = themeMode === "dark";

  // Theme Styles
  const sidebarBg = isDark
    ? "bg-gray-900/70 backdrop-blur-xl border-gray-800"
    : "bg-white/80 backdrop-blur-md border-gray-200";
  const headingColor = isDark ? "text-white" : "text-gray-900";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";
  const hoverBg = isDark ? "hover:bg-gray-800/60" : "hover:bg-emerald-50";
  const activeBg = isDark ? "bg-emerald-700 text-emerald-200" : "bg-emerald-100 text-emerald-700";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-64 h-screen border-r ${sidebarBg} ${borderColor} shadow-xl flex flex-col transition-all duration-500 font-[Poppins]`}
    >
      {/* User Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center py-6 border-b border-gray-700/20"
      >
        <div
          className={`h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
        >
          {user?.name?.[0]?.toUpperCase() || "login"}
        </div>
        <h2 className={`mt-3 text-lg text-center font-semibold ${headingColor}`}>
          {user?.name || ""} <br />
          {user?.email || ""}
        </h2>
      </motion.div>

      {/* Nav Items */}
      <nav className="flex-1 mt-6 space-y-2 px-4">
        {navItems.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <motion.div key={label} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300 }}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm md:text-base transition-all duration-300
                  ${isActive ? activeBg : `${hoverBg} ${textColor}`}
                `}
              >
                <span className="flex items-center">{icon}</span>
                <span>{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/20 text-center text-xs text-gray-500">
        <p className="opacity-80">© 2025 VU-Sports-Society</p>
      </div>

      {/* Poppins Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </motion.aside>
  );
}
