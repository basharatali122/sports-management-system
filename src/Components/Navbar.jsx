import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  UserRound,
  Edit3,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import img from "../assets/1oo.png";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth(); // ✅ fixed name

  const handleProfileClick = () => setIsDropdownOpen((prev) => !prev);
  const handleMenuToggle = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = () => {
    // ✅ use same key as in AuthContext
    localStorage.removeItem("token");

    // ✅ update context so UI re-renders instantly
    setCurrentUser(null);

    setIsDropdownOpen(false);
    setIsMenuOpen(false);

    navigate("/login");
  };

  const handleOptionClick = (option) => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    switch (option) {
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  // 🔒 Auto close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-green-300/45 border-b border-gray-200 shadow-sm transition-all duration-300 font-[Poppins]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-lg sm:text-xl tracking-tight text-emerald-700 hover:text-emerald-600 transition-all"
          >
            <img
              src={img}
              alt="VU-Sports-Society Logo"
              className="h-40 w-32 object-contain object-center align-middle"
            />
            <span className="leading-none">VU-Sports-Society</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-5">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-3 group focus:outline-none"
                >
                  <div
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white font-semibold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
                    title={currentUser.name}
                  >
                    {currentUser.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-gray-800 font-medium">
                    {currentUser.name}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 rounded-xl border border-gray-200 bg-white shadow-lg animate-fadeSlide">
                    <button
                      onClick={() => handleOptionClick("logout")}
                      className="flex items-center gap-2 w-full px-5 py-3 text-sm font-semibold text-red-600 hover:bg-gray-100 rounded-b-xl transition"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
                >
                  <LogIn size={18} /> Sign in
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
                >
                  <UserPlus size={18} /> Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={handleMenuToggle}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white animate-fadeSlideDown">
          {currentUser ? (
            <div className="flex flex-col py-3 px-5 space-y-2">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 text-white font-semibold flex items-center justify-center">
                  {currentUser.name?.[0]?.toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">
                  {currentUser.name}
                </span>
              </div>
              <button
                onClick={() => handleOptionClick("dashboard")}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-emerald-600 transition"
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>
              <button
                onClick={() => handleOptionClick("view")}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-emerald-600 transition"
              >
                <UserRound size={18} /> View Profile
              </button>
              <button
                onClick={() => handleOptionClick("edit")}
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-emerald-600 transition"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 transition"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col px-5 py-4 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition"
              >
                <LogIn size={18} /> Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
              >
                <UserPlus size={18} /> Sign up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlide { animation: fadeSlide 0.2s ease forwards; }
        .animate-fadeSlideDown { animation: fadeSlideDown 0.25s ease forwards; }
      `}</style>
    </nav>
  );
}

export default Navbar;
