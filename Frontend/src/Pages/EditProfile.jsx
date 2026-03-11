import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sportsPreferences: "",
    achievements: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const { data } = await axios.get(
          "http://localhost:3000/users/profile/getProfile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const user = data.user;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          sportsPreferences: user.sportsPreferences?.join(", ") || "",
          achievements: user.achievements?.join(", ") || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    const updatedData = {
      ...formData,
      sportsPreferences: formData.sportsPreferences
        .split(",")
        .map((i) => i.trim()),
      achievements: formData.achievements.split(",").map((i) => i.trim()),
    };

    try {
      setSubmitting(true);
      await axios.put(
        "http://localhost:3000/users/profile/updateProfile",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p
          className={`text-lg font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          } animate-pulse`}
        >
          Loading profile...
        </p>
      </div>
    );

  return (
    <div
      className={`min-h-[100dvh] flex items-center justify-center px-4 py-12 transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
          : "bg-gradient-to-br from-gray-50 via-white to-blue-50"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-2xl rounded-3xl shadow-2xl border backdrop-blur-xl px-8 py-10 ${
          isDark
            ? "bg-gray-900/80 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className={`text-4xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Edit Profile
          </h1>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Keep your profile details up-to-date ✨
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            {
              label: "Name",
              name: "name",
              type: "text",
              placeholder: "John Doe",
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "john@example.com",
            },
            {
              label: "Sports Preferences",
              name: "sportsPreferences",
              type: "text",
              placeholder: "Football, Badminton, Chess",
              helper: "comma-separated",
            },
            {
              label: "Achievements",
              name: "achievements",
              type: "text",
              placeholder: "Won college football cup, MVP 2024",
              helper: "comma-separated",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <label
                className={`block mb-2 text-sm font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {f.label}{" "}
                {f.helper && (
                  <span className="text-xs font-normal text-gray-500">
                    ({f.helper})
                  </span>
                )}
              </label>
              <input
                type={f.type}
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className={`w-full px-4 py-3 rounded-xl shadow-sm border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                }`}
                required={f.name !== "achievements"}
              />
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={submitting}
            className={`w-full mt-8 py-3 flex items-center justify-center gap-2 font-semibold rounded-xl shadow-md transition-all ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Changes
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfile;
