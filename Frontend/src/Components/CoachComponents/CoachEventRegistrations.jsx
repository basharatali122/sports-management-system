import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Loader2 } from "lucide-react";
import useUser from "../../context/UserContext";

const CoachRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { theme } = useContext(ThemeContext);
  const { User } = useUser();

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/events/coach/registrations",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
          console.log("Fetched registrations:", res.data);
      const flat =
        res.data?.events?.flatMap((event) =>
          event.registrations.map((reg) => ({
            registrationId: reg._id,
            status: reg.status,
            eventId: event._id,
            eventTitle: event.title,
            eventDescription: event.description,
            eventLocation: event.location,
            startDate: event.startDate,
            endDate: event.endDate,
            userName: reg.userId?.name,
            userEmail: reg.userId?.email,
          }))
        ) || [];

      setRegistrations(flat);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Update registration status
  const updateStatus = async (registrationId, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/events/coach/registrations/${registrationId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (res.status !== 200) throw new Error("Failed to update status");

      setRegistrations((prev) =>
        prev.map((r) =>
          r.registrationId === registrationId ? { ...r, status } : r
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchesFilter = filter === "all" ? true : r.status === filter;
    const matchesSearch =
      r.eventTitle?.toLowerCase().includes(search.toLowerCase()) ||
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-[100dvh]">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );

  const bg =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100"
      : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";
  const cardBg = theme === "dark" ? "bg-gray-900/70" : "bg-white";

  return (
    <div
      className={`min-h-[100dvh] w-full p-6 md:p-10 transition-colors duration-500 ${bg}`}
    >
      <motion.h2
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-center mb-10 tracking-tight"
      >
        Coach Registrations
      </motion.h2>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
      >
        <div className="relative w-full md:w-1/2">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by event, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`${cardBg} rounded-2xl shadow-2xl overflow-hidden border ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead
              className={`${
                theme === "dark" ? "bg-blue-600/20" : "bg-blue-600 text-white"
              }`}
            >
              <tr>
                {[
                  "Event",
                  "Location",
                  "Start Date",
                  "End Date",
                  "User Name",
                  "Email",
                  "Status",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-4 text-left font-semibold uppercase tracking-wide"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((r, i) => (
                <motion.tr
                  key={r.registrationId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`${
                    theme === "dark"
                      ? i % 2 === 0
                        ? "bg-gray-800/50"
                        : "bg-gray-900/40"
                      : i % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white"
                  } hover:bg-blue-50/20 transition-all duration-300`}
                >
                  <td className="px-6 py-4 font-semibold">{r.eventTitle}</td>
                  <td className="px-6 py-4">{r.eventLocation}</td>
                  <td className="px-6 py-4">
                    {new Date(r.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(r.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{r.userName}</td>
                  <td className="px-6 py-4">{r.userEmail}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                        r.status === "accepted"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : r.status === "rejected"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : "bg-yellow-100 text-yellow-700 border-yellow-300"
                      }`}
                    >
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(r.registrationId, "accepted")}
                      className="flex items-center gap-1 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                      <CheckCircle size={14} /> Accept
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(r.registrationId, "rejected")}
                      className="flex items-center gap-1 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
                    >
                      <XCircle size={14} /> Reject
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default CoachRegistrations;
