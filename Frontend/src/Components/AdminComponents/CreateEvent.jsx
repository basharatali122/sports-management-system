
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../context/ThemeContext";
import useUser from "../../context/UserContext";
import {
  CalendarDays,
  MapPin,
  Clock,
  FileText,
  User,
  Type,
  Send,
} from "lucide-react";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");

  const { themeMode } = useContext(ThemeContext);
  const { user, token } = useUser(); // 🔥 Get user and token from context
  const isDark = themeMode === "dark";

  // 🔥 Set coach name from user context when component loads
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleCreateEvent = async () => {
    // Validate all fields
    if (!title || !startDate || !endDate || !location || !description || !time || !name) {
      toast.error("⚠️ Please fill all event fields");
      return;
    }

    // 🔥 Validate that end date is after start date
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("⚠️ End date cannot be before start date");
      return;
    }

    // 🔥 Get token from multiple sources
    const authToken = token || localStorage.getItem("token") || localStorage.getItem("authToken");
    
    if (!authToken) {
      toast.error("⚠️ You must be logged in to create an event");
      return;
    }

    try {
      // 🔥 Format dates properly for backend
      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();

      const { data } = await axios.post(
        "http://localhost:3000/events/createEvent",
        {
          title,
          description,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          time,
          location,
          name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      toast.success(data.message || "Event created successfully!");

      // Reset form
      setTitle("");
      setStartDate("");
      setEndDate("");
      setTime("");
      setLocation("");
      setDescription("");
      // Don't reset name as it's from user context
    } catch (error) {
      console.error("Error creating event:", error);
      
      // 🔥 Better error handling
      if (error.response?.status === 422) {
        toast.error("Validation error: " + (error.response?.data?.msg || "Invalid data format"));
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error(error.response?.data?.msg || error.response?.data?.error || "Failed to create event");
      }
    }
  };

  const bg = isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900";
  const cardBg = isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const inputBg = isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900";

  return (
    <div
      className={`min-h-screen w-full ${bg} transition-colors duration-300 font-[Poppins]`}
    >
      <ToastContainer theme={isDark ? "dark" : "light"} />

      {/* Header */}
      <div className="text-center mb-10 mt-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-blue-500"
        >
          Create Event
        </motion.h1>
        <p className="text-gray-500 mt-2 text-sm">
          Fill in the details below to schedule a new event.
        </p>
      </div>

      {/* Form Card */}
      <div className="flex justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`rounded-2xl shadow-xl border ${cardBg} w-full md:max-w-2xl p-8 space-y-6`}
        >
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-sm">
              <Type className="w-4 h-4 text-blue-600" /> Event Title
            </label>
            <input
              type="text"
              placeholder="Enter event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 focus:outline-none ${inputBg}`}
            />
          </div>

          {/* Coach Name - Readonly since it comes from user context */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-sm">
              <User className="w-4 h-4 text-blue-600" /> Coach Name
            </label>
            <input
              type="text"
              placeholder="Coach name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 focus:outline-none ${inputBg} bg-gray-100 dark:bg-gray-700`}
              // readOnly // 🔥 Make it readonly since it comes from user context
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-sm">
              <FileText className="w-4 h-4 text-blue-600" /> Description
            </label>
            <textarea
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none ${inputBg}`}
            />
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-sm">
              <CalendarDays className="w-4 h-4 text-blue-600" /> Event Dates
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // 🔥 Can't select past dates
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 focus:outline-none ${inputBg}`}
              />
              <span className="text-gray-500 text-sm">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]} // 🔥 End date >= start date
                className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 focus:outline-none ${inputBg}`}
              />
            </div>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-sm">
              <Clock className="w-4 h-4 text-blue-600" /> Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 focus:outline-none ${inputBg}`}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-sm">
              <MapPin className="w-4 h-4 text-blue-600" /> Location
            </label>
            <input
              type="text"
              placeholder="Enter event location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-600 focus:outline-none ${inputBg}`}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreateEvent}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all"
          >
            <Send className="w-5 h-5" />
            Create Event
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default CreateEvent;