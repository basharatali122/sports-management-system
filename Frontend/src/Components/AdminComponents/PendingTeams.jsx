import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import { CheckCircle, Users2, Loader2 } from "lucide-react";

function PendingTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  // Fetch teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/team/pending-teams", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      // setTeams(Array.isArray(res.data) ? res.data : []);
      setTeams(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pending teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // Approve team
  // const approveTeam = async (teamId) => {
  //   try {
  //     await axios.patch(
  //       `http://localhost:3000/team/approve/${teamId}`,
  //       {},
  //       { withCredentials: true ,
  //          headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     toast.success("Team approved successfully!");
  //     fetchTeams();
  //   } catch (error) {
  //     toast.error("Failed to approve team");
  //   }
  // };

  const approveTeam = async (teamId) => {
  try {
    const token = localStorage.getItem("token"); // or get from cookie

    await axios.patch(
      `http://localhost:3000/team/approve/${teamId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Team approved successfully!");
    fetchTeams();
  } catch (error) {
    toast.error("Failed to approve team");
  }
};

  return (
    <div className="w-full px-6 py-8 font-[Poppins] transition-colors duration-300">
      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`p-8 rounded-2xl shadow-lg backdrop-blur-md border ${
          isDark ? "bg-gray-900/60 border-gray-700" : "bg-white/60 border-emerald-100"
        }`}
      >
        <div className="flex items-center gap-2 mb-6">
          <Users2 className="text-emerald-500 w-6 h-6" />
          <h2
            className={`text-2xl font-semibold ${
              isDark ? "text-gray-100" : "text-emerald-600"
            }`}
          >
            Pending Teams
          </h2>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-16 text-emerald-600">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Loading pending teams...
          </div>
        ) : teams.length === 0 ? (
          <p
            className={`text-center text-sm py-10 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No teams awaiting approval.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {teams.map((team, index) => (
              <motion.li
                key={team._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`py-4 flex items-center justify-between transition-all ${isDark ? "hover:bg-gray-800/40" : "hover:bg-emerald-50/60"} px-4 rounded-lg`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {team.name}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Created by: {team.createdBy?.name || "Unknown"}
                  </p>
                </div>

                <button
                  onClick={() => approveTeam(team._id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Global font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
}

export default PendingTeams;
