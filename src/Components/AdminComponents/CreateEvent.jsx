import React, { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../context/ThemeContext";
import { CalendarPlus, MapPin, FileText, Loader2 } from "lucide-react";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  const handleCreateEvent = async () => {
    if (!title || !startDate || !endDate || !location || !description) {
      toast.error("Please fill all event fields");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/events/creatEvent",
        { title, startDate, endDate, location, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (data.success || data.message === "Event created successfully") {
        toast.success(data.message || "Event created successfully");
        setTitle("");
        setStartDate("");
        setEndDate("");
        setLocation("");
        setDescription("");
      } else {
        toast.error(data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-10 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      } font-[Poppins]`}
    >
      <ToastContainer />

      {/* Left: Form */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-md p-8 rounded-2xl shadow-lg backdrop-blur-md border space-y-6 ${
          isDark ? "bg-gray-800/60 border-gray-700" : "bg-white/70 border-blue-100"
        }`}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <CalendarPlus className="text-blue-500 w-6 h-6" />
          <h2
            className={`text-2xl font-semibold ${
              isDark ? "text-gray-100" : "text-blue-600"
            }`}
          >
            Create New Event
          </h2>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-500" />
            Event Title
          </label>
          <input
            type="text"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:outline-none transition ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-500" />
            Description
          </label>
          <textarea
            placeholder="Describe your event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border shadow-sm resize-none focus:ring-2 focus:outline-none transition ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Dates */}
        <div>
          <label className="text-sm font-medium text-blue-500 mb-1 block">
            Event Duration
          </label>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:outline-none transition ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
              }`}
            />
            <span className="text-sm font-medium text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:outline-none transition ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
              }`}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-blue-500" />
            Location
          </label>
          <input
            type="text"
            placeholder="Event location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:outline-none transition ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
            }`}
          />
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleCreateEvent}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Creating...
            </>
          ) : (
            "Create Event"
          )}
        </motion.button>
      </motion.div>

      {/* Right: Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="hidden md:flex w-full max-w-lg justify-center"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Event Illustration"
          className="w-80 opacity-90"
        />
      </motion.div>

      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
}

export default CreateEvent;
