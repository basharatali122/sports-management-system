
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Loader2, UserX } from "lucide-react";

function ManageUser() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { themeMode } = useContext(ThemeContext);

  const isDark = themeMode === "dark";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/users/getAllCoaches");
        
        // 🔥 FIXED: Handle different response structures
        let users = [];
        
        // Check if response.data is an array (direct array)
        if (Array.isArray(response.data)) {
          users = response.data;
        } 
        // Check if response.data has a data property that's an array (your backend format)
        else if (response.data && Array.isArray(response.data.data)) {
          users = response.data.data;
        }
        // Check if response.data is an object with users property
        else if (response.data && Array.isArray(response.data.users)) {
          users = response.data.users;
        }
        // Handle case where it's a single object with data property
        else if (response.data && response.data.data && !Array.isArray(response.data.data)) {
          // Convert single object to array
          users = [response.data.data];
        }
        else {
          console.error("Unexpected response format:", response.data);
          users = [];
        }
        
        console.log("Processed users:", users); // Debug log
        setAllUsers(users);
        
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        setAllUsers([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleApproval = async (userId, userType) => {
    try {
      const token = localStorage.getItem("token"); // 🔥 Make sure this matches your storage key
      
      const response = await axios.patch(
        `http://localhost:3000/users/${userId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔥 FIXED: Handle response structure
      if (response.status === 200 || response.status === 201) {
        setAllUsers((prev) =>
          prev.map((user) =>
            user._id === userId || user.id === userId 
              ? { ...user, approved: true, status: "approved" } 
              : user
          )
        );
        toast.success(`${userType} approved successfully`);
      } else {
        throw new Error(response.data?.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Approval failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRejection = async (userId, userType) => {
    if (window.confirm(`Are you sure you want to reject this ${userType}?`)) {
      try {
        const token = localStorage.getItem("token");
        
        const response = await axios.delete(
          `http://localhost:3000/users/${userId}/reject`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.status === 200 || response.status === 204) {
          setAllUsers((prev) => prev.filter((user) => user._id !== userId && user.id !== userId));
          toast.success(`${userType} rejected and removed from the system`);
        }
      } catch (error) {
        console.error("Rejection error:", error);
        toast.error("Rejection failed: " + (error.response?.data?.message || error.message));
      }
    }
  };

  // 🔥 FIXED: Safe filtering with null/undefined check
  const filteredUsers = Array.isArray(allUsers) 
    ? allUsers.filter((user) => {
        if (!user) return false;
        
        if (filter === "all") return true;
        if (filter === "pending") return user.status === "pending" || !user.approved;
        if (filter === "approved") return user.status === "approved" || user.approved === true;
        if (filter === "rejected") return user.status === "rejected";
        return true;
      })
    : [];

  const tableBg = isDark ? "bg-gray-900/60 border-gray-700" : "bg-white/60 border-emerald-100";
  const headerBg = isDark ? "bg-emerald-800 text-gray-100" : "bg-emerald-600 text-white";
  const hoverRow = isDark ? "hover:bg-gray-800" : "hover:bg-emerald-50";

  return (
    <div className="w-full px-6 py-8 font-[Poppins] transition-colors duration-300">
      {/* Filters */}
      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full font-medium border transition-all duration-300 ${
              filter === f
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                : `border-gray-300 ${
                    isDark
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                      : "bg-white text-gray-700 hover:bg-emerald-100"
                  }`
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} Users
          </button>
        ))}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`overflow-hidden rounded-2xl shadow-xl backdrop-blur-md border ${tableBg}`}
      >
        {loading ? (
          <div className="flex justify-center items-center py-20 text-emerald-600">
            <Loader2 className="animate-spin mr-2" /> Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className={`${headerBg}`}>
                <tr>
                  {["Name", "Email", "Role", "Status", "Actions"].map((header) => (
                    <th key={header} className="px-6 py-4 text-left font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id || user.id || Math.random()}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      className={`border-b border-gray-200 dark:border-gray-700 ${hoverRow} transition`}
                    >
                      <td className="px-6 py-4 font-medium">{user.name || "N/A"}</td>
                      <td className="px-6 py-4">{user.email || "N/A"}</td>
                      <td className="px-6 py-4 capitalize">{user.role || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.status === "approved" || user.approved === true
                              ? "bg-green-100 text-green-800"
                              : user.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.status || (user.approved ? "approved" : "pending")}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-3">
                        {(user.status !== "approved" && user.approved !== true) ? (
                          <>
                            <button
                              onClick={() => handleApproval(user._id || user.id, user.role)}
                              className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium transition"
                            >
                              <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                            <button
                              onClick={() => handleRejection(user._id || user.id, user.role)}
                              className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400">
                            <UserX className="w-4 h-4" /> Approved
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-500 px-6 py-6 text-sm"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

export default ManageUser;