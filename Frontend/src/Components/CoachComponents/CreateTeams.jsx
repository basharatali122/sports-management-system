
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Users,
  Filter,
  ClipboardList,
  Loader2,
  CheckCircle,
  XCircle,
  UserPlus,
} from "lucide-react";

function CreateTeams() {
  const { theme } = useContext(ThemeContext);
  const { user, token } = useUser();
  
  // 🔥 Get token from multiple sources
  const getAuthToken = () => {
    return token || localStorage.getItem("token") || localStorage.getItem("authToken") || "";
  };

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // create team UI state
  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [coachId, setCoachId] = useState("");

  // filter for users list
  const [filter, setFilter] = useState("participants");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const authToken = getAuthToken();
        
        const res = await axios.get("http://localhost:3000/users/getAllUsers", {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        // 🔥 Handle backend response structure
        let users = [];
        
        if (Array.isArray(res.data)) {
          users = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          users = res.data.data;
        } else if (res.data && Array.isArray(res.data.users)) {
          users = res.data.users;
        } else if (res.data && typeof res.data === 'object') {
          users = [res.data];
        }
        
        console.log("Fetched users:", users);
        setAllUsers(users);

        // Auto-select current user as coach if they are a coach
        if (user?.role === "coach" && user?._id) {
          setCoachId(user._id);
        }
        
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users");
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const isApprovedUser = (u) => {
    if (!u) return false;
    return u.approved === true || u.status === "approved";
  };

  // 🔥 FIXED: Create team function with proper error handling
  const handleCreateTeam = async () => {
    if (!teamName.trim() || !sport.trim() || selectedMembers.length === 0) {
      toast.error("Please fill team name, sport and select at least one member.");
      return;
    }

    // Get fresh token
    const authToken = getAuthToken();
    if (!authToken) {
      toast.error("You must be logged in to create a team");
      return;
    }

    // Prepare request body
    const body = {
      name: teamName.trim(),
      sport: sport.trim(),
      members: selectedMembers,
    };

    // Add coach if selected or if current user is coach
    if (coachId) {
      body.coach = coachId;
    } else if (user?.role === "coach" && user?._id) {
      body.coach = user._id;
    }

    console.log("Creating team with body:", body);
    console.log("Auth token:", authToken);

    try {
      setCreating(true);
      
      const res = await axios.post(
        "http://localhost:3000/team/teams", 
        body,
        {
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Team creation response:", res.data);

      // 🔥 Handle response structure
      if (res.status === 201 || res.status === 200) {
        toast.success(res.data?.message || "Team created successfully!");
        
        // Reset form
        setTeamName("");
        setSport("");
        setSelectedMembers([]);
      } else {
        throw new Error(res.data?.message || "Failed to create team");
      }
      
    } catch (err) {
      console.error("Create team error:", err);
      
      // 🔥 Better error messages
      if (err.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.error || "Invalid team data");
      } else if (err.response?.status === 422) {
        toast.error(err.response?.data?.error || "Validation error");
      } else {
        toast.error(err.response?.data?.error || err.message || "Failed to create team");
      }
    } finally {
      setCreating(false);
    }
  };

  // Filter users based on selected filter
  const displayedUsers = Array.isArray(allUsers) 
    ? allUsers.filter((u) => {
        if (!u) return false;
        if (filter === "participants") return u.role === "participant";
        if (filter === "coaches") return u.role === "coach";
        if (filter === "approved") return isApprovedUser(u);
        return true;
      })
    : [];

  // Get approved participants for team selection
  const approvedParticipants = Array.isArray(allUsers) 
    ? allUsers.filter((u) => u.role === "participant" && isApprovedUser(u))
    : [];

  // Get coaches for dropdown
  const coaches = Array.isArray(allUsers) 
    ? allUsers.filter((u) => u.role === "coach")
    : [];

  // UI Theme
  const dark = theme === "dark";
  const pageBg = dark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";
  const cardBg = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const inputBg = dark ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`min-h-screen w-full ${pageBg} font-[Poppins] transition-colors duration-300`}>
      <ToastContainer theme={theme} position="top-right" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-blue-600 mb-2"
        >
          Create New Team
        </motion.h1>
        <p className={muted}>Form a team by selecting approved participants</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Create Team Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl p-6 border ${cardBg} shadow-lg`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Team Details
            </h2>

            <div className="space-y-5">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Team Name *</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g., Eagles United"
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                />
              </div>

              {/* Sport */}
              <div>
                <label className="block text-sm font-medium mb-2">Sport *</label>
                <input
                  type="text"
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  placeholder="e.g., Football"
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                />
              </div>

              {/* Coach Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Team Coach</label>
                <select
                  value={coachId}
                  onChange={(e) => setCoachId(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${inputBg} focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                >
                  <option value="">
                    {user?.role === "coach" ? `${user.name} (You)` : "Select a coach"}
                  </option>
                  {coaches.map((coach) => (
                    <option key={coach._id || coach.id} value={coach._id || coach.id}>
                      {coach.name} - {coach.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Members Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Members * ({selectedMembers.length} selected)
                </label>
                <select
                  multiple
                  value={selectedMembers}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
                    setSelectedMembers(values);
                  }}
                  className={`w-full h-48 rounded-xl px-3 py-2 border ${inputBg} focus:ring-2 focus:ring-blue-600 focus:outline-none`}
                >
                  {approvedParticipants.length === 0 ? (
                    <option disabled>No approved participants available</option>
                  ) : (
                    approvedParticipants.map((p) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.name} - {p.email}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-400 mt-2">
                  Hold Ctrl/Cmd to select multiple members
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCreateTeam}
                disabled={creating || !teamName.trim() || !sport.trim() || selectedMembers.length === 0}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2
                  ${creating || !teamName.trim() || !sport.trim() || selectedMembers.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
                  }`}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create Team
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
                <div className="text-xs text-gray-400">Approved Participants</div>
                <div className="text-2xl font-bold text-blue-600">{approvedParticipants.length}</div>
              </div>
              <div className={`p-4 rounded-xl border ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
                <div className="text-xs text-gray-400">Available Coaches</div>
                <div className="text-2xl font-bold text-green-600">{coaches.length}</div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Users List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl p-6 border ${cardBg} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Available Users
              </h2>
              
              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl border ${inputBg} focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm`}
              >
                <option value="participants">Participants</option>
                <option value="coaches">Coaches</option>
                <option value="approved">Approved</option>
                <option value="all">All Users</option>
              </select>
            </div>

            {/* Users List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {displayedUsers.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No users found</p>
                ) : (
                  displayedUsers.map((u) => {
                    const approved = isApprovedUser(u);
                    const uid = u._id || u.id;
                    
                    return (
                      <div
                        key={uid}
                        className={`p-4 rounded-xl border ${dark ? "bg-gray-800" : "bg-white"} hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{u.name || "Unknown"}</h3>
                            <p className="text-sm text-gray-400">{u.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                {u.role}
                              </span>
                              {approved ? (
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Approved
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                                  <XCircle className="w-3 h-3" /> Pending
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {u.role === "participant" && approved && (
                            <button
                              onClick={() => {
                                if (selectedMembers.includes(uid)) {
                                  setSelectedMembers(selectedMembers.filter(id => id !== uid));
                                } else {
                                  setSelectedMembers([...selectedMembers, uid]);
                                }
                              }}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
                                ${selectedMembers.includes(uid)
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                }`}
                            >
                              {selectedMembers.includes(uid) ? "Remove" : "Select"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
}

export default CreateTeams;