import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import registerBg from "../assets/B-800x725.jpg";

// === ICONS ===
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const { themeMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "participant",
    sport: "",
  });

  const [adminExists, setAdminExists] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // === INIT ===
  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/users/admin-check");
        setAdminExists(data.adminExists);
      } catch (err) {
        console.error("Admin check failed:", err);
      }
    };
    init();
  }, []);

  // === HANDLERS ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, password, role, sport } = formData;
    if (!name || !email || !password) return "Please fill in all required fields.";
    if (role === "coach" && !sport) return "Please select a sport if you are a coach.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const error = validateForm();
    if (error) return setMessage({ text: error, type: "error" });

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/users/create", formData);
      if (res.status === 201) {
        setMessage({ text: "Registration successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Registration failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // === UI ===
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-green-50 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${registerBg})` }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 text-teal-600 rounded-full mb-3 shadow-sm">
              <UserIcon />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Create Account</h1>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-teal-600 hover:underline">
                Login
              </Link>
            </p>
          </div>

          {/* Feedback Message */}
          {message.text && (
            <div
              className={`p-3 mb-4 text-sm rounded-md ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-800">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-800">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-800">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  placeholder="Create a password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-teal-500"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-gray-800">Register as</label>
              <div className="mt-2 flex gap-5 flex-wrap">
                {["participant", "coach"].concat(adminExists ? [] : ["admin"]).map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 text-sm text-gray-700 capitalize cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            {/* Sport Selection */}
            {formData.role === "coach" && (
              <div>
                <label className="text-sm font-medium text-gray-800">Select Sport</label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                >
                  <option value="">-- Select Sport --</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Hockey">Hockey</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-md text-white font-medium text-sm shadow-md transition-all duration-150
                ${loading ? "bg-teal-300 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}
              `}
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
