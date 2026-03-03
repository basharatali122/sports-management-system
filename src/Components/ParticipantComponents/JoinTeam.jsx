import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useUser from "../../context/UserContext";
import {
  Users,
  UserCircle2,
  Trophy,
  Hash,
  Loader2,
  LogIn,
  LogOut,
} from "lucide-react";

export default function JoinTeam() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [leaving, setLeaving] = useState(null);
  const navigate = useNavigate();

  const { user, token } = useUser();

  console.log("join team Current User:", user, token);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("http://localhost:3000/team/approved-teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeams(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Failed to load teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [navigate, user, token]);

  const handleJoinTeam = async (teamId) => {
    setJoining(teamId);
    try {
      const res = await axios.post(
        `http://localhost:3000/team/${teamId}/join`,
        { userId: user._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Joined team successfully!");
      setTeams((prev) =>
        prev.map((t) =>
          t._id === teamId ? { ...t, members: [...t.members, user] } : t
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to join team.");
    } finally {
      setJoining(null);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    setLeaving(teamId);
    try {
      const res = await axios.post(
        `http://localhost:3000/team/${teamId}/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data.message || "Left team successfully!");
      setTeams((prev) =>
        prev.map((t) =>
          t._id === teamId
            ? { ...t, members: t.members.filter((m) => m._id !== user._id) }
            : t
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to leave team.");
    } finally {
      setLeaving(null);
    }
  };

  // 🌀 Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-700">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-3" />
        <p className="text-lg font-medium animate-pulse">
          Fetching teams...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-[100dvh]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-teal-600 flex items-center gap-2">
            <Users className="w-7 h-7 text-teal-500" />
            Join a Team
          </h2>
        </div>

        {/* No teams available */}
        {teams.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-70" />
            <p className="text-lg font-medium">No approved teams right now.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, index) => {
              const alreadyMember = team.members?.some(
                (m) => m._id === user?._id
              );

              return (
                <motion.div
                  key={team._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.02,
                    y: -3,
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
                  }}
                  className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all"
                >
                  {/* Team Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-teal-600 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      {team.name}
                    </h3>
                    <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
                      {team.sport || "N/A"}
                    </span>
                  </div>

                  {/* Coach */}
                  <p className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <UserCircle2 className="w-4 h-4 text-teal-500" />
                    Coach:{" "}
                    <span className="font-medium text-gray-800">
                      {team.coach?.name || "N/A"}
                    </span>
                  </p>

                  {/* Members List */}
                  <div className="mt-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-500" />
                      Members ({team.members?.length || 0})
                    </h4>
                    <div className="max-h-32 overflow-y-auto rounded-md border border-gray-100 bg-gray-50 p-3 space-y-2">
                      {team.members?.length ? (
                        team.members.map((m) => (
                          <div
                            key={m._id}
                            className="text-sm bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm"
                          >
                            <p className="font-medium text-gray-800">{m.name}</p>
                            <p className="text-xs text-gray-500">{m.email}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm italic">
                          No members yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5">
                    {alreadyMember ? (
                      <button
                        onClick={() => handleLeaveTeam(team._id)}
                        disabled={leaving === team._id}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl w-full font-semibold text-white transition-all duration-300 ${
                          leaving === team._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {leaving === team._id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Leaving...
                          </>
                        ) : (
                          <>
                            <LogOut className="w-4 h-4" /> Leave Team
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinTeam(team._id)}
                        disabled={joining === team._id}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl w-full font-semibold text-white transition-all duration-300 ${
                          joining === team._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-teal-600 hover:bg-teal-700"
                        }`}
                      >
                        {joining === team._id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" /> Join Team
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
