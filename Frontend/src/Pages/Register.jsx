
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import registerBg from "../assets/B-800x725.jpg";

const Register = () => {

  const navigate = useNavigate();
  const { themeMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "participant",
    sport: "",
    sportsPreferences: []
  });

  const [adminExists, setAdminExists] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const sportsList = ["Cricket", "Football", "Tennis", "Hockey"];

  // ===== CHECK ADMIN EXISTS =====

  useEffect(() => {

    const checkAdmin = async () => {
      try {

        const { data } = await axios.get("http://localhost:3000/users/admin-check");
        setAdminExists(data.adminExists);

      } catch (err) {
        console.error("Admin check failed:", err);
      }
    };

    checkAdmin();

  }, []);

  // ===== INPUT HANDLER =====

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart()
    }));
  };

  // ===== PARTICIPANT SPORTS =====

  const handleSportPreference = (sport) => {

    setFormData((prev) => {

      let updated = [...prev.sportsPreferences];

      if (updated.includes(sport)) {
        updated = updated.filter((s) => s !== sport);
      } else {

        if (updated.length >= 2) {
          setMessage({
            text: "Participants can select maximum 2 sports",
            type: "error"
          });
          return prev;
        }

        updated.push(sport);
      }

      return {
        ...prev,
        sportsPreferences: updated
      };

    });
  };

  // ===== VALIDATION =====

  const validateForm = () => {

    const { name, email, password, role, sport, sportsPreferences } = formData;

    if (!name || !email || !password) {
      return "Please fill all required fields";
    }

    // NAME VALIDATION
    const nameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9 ]{3,}$/;

    if (!nameRegex.test(name)) {
      return "Name must contain at least one letter and be at least 3 characters";
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    // PASSWORD VALIDATION
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      return "Password must be at least 6 characters and include a number";
    }

    // COACH VALIDATION
    if (role === "coach" && !sport) {
      return "Coach must select a sport";
    }

    // PARTICIPANT VALIDATION
    if (role === "participant") {

      if (sportsPreferences.length === 0) {
        return "Participants must select at least one sport";
      }

      if (sportsPreferences.length > 2) {
        return "Participants can select maximum 2 sports";
      }
    }

    return null;
  };

  // ===== SUBMIT =====

  const handleSubmit = async (e) => {

    e.preventDefault();

    const error = validateForm();

    if (error) {
      setMessage({ text: error, type: "error" });
      return;
    }

    setLoading(true);

    try {

      const payload = { ...formData };

      if (payload.role !== "participant") {
        delete payload.sportsPreferences;
      }

      const res = await axios.post(
        "http://localhost:3000/users/create",
        payload
      );

      if (res.status === 201) {

        setMessage({
          text: "Registration successful! Redirecting...",
          type: "success"
        });

        setTimeout(() => navigate("/login"), 2000);
      }

    } catch (err) {

      let errorMessage = "Registration failed";

      if (err.response && err.response.data) {

        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }

        else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }

      } else if (err.request) {
        errorMessage = "Server not responding. Please try again later.";
      }

      setMessage({
        text: errorMessage,
        type: "error"
      });

    } finally {
      setLoading(false);
    }
  };

  // ===== UI =====

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-green-50 relative">

      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${registerBg})` }}
      />

      <div className="relative z-10 w-full max-w-md">

        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">

          <div className="text-center mb-6">

            <h1 className="text-2xl font-semibold text-gray-900">
              Create Account
            </h1>

            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 font-medium">
                Login
              </Link>
            </p>

          </div>

          {message.text && (
            <div
              className={`p-3 mb-4 text-sm rounded-md ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            <div>

              <label className="text-sm font-medium">
                Register as
              </label>

              <div className="flex gap-4 mt-2">

                {["participant", "coach"]
                  .concat(adminExists ? [] : ["admin"])
                  .map((role) => (

                    <label key={role} className="flex items-center gap-2 text-sm capitalize">

                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={handleChange}
                      />

                      {role}

                    </label>

                  ))}

              </div>

            </div>

            {formData.role === "coach" && (

              <select
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >

                <option value="">Select Sport</option>

                {sportsList.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}

              </select>
            )}

            {formData.role === "participant" && (

              <div>

                <label className="text-sm font-medium">
                  Select Sports (max 2)
                </label>

                <div className="grid grid-cols-2 gap-2 mt-2">

                  {sportsList.map((sport) => (

                    <label
                      key={sport}
                      className="flex items-center gap-2 text-sm border p-2 rounded cursor-pointer"
                    >

                      <input
                        type="checkbox"
                        checked={formData.sportsPreferences.includes(sport)}
                        onChange={() => handleSportPreference(sport)}
                      />

                      {sport}

                    </label>

                  ))}

                </div>

              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-teal-600 text-white rounded-md"
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