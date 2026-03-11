import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import useUser from "../../context/UserContext";
import { Users, CalendarDays, Users2, MessageSquare, BarChart3 } from "lucide-react";

const navItems = [
  { label: "Create Events", path: "/coach-dashboard/create-events", icon: <CalendarDays size={18} /> },
  { label: "Create Teams", path: "/coach-dashboard/create-teams", icon: <Users2 size={18} /> },
  { label: "Reports", path: "/coach-dashboard/reports", icon: <BarChart3 size={18} /> },
  {label: "Manage Participants", path: "/coach-dashboard/view-users",
   icon: <Users size={18} />}
];

export default function Sidebar() {
  const { themeMode } = useContext(ThemeContext);
  const { user } = useUser();
  const location = useLocation();
  const isDark = themeMode === "dark";

  const bgSidebar = isDark ? "bg-black" : "bg-white";
  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const hoverBg = isDark ? "hover:bg-neutral-900" : "hover:bg-gray-100";
  const activeBg = isDark ? "bg-neutral-900" : "bg-gray-100";
  const borderColor = isDark ? "border-neutral-800" : "border-gray-200";

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-64 h-screen ${bgSidebar} ${textPrimary} shadow-lg flex flex-col p-6 border-r ${borderColor} transition-all duration-300 font-[Poppins]`}
    >
      <h2 className="text-2xl font-semibold mb-10 text-center">{user?.sport ?? "Coach"}</h2>

      <nav className="flex-1 space-y-2">
        {navItems.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <motion.div key={label} whileHover={{ x: 6 }}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                  ${isActive ? activeBg : ""} ${hoverBg}`}
              >
                {icon}
                <span>{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
      {/* Bottom User Section */}
      <div
        className={`p-5 border-t ${borderColor} ${
          isDark ? "bg-gray-950/70" : "bg-gray-50"
        } flex items-center gap-3`}
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-white/5 flex items-center justify-center text-white font-bold text-lg">
          {user?.name?.[0]?.toUpperCase() || "C"}
        </div>
        <div>
          <p className="font-semibold text-sm">{user?.name || "Coach"}</p>
          <p className="text-xs opacity-70 capitalize">{user?.role || "coach"}</p>
        </div>
      </div>
    </motion.aside>
    
  );
}
