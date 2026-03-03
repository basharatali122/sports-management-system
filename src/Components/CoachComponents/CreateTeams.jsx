// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import useUser from "../../context/UserContext";
// import { ThemeContext } from "../../context/ThemeContext";
// import {
//   Users,
//   UserCheck,
//   UserX,
//   Filter,
//   PlusCircle,
//   ClipboardList,
//   CheckCircle2,
// } from "lucide-react";

// /*
//   IMPORTANT: Logic, handlers, state names, API endpoints and all behavior
//   are unchanged. Only markup + styling/layout is replaced to a bold, section-based
//   minimalistic design per your request.
// */

// function CreateTeams() {
//   const { theme } = useContext(ThemeContext);
//   const { user, token } = useUser();
//   const authHeader = token || localStorage.getItem("authToken") || "";

//   const [allUsers, setAllUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // approvals UI state
//   const [approvingId, setApprovingId] = useState(null);
//   const [rejectingId, setRejectingId] = useState(null);

//   // create team UI state
//   const [teamName, setTeamName] = useState("");
//   const [sport, setSport] = useState("");
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const [coachId, setCoachId] = useState("");
//   const [creating, setCreating] = useState(false);

//   // filter for users list: all, participants, coaches, pending, approved
//   const [filter, setFilter] = useState("all");

//   useEffect(() => {
//     let isMounted = true;
//     const fetchUsers = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get("http://localhost:3000/users/getAllUsers", {
//           headers: authHeader ? { Authorization: `Bearer ${authHeader}` } : {},
//         });

//         const users = Array.isArray(res.data)
//           ? res.data
//           : res.data.users || res.data || [];
//         if (!isMounted) return;
//         setAllUsers(users);

//         // If current user is coach, auto-select as 
//         if (user?.role === "coach") {
//           setCoachId(user._id || user.id);
//         } else if (!coachId && users.length) {
//           // Optionally preselect first coach if none selected
//           const firstCoach = users.find((u) => u.role === "coach");
//           if (firstCoach) setCoachId(firstCoach._id || firstCoach.id);
//         }
//       } catch (err) {
//         console.error("Error fetching users:", err);
//         toast.error("Failed to fetch users");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchUsers();
//     return () => {
//       isMounted = false;
//     };
//   }, [authHeader, user, coachId]);

//   const isApprovedUser = (u) => {
//     if (!u) return false;
//     return u.approved === true || u.status === "approved";
//   };

//   // Approve user endpoint + UI
//   const handleApproval = async (userId, userType = "user") => {
//     try {
//       setApprovingId(userId);
//       console.log(userId || user._id)
//       const res = await axios.patch(
//         `http://localhost:3000/users/${userId}/approve`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${authHeader}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("handleApprove", res.data);

//       const success = res?.data?.success ?? (res.status >= 200 && res.status < 300);
//       console.log("suceess", success);
//       if (success) {
//         setAllUsers((prev) =>
//           prev.map((u) =>
//             u._id === userId || u.id === userId
//               ? { ...u, approved: true, status: "approved" }
//               : u
//           )
//         );
//         toast.success(`${userType} approved successfully`, { position: "top-right", autoClose: 2000 });
//       } else {
//         throw new Error(res?.data?.message || "Approval failed");
//       }
//     } catch (error) {
//       console.error("Approval error:", error);
//       toast.error(error.response?.data?.message || error.message || "Failed to approve user");
//     } finally {
//       setApprovingId(null);
//     }
//   };

//   // Reject user endpoint + UI
//   const handleRejection = async (userId, userType = "user") => {
//     if (!window.confirm(`Reject and delete this ${userType}? This can't be undone.`)) return;

//     try {
//       setRejectingId(userId);
//       const res = await axios.delete(`http://localhost:3000/users/${userId}/reject`, {
//         headers: { Authorization: `Bearer ${authHeader}` },
//       });
//           console.log("rejection", res.data)
//       const success = res?.data?.success ?? (res.status >= 200 && res.status < 300);
//       if (success) {
//         setAllUsers((prev) => prev.filter((u) => u._id !== userId && u.id !== userId));
//         toast.success(`${userType} rejected and removed.`, { position: "top-right" });
//       } else {
//         throw new Error(res?.data?.message || "Rejection failed");
//       }
//     } catch (err) {
//       console.error("Rejection error:", err);
//       toast.error(err.response?.data?.message || err.message || "Failed to reject user");
//     } finally {
//       setRejectingId(null);
//     }
//   };

//   // Create team (sends member IDs and optional coach)
//   const handleCreateTeam = async () => {
//     if (!teamName.trim() || !sport.trim() || selectedMembers.length === 0) {
//       toast.error("Please fill team name, sport and select at least one member.");
//       return;
//     }

//     const coachToSend = coachId || (user?.role === "coach" ? (user._id || user.id) : undefined);
//     const body = {
//       name: teamName.trim(),
//       sport: sport.trim(),
//       members: selectedMembers,
//       ...(coachToSend ? { coach: coachToSend } : {}),
//     };

//     try {
//       setCreating(true);
//       const res = await axios.post("http://localhost:3000/team/teams", body, {
//         headers: {
//           Authorization: `Bearer ${authHeader}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const success = res?.data?.success ?? (res.status >= 200 && res.status < 300);
//       if (success) {
//         toast.success(res.data.message || "Team created successfully");
//         setTeamName("");
//         setSport("");
//         setSelectedMembers([]);
//       } else {
//         throw new Error(res?.data?.message || "Failed to create team");
//       }
//     } catch (err) {
//       console.error("Create team error:", err);
//       toast.error(err.response?.data?.message || err.message || "Failed to create team");
//     } finally {
//       setCreating(false);
//     }
//   };

//   // Users displayed after applying filter
//   const displayedUsers = allUsers.filter((u) => {
//     if (!u) return false;
//     switch (filter) {
//       case "participants":
//         return u.role === "participant";
//       case "coaches":
//         return u.role === "coach";
//       case "pending":
//         return !(u.approved === true || u.status === "approved");
//       case "approved":
//         return u.approved === true || u.status === "approved";
//       case "all":
//       default:
//         return true;
//     }
//   });

//   // approved participants for team select
//   const approvedParticipants = allUsers.filter((u) => u.role === "participant" && isApprovedUser(u));

//   /* -------------------------
//      UI: bold, section-based design
//      ------------------------- */
//   const dark = theme === "dark";
//   const pageBg = dark ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900";
//   const muted = dark ? "text-gray-400" : "text-gray-600";
//   const surface = dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200";
//   const controlBg = dark ? "bg-gray-800" : "bg-white";

//   return (
//     <div className={`${pageBg} min-h-screen font-[Poppins]`}>
//       <ToastContainer theme={theme} position="top-right" />

//       {/* HERO */}
//       <header className="max-w-6xl mx-auto px-6 md:px-8 py-12">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//           <div>
//             <motion.h1
//               initial={{ opacity: 0, y: -6 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.45 }}
//               className="text-4xl md:text-5xl font-extrabold leading-tight"
//             >
//               Build your teams <span className="text-teal-600"> fast</span>
//             </motion.h1>
//             <p className={`mt-3 max-w-xl ${muted}`}>
//               Create teams, choose members, and approve participants from one streamlined place. This layout focuses on clarity and speed.
//             </p>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="hidden sm:flex items-center px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent">
//               <Users className="w-5 h-5 text-blue-600" />
//               <div className="ml-3 text-sm">
//                 <div className="font-semibold">{allUsers.length}</div>
//                 <div className="text-xs text-gray-400">total users</div>
//               </div>
//             </div>

//             <div className="rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-800">
//               <Filter className="w-5 h-5" />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* MAIN AREA */}
//       <main className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//           {/* LEFT: Large clean form (spacious, sectioned) */}
//           <section className="lg:col-span-5">
//             <motion.div
//               initial={{ opacity: 0, x: -6 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.45 }}
//               className={`rounded-3xl p-8 ${surface} border shadow-sm`}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h2 className="text-2xl font-semibold">Create Team</h2>
//                   <p className={`text-sm ${muted}`}>Large form with clear fields — no clutter.</p>
//                 </div>
//                 <div className="text-sm text-gray-400">Required *</div>
//               </div>

//               <div className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Team name *</label>
//                   <input
//                     value={teamName}
//                     onChange={(e) => setTeamName(e.target.value)}
//                     placeholder="E.g., Downtown Eagles"
//                     className={`w-full rounded-xl px-4 py-3 border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Sport *</label>
//                   <input
//                     value={sport}
//                     onChange={(e) => setSport(e.target.value)}
//                     placeholder="E.g., Football"
//                     className={`w-full rounded-xl px-4 py-3 border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Coach (optional)</label>
//                   <select
//                     value={coachId}
//                     onChange={(e) => setCoachId(e.target.value)}
//                     className={`w-full rounded-xl px-4 py-3 border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
//                   >
//                     <option value="">{user?.role === "coach" ? `${user.name} (You)` : "Select coach"}</option>
//                     {allUsers.filter((u) => u.role === "coach").map((c) => (
//                       <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Members *</label>
//                   <div className="grid grid-cols-1 gap-2">
//                     <select
//                       multiple
//                       value={selectedMembers}
//                       onChange={(e) => setSelectedMembers(Array.from(e.target.selectedOptions, (o) => o.value))}
//                       className={`w-full h-44 rounded-xl px-3 py-2 border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
//                     >
//                       {approvedParticipants.length === 0 ? (
//                         <option disabled>No approved participants</option>
//                       ) : (
//                         approvedParticipants.map((p) => (
//                           <option key={p._id || p.id} value={p._id || p.id}>
//                             {p.name} — {p.email}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                     <div className="text-xs text-gray-400">Hold Cmd/Ctrl to select multiple</div>
//                   </div>
//                 </div>

//                 <div className="pt-2">
//                   <button
//                     onClick={handleCreateTeam}
//                     disabled={creating || !teamName.trim() || !sport.trim() || selectedMembers.length === 0}
//                     className={`w-full rounded-xl py-3 font-semibold text-white transition ${creating || !teamName.trim() || !sport.trim() || selectedMembers.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow"}`}
//                   >
//                     {creating ? "Creating..." : "Create team"}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>

//             {/* small quick stats */}
//             <div className="mt-6 flex gap-4">
//               <div className={`flex-1 rounded-2xl p-4 ${dark ? "bg-gray-900" : "bg-gray-50"} border ${dark ? "border-gray-800" : "border-gray-200"}`}>
//                 <div className="text-xs text-gray-400">Approved participants</div>
//                 <div className="mt-2 text-2xl font-bold">{approvedParticipants.length}</div>
//               </div>
//               <div className={`flex-1 rounded-2xl p-4 ${dark ? "bg-gray-900" : "bg-gray-50"} border ${dark ? "border-gray-800" : "border-gray-200"}`}>
//                 <div className="text-xs text-gray-400">Available coaches</div>
//                 <div className="mt-2 text-2xl font-bold">{allUsers.filter(u => u.role === "coach").length}</div>
//               </div>
//             </div>
//           </section>

//           {/* RIGHT: Immersive user canvas (horizontal/flow layout) */}
//           {/* <section className="lg:col-span-7">
//             <motion.div
//               initial={{ opacity: 0, x: 6 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.45 }}
//               className={`rounded-3xl p-6 ${surface} border shadow-sm`}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center gap-3">
//                   <ClipboardList className="w-6 h-6 text-blue-600" />
//                   <div>
//                     <h3 className="text-xl font-semibold">Participants & Approvals</h3>
//                     <p className={`text-sm ${muted}`}>Approve, reject and add members — the canvas adapts to your workflow.</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="text-sm text-gray-400 hidden sm:block">Filter</div>
//                   <select
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value)}
//                     className={`px-3 py-2 rounded-xl border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
//                   >
//                     <option value="all">All</option>
//                     <option value="participants">Participants</option>
//                     <option value="coaches">Coaches</option>
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                   </select>
//                 </div>
//               </div>

//               {/* horizontal scroll area for users (nice visual exploration) */}
//                <div className="overflow-x-auto -mx-4 px-4 pb-4">
//                 <div className="flex gap-4 w-max">
//                   {loading ? (
//                     <div className="flex items-center justify-center w-full py-6 text-gray-500">Loading users...</div>
//                   ) : displayedUsers.length === 0 ? (
//                     <div className="py-6 text-gray-500 italic">No users for this filter.</div>
//                   ) : (
//                     displayedUsers.map((u) => {
//                       const approved = isApprovedUser(u);
//                       const uid = u._id || u.id;
//                       const initials = (u.name || "—").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
//                       return (
//                         <article
//                           key={uid}
//                           className={`w-72 flex-shrink-0 rounded-2xl p-4 border ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} hover:shadow-lg transition`}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${approved ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}>
//                               {initials}
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <h4 className="font-semibold">{u.name || "No name"}</h4>
//                                   <div className="text-xs text-gray-500">{u.email}</div>
//                                 </div>
//                                 <div className="text-right text-xs">
//                                   <div className={`font-semibold ${approved ? "text-green-600" : "text-yellow-600"}`}>
//                                     {approved ? "Approved" : (u.status || "Pending")}
//                                   </div>
//                                   <div className="text-gray-400 mt-1">Role: {u.role}</div>
//                                 </div>
//                               </div>

//                               <div className="mt-4 flex gap-2">
//                                 <button
//                                   onClick={() => handleApproval(uid, u.role)}
//                                   disabled={approved || approvingId === uid}
//                                   className={`flex-1 rounded-lg py-2 text-sm font-semibold ${approved ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
//                                 >
//                                   {approvingId === uid ? "Approving..." : (approved ? "Approved" : "Approve")}
//                                 </button>

//                                 <button
//                                   onClick={() => handleRejection(uid, u.role)}
//                                   disabled={rejectingId === uid}
//                                   className="rounded-lg px-3 py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
//                                 >
//                                   {rejectingId === uid ? "Rejecting..." : "Reject"}
//                                 </button>
//                               </div>

//                               <div className="mt-3 text-xs text-gray-400">
//                                 <strong>ID:</strong> {uid}
//                               </div>
//                             </div>
//                           </div>
//                         </article>
//                       );
//                     })
//                   )}
//                 </div>
//               </div> */}

//               {/* compact grid fallback for smaller screens */}
//               {/* <div className="mt-6 sm:hidden grid gap-4">
//                 {displayedUsers.slice(0,6).map(u => {
//                   const uid = u._id || u.id;
//                   const approved = isApprovedUser(u);
//                   return (
//                     <div key={uid} className={`p-3 rounded-lg border ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <div className="font-semibold">{u.name}</div>
//                           <div className="text-xs text-gray-500">{u.email}</div>
//                         </div>
//                         <div className={`text-sm font-semibold ${approved ? "text-green-600" : "text-yellow-600"}`}>{approved ? "Approved" : (u.status || "Pending")}</div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </motion.div> 
//           </section> 
//         </div>
//       </main>

//       {/* Poppins font import */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
//         * { font-family: 'Poppins', sans-serif !important; }
//       `}</style>
//     </div>
//   );
// }

// export default CreateTeams;



import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import {
  Users,
  UserCheck,
  UserX,
  Filter,
  PlusCircle,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

/*
  IMPORTANT: Logic, handlers, state names, API endpoints and all behavior
  are unchanged. Only markup + styling/layout is replaced to a bold, section-based
  minimalistic design per your request.
*/

function CreateTeams() {
  const { theme } = useContext(ThemeContext);
  const { user, token } = useUser();
  const authHeader = token || localStorage.getItem("authToken") || "";

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // approvals UI state
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  // create team UI state
  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [coachId, setCoachId] = useState("");
  const [creating, setCreating] = useState(false);

  // filter for users list: all, participants, coaches, pending, approved
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/users/getAllUsers", {
          headers: authHeader ? { Authorization: `Bearer ${authHeader}` } : {},
        });

        // 🔥 FIXED: Handle backend response structure
        let users = [];
        
        // Check if response.data is an array
        if (Array.isArray(res.data)) {
          users = res.data;
        } 
        // Check if response.data has a data property that's an array (your backend format)
        else if (res.data && Array.isArray(res.data.data)) {
          users = res.data.data;
        }
        // Check if response.data has a users property that's an array
        else if (res.data && Array.isArray(res.data.users)) {
          users = res.data.users;
        }
        // Handle single object case
        else if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
          // If it's a single user object, wrap it in array
          if (res.data._id || res.data.id) {
            users = [res.data];
          }
        }
        
        console.log("Processed users:", users); // Debug log
        
        if (!isMounted) return;
        setAllUsers(users);

        // If current user is coach, auto-select as 
        if (user?.role === "coach") {
          setCoachId(user._id || user.id);
        } else if (!coachId && users.length) {
          // Optionally preselect first coach if none selected
          const firstCoach = users.find((u) => u.role === "coach");
          if (firstCoach) setCoachId(firstCoach._id || firstCoach.id);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users");
        setAllUsers([]); // Set to empty array on error
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [authHeader, user, coachId]);

  const isApprovedUser = (u) => {
    if (!u) return false;
    return u.approved === true || u.status === "approved";
  };

  // Approve user endpoint + UI
  const handleApproval = async (userId, userType = "user") => {
    try {
      setApprovingId(userId);
      console.log(userId || user._id)
      const res = await axios.patch(
        `http://localhost:3000/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authHeader}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("handleApprove", res.data);

      const success = res?.data?.success ?? (res.status >= 200 && res.status < 300);
      console.log("suceess", success);
      if (success) {
        setAllUsers((prev) =>
          prev.map((u) =>
            u._id === userId || u.id === userId
              ? { ...u, approved: true, status: "approved" }
              : u
          )
        );
        toast.success(`${userType} approved successfully`, { position: "top-right", autoClose: 2000 });
      } else {
        throw new Error(res?.data?.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to approve user");
    } finally {
      setApprovingId(null);
    }
  };

  // Reject user endpoint + UI
  const handleRejection = async (userId, userType = "user") => {
    if (!window.confirm(`Reject and delete this ${userType}? This can't be undone.`)) return;

    try {
      setRejectingId(userId);
      const res = await axios.delete(`http://localhost:3000/users/${userId}/reject`, {
        headers: { Authorization: `Bearer ${authHeader}` },
      });
          console.log("rejection", res.data)
      const success = res?.data?.success ?? (res.status >= 200 && res.status < 300);
      if (success) {
        setAllUsers((prev) => prev.filter((u) => u._id !== userId && u.id !== userId));
        toast.success(`${userType} rejected and removed.`, { position: "top-right" });
      } else {
        throw new Error(res?.data?.message || "Rejection failed");
      }
    } catch (err) {
      console.error("Rejection error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to reject user");
    } finally {
      setRejectingId(null);
    }
  };

  // Create team (sends member IDs and optional coach)
  const handleCreateTeam = async () => {
    if (!teamName.trim() || !sport.trim() || selectedMembers.length === 0) {
      toast.error("Please fill team name, sport and select at least one member.");
      return;
    }

    const coachToSend = coachId || (user?.role === "coach" ? (user._id || user.id) : undefined);
    const body = {
      name: teamName.trim(),
      sport: sport.trim(),
      members: selectedMembers,
      ...(coachToSend ? { coach: coachToSend } : {}),
    };

    try {
      setCreating(true);
      const res = await axios.post("http://localhost:3000/team/teams", body, {
        headers: {
          Authorization: `Bearer ${authHeader}`,
          "Content-Type": "application/json",
        },
      });

      const success = res?.data?.success ?? (res.status >= 200 && res.status < 300);
      if (success) {
        toast.success(res.data.message || "Team created successfully");
        setTeamName("");
        setSport("");
        setSelectedMembers([]);
      } else {
        throw new Error(res?.data?.message || "Failed to create team");
      }
    } catch (err) {
      console.error("Create team error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to create team");
    } finally {
      setCreating(false);
    }
  };

  // 🔥 FIXED: Safe filtering with array check
  const displayedUsers = Array.isArray(allUsers) 
    ? allUsers.filter((u) => {
        if (!u) return false;
        switch (filter) {
          case "participants":
            return u.role === "participant";
          case "coaches":
            return u.role === "coach";
          case "pending":
            return !(u.approved === true || u.status === "approved");
          case "approved":
            return u.approved === true || u.status === "approved";
          case "all":
          default:
            return true;
        }
      })
    : [];

  // approved participants for team select - with array check
  const approvedParticipants = Array.isArray(allUsers) 
    ? allUsers.filter((u) => u.role === "participant" && isApprovedUser(u))
    : [];

  /* -------------------------
     UI: bold, section-based design
     ------------------------- */
  const dark = theme === "dark";
  const pageBg = dark ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-600";
  const surface = dark ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200";
  const controlBg = dark ? "bg-gray-800" : "bg-white";

  return (
    <div className={`${pageBg} min-h-screen font-[Poppins]`}>
      <ToastContainer theme={theme} position="top-right" />

      {/* HERO */}
      <header className="max-w-6xl mx-auto px-6 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight"
            >
              Build your teams <span className="text-teal-600"> fast</span>
            </motion.h1>
            <p className={`mt-3 max-w-xl ${muted}`}>
              Create teams, choose members, and approve participants from one streamlined place. This layout focuses on clarity and speed.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-transparent">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="ml-3 text-sm">
                <div className="font-semibold">{Array.isArray(allUsers) ? allUsers.length : 0}</div>
                <div className="text-xs text-gray-400">total users</div>
              </div>
            </div>

            <div className="rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-800">
              <Filter className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN AREA */}
      <main className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Large clean form (spacious, sectioned) */}
          <section className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className={`rounded-3xl p-8 ${surface} border shadow-sm`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Create Team</h2>
                  <p className={`text-sm ${muted}`}>Large form with clear fields — no clutter.</p>
                </div>
                <div className="text-sm text-gray-400">Required *</div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Team name *</label>
                  <input
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="E.g., Downtown Eagles"
                    className={`w-full rounded-xl px-4 py-3 border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sport *</label>
                  <input
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    placeholder="E.g., Football"
                    className={`w-full rounded-xl px-4 py-3 border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Coach (optional)</label>
                  <select
                    value={coachId}
                    onChange={(e) => setCoachId(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  >
                    <option value="">{user?.role === "coach" ? `${user.name} (You)` : "Select coach"}</option>
                    {Array.isArray(allUsers) && allUsers.filter((u) => u.role === "coach").map((c) => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Members *</label>
                  <div className="grid grid-cols-1 gap-2">
                    <select
                      multiple
                      value={selectedMembers}
                      onChange={(e) => setSelectedMembers(Array.from(e.target.selectedOptions, (o) => o.value))}
                      className={`w-full h-44 rounded-xl px-3 py-2 border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                    >
                      {approvedParticipants.length === 0 ? (
                        <option disabled>No approved participants</option>
                      ) : (
                        approvedParticipants.map((p) => (
                          <option key={p._id || p.id} value={p._id || p.id}>
                            {p.name} — {p.email}
                          </option>
                        ))
                      )}
                    </select>
                    <div className="text-xs text-gray-400">Hold Cmd/Ctrl to select multiple</div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCreateTeam}
                    disabled={creating || !teamName.trim() || !sport.trim() || selectedMembers.length === 0}
                    className={`w-full rounded-xl py-3 font-semibold text-white transition ${creating || !teamName.trim() || !sport.trim() || selectedMembers.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow"}`}
                  >
                    {creating ? "Creating..." : "Create team"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* small quick stats */}
            <div className="mt-6 flex gap-4">
              <div className={`flex-1 rounded-2xl p-4 ${dark ? "bg-gray-900" : "bg-gray-50"} border ${dark ? "border-gray-800" : "border-gray-200"}`}>
                <div className="text-xs text-gray-400">Approved participants</div>
                <div className="mt-2 text-2xl font-bold">{approvedParticipants.length}</div>
              </div>
              <div className={`flex-1 rounded-2xl p-4 ${dark ? "bg-gray-900" : "bg-gray-50"} border ${dark ? "border-gray-800" : "border-gray-200"}`}>
                <div className="text-xs text-gray-400">Available coaches</div>
                <div className="mt-2 text-2xl font-bold">{Array.isArray(allUsers) ? allUsers.filter(u => u.role === "coach").length : 0}</div>
              </div>
            </div>
          </section>

          {/* RIGHT: Immersive user canvas (horizontal/flow layout) */}
          <section className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className={`rounded-3xl p-6 ${surface} border shadow-sm`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="text-xl font-semibold">Participants & Approvals</h3>
                    <p className={`text-sm ${muted}`}>Approve, reject and add members — the canvas adapts to your workflow.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400 hidden sm:block">Filter</div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className={`px-3 py-2 rounded-xl border ${dark ? "border-gray-800" : "border-gray-200"} ${controlBg} focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  >
                    <option value="all">All</option>
                    <option value="participants">Participants</option>
                    <option value="coaches">Coaches</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              </div>

              {/* horizontal scroll area for users (nice visual exploration) */}
              <div className="overflow-x-auto -mx-4 px-4 pb-4">
                <div className="flex gap-4 w-max">
                  {loading ? (
                    <div className="flex items-center justify-center w-full py-6 text-gray-500">Loading users...</div>
                  ) : displayedUsers.length === 0 ? (
                    <div className="py-6 text-gray-500 italic">No users for this filter.</div>
                  ) : (
                    displayedUsers.map((u) => {
                      const approved = isApprovedUser(u);
                      const uid = u._id || u.id;
                      const initials = (u.name || "—").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
                      return (
                        <article
                          key={uid}
                          className={`w-72 flex-shrink-0 rounded-2xl p-4 border ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} hover:shadow-lg transition`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${approved ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                              {initials}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold">{u.name || "No name"}</h4>
                                  <div className="text-xs text-gray-500">{u.email}</div>
                                </div>
                                <div className="text-right text-xs">
                                  <div className={`font-semibold ${approved ? "text-green-600" : "text-yellow-600"}`}>
                                    {approved ? "Approved" : (u.status || "Pending")}
                                  </div>
                                  <div className="text-gray-400 mt-1">Role: {u.role}</div>
                                </div>
                              </div>

                              <div className="mt-4 flex gap-2">
                                <button
                                  onClick={() => handleApproval(uid, u.role)}
                                  disabled={approved || approvingId === uid}
                                  className={`flex-1 rounded-lg py-2 text-sm font-semibold ${approved ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                                >
                                  {approvingId === uid ? "Approving..." : (approved ? "Approved" : "Approve")}
                                </button>

                                <button
                                  onClick={() => handleRejection(uid, u.role)}
                                  disabled={rejectingId === uid}
                                  className="rounded-lg px-3 py-2 text-sm font-semibold bg-red-600 text-white hover:bg-red-700"
                                >
                                  {rejectingId === uid ? "Rejecting..." : "Reject"}
                                </button>
                              </div>

                              <div className="mt-3 text-xs text-gray-400">
                                <strong>ID:</strong> {uid}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>

              {/* compact grid fallback for smaller screens */}
              <div className="mt-6 sm:hidden grid gap-4">
                {displayedUsers.slice(0,6).map(u => {
                  const uid = u._id || u.id;
                  const approved = isApprovedUser(u);
                  return (
                    <div key={uid} className={`p-3 rounded-lg border ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                        <div className={`text-sm font-semibold ${approved ? "text-green-600" : "text-yellow-600"}`}>{approved ? "Approved" : (u.status || "Pending")}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Poppins font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
}

export default CreateTeams;