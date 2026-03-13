import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; 
import { ThemeContext } from "../context/ThemeContext";
import loginBg from "../assets/loginBg.jpg";

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { setCurrentUser } = useAuth(); 
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const { email, password } = formData;
    if (!email.trim() || !password.trim()) {
      return setMessage({
        text: "Please fill in both email and password.",
        type: "error",
      });
    }

    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const token = data.token || data.data?.token;
      if (!token) throw new Error("Token missing from response");

      // ✅ Save token and fetch user data
      localStorage.setItem("token", token);
      const userRes = await axios.get("http://localhost:3000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = userRes.data;
      console.log("Logged in user:", user); // ✅ log user data
      setCurrentUser(user); // ✅ update AuthContext immediately

      setMessage({
        text: "Login successful! Redirecting...",
        type: "success",
      });

      const redirectPath =
        location.state?.from?.pathname ||
        (user.role === "admin"
          ? "/admin"
          : user.role === "coach"
          ? "/coach-dashboard"
          : user.role === "participant"
          ? "/dashboard"
          : "/");
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);
    } catch (err) {

  let msg = "Something went wrong.";

  if (err.response?.data?.message) msg = err.response.data.message;
  else if (err.response?.data?.error) msg = err.response.data.error;
  else if (err.request) msg = "Server not responding. Try again later.";
  else msg = err.message;

  setMessage({
    text: msg,
    type: "error"
  });

} finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div
          className={`rounded-2xl shadow-lg border border-gray-200 p-8 ${
            isDark
              ? "bg-gray-900 text-white border-gray-700"
              : "bg-white text-gray-900"
          }`}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 text-teal-600 rounded-full mb-3 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-1">Welcome Back</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

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

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-medium block">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-transparent dark:border-gray-600"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium block">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-transparent dark:border-gray-600"
                  placeholder="••••••••"
                  required
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                Remember me
              </label>
              <a
                href="forget-password"
                className="text-teal-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-md text-white font-medium text-sm shadow-md transition-all duration-150
                ${
                  loading
                    ? "bg-teal-300 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700"
                }
              `}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-teal-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
