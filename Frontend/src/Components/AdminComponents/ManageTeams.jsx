// import React, { useEffect, useState, useContext } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import { ThemeContext } from "../../context/ThemeContext";
// import { toast } from "react-hot-toast";
// import { Trash2, ShieldOff, ShieldCheck, Loader2, Shield, Search } from "lucide-react";

// const BASE_URL = "http://localhost:3000";

// export default function ManageTeams() {
//   const [teams, setTeams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionId, setActionId] = useState(null);
//   const [search, setSearch] = useState("");
//   const [confirmModal, setConfirmModal] = useState(null); // { type, team }
//   const { themeMode } = useContext(ThemeContext);
//   const isDark = themeMode === "dark";

//   const token = localStorage.getItem("token");
//   const authHeader = { headers: { Authorization: `Bearer ${token}` } };

//   const fetchTeams = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BASE_URL}/admin/teams`, authHeader);
//       const data = res.data?.data ?? res.data ?? [];
//       setTeams(Array.isArray(data) ? data : []);
//     } catch {
//       toast.error("Failed to fetch teams");
//       setTeams([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchTeams(); }, []);

//   const handleBlock = async (team) => {
//     setConfirmModal(null);
//     setActionId(team._id);
//     try {
//       const res = await axios.patch(
//         `${BASE_URL}/admin/teams/${team._id}/block`,
//         {},
//         authHeader
//       );
//       const updated = res.data?.data;
//       if (updated) {
//         setTeams((prev) => prev.map((t) => (t._id === team._id ? updated : t)));
//       }
//       const isBlocked = updated?.status === "blocked";
//       toast.success(isBlocked ? "Team blocked" : "Team unblocked");
//     } catch {
//       toast.error("Action failed");
//     } finally {
//       setActionId(null);
//     }
//   };

//   const handleDelete = async (team) => {
//     setConfirmModal(null);
//     setActionId(team._id);
//     try {
//       await axios.delete(`${BASE_URL}/admin/teams/${team._id}`, authHeader);
//       setTeams((prev) => prev.filter((t) => t._id !== team._id));
//       toast.success("Team deleted");
//     } catch {
//       toast.error("Delete failed");
//     } finally {
//       setActionId(null);
//     }
//   };

//   const filtered = teams.filter((t) =>
//     (t.name + (t.sport ?? "") + (t.description ?? "")).toLowerCase().includes(search.toLowerCase())
//   );

//   // Theme helpers
//   const card = isDark
//     ? "bg-gray-900/70 border-gray-800 text-gray-100"
//     : "bg-white/80 border-gray-200 text-gray-800";
//   const input = isDark
//     ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
//     : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400";
//   const rowHover = isDark ? "hover:bg-gray-800/60" : "hover:bg-emerald-50/60";
//   const statusBadge = (status) => {
//     if (status === "blocked") return "bg-red-500/20 text-red-400 border border-red-500/30";
//     if (status === "approved") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
//     return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div className="flex items-center gap-3">
//           <Shield className="w-7 h-7 text-emerald-500" />
//           <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
//             Manage Teams
//           </h2>
//           <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
//             {teams.length}
//           </span>
//         </div>

//         {/* Search */}
//         <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${input} w-full sm:w-64`}>
//           <Search className="w-4 h-4 text-gray-400 shrink-0" />
//           <input
//             className="bg-transparent outline-none text-sm w-full"
//             placeholder="Search teams..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 16 }}
//         animate={{ opacity: 1, y: 0 }}
//         className={`rounded-2xl border shadow-lg overflow-hidden ${card}`}
//       >
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
//           </div>
//         ) : filtered.length === 0 ? (
//           <p className="text-center py-16 text-gray-400">No teams found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className={`text-xs uppercase tracking-wider ${isDark ? "bg-gray-800/80 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
//                   <th className="px-5 py-3 text-left">#</th>
//                   <th className="px-5 py-3 text-left">Team Name</th>
//                   <th className="px-5 py-3 text-left">Sport</th>
//                   <th className="px-5 py-3 text-left">Members</th>
//                   <th className="px-5 py-3 text-left">Status</th>
//                   <th className="px-5 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700/20">
//                 {filtered.map((team, idx) => (
//                   <tr key={team._id} className={`transition-colors ${rowHover}`}>
//                     <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
//                     <td className="px-5 py-3 font-medium">{team.name}</td>
//                     <td className="px-5 py-3">{team.sport ?? "—"}</td>
//                     <td className="px-5 py-3 text-gray-400">
//                       {Array.isArray(team.members) ? team.members.length : 0}
//                     </td>
//                     <td className="px-5 py-3">
//                       <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusBadge(team.status)}`}>
//                         {team.status ?? "pending"}
//                       </span>
//                     </td>
//                     <td className="px-5 py-3">
//                       <div className="flex items-center justify-center gap-2">
//                         {/* Block / Unblock */}
//                         <button
//                           onClick={() => setConfirmModal({ type: "block", team })}
//                           disabled={actionId === team._id}
//                           title={team.status === "blocked" ? "Unblock" : "Block"}
//                           className={`p-2 rounded-lg transition-colors ${
//                             team.status === "blocked"
//                               ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
//                               : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
//                           }`}
//                         >
//                           {actionId === team._id ? (
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                           ) : team.status === "blocked" ? (
//                             <ShieldCheck className="w-4 h-4" />
//                           ) : (
//                             <ShieldOff className="w-4 h-4" />
//                           )}
//                         </button>

//                         {/* Delete */}
//                         <button
//                           onClick={() => setConfirmModal({ type: "delete", team })}
//                           disabled={actionId === team._id}
//                           title="Delete"
//                           className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </motion.div>

//       {/* Confirm Modal */}
//       <AnimatePresence>
//         {confirmModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className={`rounded-2xl p-6 w-80 shadow-2xl border ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
//             >
//               <h3 className="text-lg font-bold mb-2">
//                 {confirmModal.type === "delete"
//                   ? "Delete Team?"
//                   : confirmModal.team.status === "blocked"
//                   ? "Unblock Team?"
//                   : "Block Team?"}
//               </h3>
//               <p className="text-sm text-gray-400 mb-5">
//                 {confirmModal.type === "delete"
//                   ? `Permanently delete "${confirmModal.team.name}"? This cannot be undone.`
//                   : confirmModal.team.status === "blocked"
//                   ? `Unblock "${confirmModal.team.name}"? It will be accessible again.`
//                   : `Block "${confirmModal.team.name}"? Members won't be able to use it.`}
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setConfirmModal(null)}
//                   className={`flex-1 py-2 rounded-xl text-sm font-medium border ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() =>
//                     confirmModal.type === "delete"
//                       ? handleDelete(confirmModal.team)
//                       : handleBlock(confirmModal.team)
//                   }
//                   className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white ${confirmModal.type === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
//                 >
//                   Confirm
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";
import { Trash2, ShieldOff, ShieldCheck, Loader2, Shield, Search } from "lucide-react";

const BASE_URL = "http://localhost:3000";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);
  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/admin/teams`, authHeader);
      const data = res.data?.data ?? res.data ?? [];
      setTeams(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch teams");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleBlock = async (team) => {
    setConfirmModal(null);
    setActionId(team._id);
    try {
      const res = await axios.patch(
        `${BASE_URL}/admin/teams/${team._id}/block`,
        {},
        authHeader
      );
      const updated = res.data?.data;
      if (updated) {
        setTeams((prev) => prev.map((t) => (t._id === team._id ? updated : t)));
      }
      const isBlocked = updated?.status === "blocked";
      toast.success(isBlocked ? "Team blocked" : "Team unblocked");
    } catch {
      toast.error("Action failed");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (team) => {
    setConfirmModal(null);
    setActionId(team._id);
    try {
      await axios.delete(`${BASE_URL}/admin/teams/${team._id}`, authHeader);
      setTeams((prev) => prev.filter((t) => t._id !== team._id));
      toast.success("Team deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionId(null);
    }
  };

  // ✅ Fixed: Get team status based on approved and status fields
  const getTeamStatus = (team) => {
    if (team.status === "blocked") return "blocked";
    if (team.approved === true) return "approved";
    return "pending";
  };

  // ✅ Fixed: Get display text for status
  const getStatusText = (team) => {
    if (team.status === "blocked") return "Blocked";
    if (team.approved === true) return "Approved";
    return "Pending";
  };

  const filtered = teams.filter((t) =>
    (t.name + (t.sport ?? "") + (t.description ?? "")).toLowerCase().includes(search.toLowerCase())
  );

  // Theme helpers
  const card = isDark
    ? "bg-gray-900/70 border-gray-800 text-gray-100"
    : "bg-white/80 border-gray-200 text-gray-800";
  const input = isDark
    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
    : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400";
  const rowHover = isDark ? "hover:bg-gray-800/60" : "hover:bg-emerald-50/60";

  // ✅ Fixed: Status badge based on actual team data
  const statusBadge = (team) => {
    const status = getTeamStatus(team);
    if (status === "blocked") return "bg-red-500/20 text-red-400 border border-red-500/30";
    if (status === "approved") return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Shield className="w-7 h-7 text-emerald-500" />
          <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            Manage Teams
          </h2>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
            {teams.length}
          </span>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${input} w-full sm:w-64`}>
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border shadow-lg overflow-hidden ${card}`}
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-16 text-gray-400">No teams found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${isDark ? "bg-gray-800/80 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Team Name</th>
                  <th className="px-5 py-3 text-left">Sport</th>
                  <th className="px-5 py-3 text-left">Members</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/20">
                {filtered.map((team, idx) => (
                  <tr key={team._id} className={`transition-colors ${rowHover}`}>
                    <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-5 py-3 font-medium">{team.name}</td>
                    <td className="px-5 py-3">{team.sport ?? "—"}</td>
                    <td className="px-5 py-3 text-gray-400">
                      {Array.isArray(team.members) ? team.members.length : 0}
                    </td>
                    <td className="px-5 py-3">
                      {/* ✅ Fixed: Using team object instead of status string */}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusBadge(team)}`}>
                        {getStatusText(team)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Block / Unblock */}
                        <button
                          onClick={() => setConfirmModal({ type: "block", team })}
                          disabled={actionId === team._id}
                          title={team.status === "blocked" ? "Unblock" : "Block"}
                          className={`p-2 rounded-lg transition-colors ${
                            team.status === "blocked"
                              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                          }`}
                        >
                          {actionId === team._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : team.status === "blocked" ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : (
                            <ShieldOff className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setConfirmModal({ type: "delete", team })}
                          disabled={actionId === team._id}
                          title="Delete"
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-6 w-80 shadow-2xl border ${isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
            >
              <h3 className="text-lg font-bold mb-2">
                {confirmModal.type === "delete"
                  ? "Delete Team?"
                  : confirmModal.team.status === "blocked"
                  ? "Unblock Team?"
                  : "Block Team?"}
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                {confirmModal.type === "delete"
                  ? `Permanently delete "${confirmModal.team.name}"? This cannot be undone.`
                  : confirmModal.team.status === "blocked"
                  ? `Unblock "${confirmModal.team.name}"? It will be accessible again.`
                  : `Block "${confirmModal.team.name}"? Members won't be able to use it.`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    confirmModal.type === "delete"
                      ? handleDelete(confirmModal.team)
                      : handleBlock(confirmModal.team)
                  }
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold text-white ${confirmModal.type === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}