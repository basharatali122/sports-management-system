// RegisterForEvent.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
// import useUser from "../../context/UserContext";
import {useAuth} from "../../context/AuthContext";
import { toast } from "sonner";
import {
  CalendarDays,
  MapPin,
  User,
  Loader2,
  CheckCircle2,
  CalendarX,
  Filter,
  Search,
  ArrowUpDown,
} from "lucide-react";

export default function RegisterForEvent() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortNewest, setSortNewest] = useState(true);

  // const { user, token } = useUser();
  const {currentUser}=useAuth();
  const user = currentUser;
  const token = localStorage.getItem("token");

  console.log("Current user in RegisterForEvent:", user, token); // null null

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const res = await axios.get(
  //         "http://localhost:3000/events/getParticipantEvents",
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );



        
  //       console.log("Fetched events:", res.data);
  //       const fetched = Array.isArray(res.data)
  //         ? res.data
  //         : res.data.events || [];
  //       setEvents(fetched);
  //       setFilteredEvents(fetched);
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //       toast.error("Failed to load events");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (token) fetchEvents();
  // }, [token]);

  // ✅ Filter and Search Logic
 

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/events/getParticipantEvents",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Fetched events:", res.data);

      const fetched = res.data.data || [];

      setEvents(fetched);
      setFilteredEvents(fetched);

    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  if (token) fetchEvents();
}, [token]);
 
  useEffect(() => {
    let filtered = [...events];

    // Filter by category
    if (category !== "All") {
      filtered = filtered.filter((e) => e.category === category);
    }

    // Search by title or location
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by start date
    filtered.sort((a, b) =>
      sortNewest
        ? new Date(b.startDate) - new Date(a.startDate)
        : new Date(a.startDate) - new Date(b.startDate)
    );

    setFilteredEvents(filtered);
  }, [searchQuery, category, sortNewest, events]);

  // ✅ Register Handler
  const handleRegister = async (eventId) => {
  try {
    setRegistering(eventId);

    const res = await axios.post(
      `http://localhost:3000/events/${eventId}/register`,
      { userId: user._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      // ✅ Optimistic UI update
      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === eventId
            ? { ...ev, participants: [...(ev.participants || []), user._id] }
            : ev
        )
      );
    }

    alert(res.data.msg);
  } catch (err) {
    if (err.response?.data?.msg === "Already registered") {
      alert("⚠️ You are already registered for this event.");
    } else {
      alert(err.response?.data?.msg || "Error registering for event.");
    }
  } finally {
    setRegistering(null);
  }
};


  // ✅ Loading Screen
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
        <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
        <p className="text-lg font-medium">Loading upcoming events...</p>
      </div>
    );

  // ✅ Collect all unique categories
  const allCategories = [
    "All",
    ...new Set(events.map((e) => e.category || "General")),
  ];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 px-6 md:px-10 py-12 font-[Poppins]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold text-teal-600 flex items-center justify-center gap-2 mb-2">
          <CalendarDays className="w-8 h-8 text-teal-500" />
          Register for Events
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Browse, filter, and register for your favorite events instantly.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 max-w-6xl mx-auto"
      >
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title or location..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort Toggle */}
        <button
          onClick={() => setSortNewest(!sortNewest)}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortNewest ? "Newest First" : "Oldest First"}
        </button>
      </motion.div>

      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center text-gray-500 mt-20"
        >
          <CalendarX className="w-14 h-14 text-teal-400 mb-3" />
          <p className="text-lg">No events match your filters.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredEvents.map((event, i) => {
            const alreadyRegistered = event.participants?.some(
              (p) => p._id === user._id || p === user._id
            );

            return (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{
                  scale: 1.03,
                  y: -4,
                  boxShadow: "0 10px 35px rgba(13,148,136,0.15)",
                }}
                className="bg-white border-t-4 border-teal-500 rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-1 text-gray-900">
                    {event.title}
                  </h2>
                  <p className="text-xs uppercase tracking-wide text-teal-500 mb-4">
                    {event.category || "General"}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-500" />
                      <span>{event.createdBy?.name || "Organizer"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-500" />
                      <span>{event.location || "N/A"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-teal-500" />
                      <span>
                        {event.startDate && event.endDate
                          ? `${new Date(
                              event.startDate
                            ).toLocaleDateString()} → ${new Date(
                              event.endDate
                            ).toLocaleDateString()}`
                          : "Invalid Date"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Button */}
                <div className="mt-6">
                  {alreadyRegistered ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Already Registered
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(event._id)}
                      disabled={registering === event._id}
                      className={`w-full py-2.5 font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                        registering === event._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white"
                      }`}
                    >
                      {registering === event._id ? (
                        <>
                          <Loader2 className="animate-spin w-4 h-4" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Register Now
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
