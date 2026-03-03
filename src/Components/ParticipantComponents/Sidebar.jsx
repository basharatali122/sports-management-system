import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useUser from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Bookmark,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({ userType, transparent = false }) {
  const { user } = useUser();
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const bgSidebar = transparent
    ? "bg-white/5 backdrop-blur-md"
    : isDark
    ? "bg-gray-900"
    : "bg-white";

  const textColor = isDark ? "text-gray-100" : "text-gray-800";
  const hoverBg = isDark ? "hover:bg-gray-800/70" : "hover:bg-gray-100";
  const borderColor = isDark ? "border-gray-700" : "border-gray-200";
  const activeBg = isDark ? "bg-indigo-600/20" : "bg-indigo-50";
  const activeText = "text-indigo-500";

  const navItems =
    userType === "participant"
      ? [
          { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
          { label: "My Events", path: "/dashboard/register-event", icon: Calendar },
          { label: "My Teams", path: "/dashboard/join-team", icon: Users },
          { label: "Performance", path: "/dashboard/stats", icon: BarChart3 },
          { label: "Memorial", path: "/dashboard/memorial", icon: Bookmark },
        ]
      : [];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div
        className={`md:hidden fixed top-4 left-4 z-50 flex items-center justify-center p-2 rounded-md ${
          isDark
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-white hover:bg-gray-100"
        } shadow-md transition-all`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X size={24} className={isDark ? "text-white" : "text-gray-900"} />
        ) : (
          <Menu size={24} className={isDark ? "text-white" : "text-gray-900"} />
        )}
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden md:flex flex-col h-screen w-64 p-6 shadow-lg border-r ${bgSidebar} ${textColor} ${borderColor}`}
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SidebarContent
          navItems={navItems}
          location={location}
          user={user}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeText={activeText}
          isDark={isDark}
        />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className={`fixed top-0 left-0 z-40 flex flex-col h-full w-64 p-6 border-r ${bgSidebar} ${textColor} ${borderColor}`}
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <SidebarContent
              navItems={navItems}
              location={location}
              user={user}
              hoverBg={hoverBg}
              activeBg={activeBg}
              activeText={activeText}
              isDark={isDark}
              closeSidebar={() => setIsOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        * {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </>
  );
}

/* Separated Sidebar Content for reuse (Desktop + Mobile) */
function SidebarContent({
  navItems,
  location,
  user,
  hoverBg,
  activeBg,
  activeText,
  isDark,
  closeSidebar,
}) {
  return (
    <>
      {/* User Header */}
      <motion.h2
        className="text-2xl font-semibold mb-10 text-center tracking-wide"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {user?.name?.toUpperCase() || "USER"}
      </motion.h2>

      {/* Nav Items */}
      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <motion.div
              key={label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={closeSidebar}
            >
              <Link
                to={path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? `${activeBg} ${activeText} font-semibold`
                    : `${hoverBg}`
                }`}
              >
                <Icon
                  size={20}
                  className={`transition-colors ${
                    isActive
                      ? activeText
                      : isDark
                      ? "text-gray-300"
                      : "text-gray-500"
                  }`}
                />
                <span>{label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 text-xs opacity-60 text-center">
        <p>© {new Date().getFullYear()} DigitalArena</p>
      </div>
    </>
  );
}
