// import React, { useEffect, useState, useContext } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ThemeContext } from "../../context/ThemeContext";
// import useUser from "../../context/UserContext";
// import { CalendarDays, MapPin, CheckCircle, Loader2 } from "lucide-react";

// function PendingEvents() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useUser();
//   const { themeMode } = useContext(ThemeContext);
//   const isDark = themeMode === "dark";

//   // Fetch pending events
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get("http://localhost:3000/events");
//         setEvents(response.data.events || []);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         toast.error("Failed to fetch events");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   // Approve event
//   const approveEvent = async (eventId) => {
//     if (!user || (user.role !== "admin" && user.role !== "moderator")) {
//       toast.error("You are not authorized to approve events");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.patch(
//         `http://localhost:3000/events/${eventId}/approve`,
//         { userId: user._id },
//         {
//           withCredentials: true,
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setEvents((prev) => prev.filter((event) => event._id !== eventId));
//       toast.success("Event approved successfully");
//     } catch (error) {
//       console.error("Error approving event:", error);
//       toast.error("Error approving event");
//     }
//   };

//   return (
//     <div className="w-full px-6 py-8 font-[Poppins] transition-colors duration-300">
//       <ToastContainer />

//       {/* Container */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className={`p-8 rounded-2xl shadow-lg backdrop-blur-md border ${
//           isDark ? "bg-gray-900/60 border-gray-700" : "bg-white/60 border-blue-100"
//         }`}
//       >
//         {/* Heading */}
//         <div className="flex items-center gap-2 mb-6">
//           <CalendarDays className="text-blue-500 w-6 h-6" />
//           <h2
//             className={`text-2xl font-semibold ${
//               isDark ? "text-gray-100" : "text-blue-600"
//             }`}
//           >
//             Pending Events
//           </h2>
//         </div>

//         {/* Loading */}
//         {loading ? (
//           <div className="flex justify-center items-center py-16 text-blue-500">
//             <Loader2 className="animate-spin w-6 h-6 mr-2" />
//             Loading events...
//           </div>
//         ) : events.length === 0 ? (
//           <p
//             className={`text-center text-sm py-10 ${
//               isDark ? "text-gray-400" : "text-gray-500"
//             }`}
//           >
//             No events awaiting approval.
//           </p>
//         ) : (
//           <ul className="divide-y divide-gray-200 dark:divide-gray-700">
//             {events.map((event, i) => {
//               const start = new Date(event.startDate).toLocaleDateString("en-GB");
//               const end = new Date(event.endDate).toLocaleDateString("en-GB");

//               return (
//                 <motion.li
//                   key={event._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: i * 0.05 }}
//                   className={`py-4 flex items-center justify-between px-4 rounded-lg transition-all ${
//                     isDark ? "hover:bg-gray-800/40" : "hover:bg-blue-50/60"
//                   }`}
//                 >
//                   <div>
//                     <p
//                       className={`font-semibold text-base ${
//                         isDark ? "text-gray-100" : "text-gray-900"
//                       }`}
//                     >
//                       {event.title}
//                     </p>
//                     <div
//                       className={`flex items-center text-sm ${
//                         isDark ? "text-gray-400" : "text-gray-600"
//                       }`}
//                     >
//                       <MapPin className="w-4 h-4 mr-1" /> {event.location}
//                     </div>
//                     <p
//                       className={`text-sm mt-1 ${
//                         isDark ? "text-gray-400" : "text-gray-700"
//                       }`}
//                     >
//                       {start} → {end}
//                     </p>
//                   </div>

//                   {user?.role === "admin" || user?.role === "moderator" ? (
//                     <button
//                       onClick={() => approveEvent(event._id)}
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
//                     >
//                       <CheckCircle className="w-4 h-4" /> Approve
//                     </button>
//                   ) : (
//                     <span className="text-gray-400 italic text-sm">
//                       Not authorized
//                     </span>
//                   )}
//                 </motion.li>
//               );
//             })}
//           </ul>
//         )}
//       </motion.div>

//       {/* Font Import */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
//         * { font-family: 'Poppins', sans-serif !important; }
//       `}</style>
//     </div>
//   );
// }

// export default PendingEvents;



import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../context/ThemeContext";
// import useUser from "../../context/UserContext";
import { CalendarDays, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
function PendingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // const { user } = useUser();

  const { currentUser } = useAuth();

  console.log("current user", currentUser)

  // console.log("current user", user)

  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  // Fetch pending events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/events/");
        console.log("API Response:", response.data); // Debug log
        
        // 🔥 FIXED: The response.data is directly the array of events
        // Your backend returns the events array directly, not wrapped in a 'data' property
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } 
        // If it's wrapped in a data property (fallback)
        else if (response.data && Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        }
        // If it has an events property
        else if (response.data && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
        }
        else {
          console.error("Unexpected response format:", response.data);
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Approve event
  const approveEvent = async (eventId) => {
    // if (currentUser?.role === "admin" || currentUser?.role === "moderator") {
    //   toast.error("You are not authorized to approve events");
    //   return;
    // }

    if (currentUser?.role !== "admin" && currentUser?.role !== "moderator") {
  toast.error("You are not authorized to approve events");
  return;
}
    
    try {
      // const token = localStorage.getItem("authToken");
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3000/events/${eventId}/approve`,
        { userId: currentUser._id },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents((prev) => prev.filter((event) => event._id !== eventId));
      toast.success("Event approved successfully");
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Error approving event");
    }
  };

  return (
    <div className="w-full px-6 py-8 font-[Poppins] transition-colors duration-300">
      <ToastContainer />

      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`p-8 rounded-2xl shadow-lg backdrop-blur-md border ${
          isDark ? "bg-gray-900/60 border-gray-700" : "bg-white/60 border-blue-100"
        }`}
      >
        {/* Heading */}
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="text-blue-500 w-6 h-6" />
          <h2
            className={`text-2xl font-semibold ${
              isDark ? "text-gray-100" : "text-blue-600"
            }`}
          >
            Pending Events
          </h2>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-16 text-blue-500">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <p
            className={`text-center text-sm py-10 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No events awaiting approval.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {events.map((event, i) => {
              // 🔥 FIXED: Check if startDate and endDate exist
              const start = event.startDate 
                ? new Date(event.startDate).toLocaleDateString("en-GB") 
                : "TBD";
              const end = event.endDate 
                ? new Date(event.endDate).toLocaleDateString("en-GB") 
                : "TBD";

              return (
                <motion.li
                  key={event._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`py-4 flex flex-col md:flex-row md:items-center justify-between px-4 rounded-lg transition-all ${
                    isDark ? "hover:bg-gray-800/40" : "hover:bg-blue-50/60"
                  }`}
                >
                  <div className="mb-3 md:mb-0">
                    <p
                      className={`font-semibold text-base ${
                        isDark ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {event.name || event.title || "Untitled Event"}
                    </p>
                    <div
                      className={`flex items-center text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <MapPin className="w-4 h-4 mr-1 flex-shrink-0" /> 
                      <span>{event.location || "Location TBD"}</span>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      📅 {start} → {end}
                    </p>
                    
                    {/* 🔥 ADDED: Show description if available */}
                    {event.description && (
                      <p className={`text-sm mt-2 max-w-md ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {event.description.length > 100 
                          ? `${event.description.substring(0, 100)}...` 
                          : event.description}
                      </p>
                    )}
                  </div>

                  {(currentUser?.role === "admin" || currentUser?.role === "moderator") ? (
                    <button
                      onClick={() => approveEvent(event._id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 active:scale-95 transition-all transform hover:shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4" /> 
                      Approve Event
                    </button>
                  ) : (
                    <span className="text-gray-400 italic text-sm px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      Not authorized
                    </span>
                  )}
                </motion.li>
              );
            })}
          </ul>
        )}
        
        {/* 🔥 ADDED: Event count */}
        {!loading && events.length > 0 && (
          <div className={`mt-4 text-sm text-right ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            Total {events.length} pending event{events.length !== 1 ? 's' : ''}
          </div>
        )}
      </motion.div>

      {/* Font Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
}

export default PendingEvents;