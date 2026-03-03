import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import {
  UserCheck,
  UserX,
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

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
        const response = await axios.get(
          "http://localhost:3000/users/getAllparticipant"
        );
        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleApproval = async (userId, userType) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.data.success) {
        setAllUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, approved: true, status: "approved" } : u
          )
        );
        toast.success(`${userType} approved successfully`);
      } else {
        throw new Error(response.data.message || "Approval failed");
      }
    } catch (error) {
      toast.error(
        "Approval failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleRejection = async (userId, userType) => {
    if (window.confirm(`Are you sure you want to reject this ${userType}?`)) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}/reject`);
        setAllUsers((prev) => prev.filter((u) => u._id !== userId));
        toast.success(`${userType} rejected and removed from the system`);
      } catch (error) {
        toast.error("Rejection failed");
      }
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    if (filter === "all") return true;
    if (filter === "pending") return user.status === "pending";
    if (filter === "approved") return user.status === "approved";
    if (filter === "rejected") return user.status === "rejected";
    return true;
  });

  const bgColor = isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const headerBg = isDark ? "bg-gray-800 text-gray-200" : "bg-teal-500 text-white";

  return (
    <div className={`min-h-screen w-full ${bgColor}  transition-colors duration-300 font-[Poppins]`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-6 md:px-10 py-10"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-teal-500" />
            <h1 className="text-3xl font-bold">Manage Participants</h1>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            {["all", "pending", "approved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm border transition-all duration-300 ${
                  filter === f
                    ? "bg-teal-600 text-white border-blue-600 shadow-md"
                    : "bg-transparent border-gray-400 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                {f === "all" && <Users className="w-4 h-4" />}
                {f === "pending" && <Clock className="w-4 h-4" />}
                {f === "approved" && <CheckCircle className="w-4 h-4" />}
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* User Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`overflow-hidden shadow-xl rounded-2xl ${cardBg}`}
        >
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <table className="min-w-full text-sm">
                <thead className={`${headerBg}`}>
                  <tr>
                    {["Name", "Email", "Role", "Status", "Actions"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left font-semibold tracking-wide"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{
                          scale: 1.01,
                          backgroundColor: isDark ? "#111827" : "#f0f7ff",
                        }}
                        className="transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4 capitalize">{user.role}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                              user.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : user.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.status === "approved" && <CheckCircle className="w-3 h-3" />}
                            {user.status === "rejected" && <XCircle className="w-3 h-3" />}
                            {user.status === "pending" && <Clock className="w-3 h-3" />}
                            {user.status || "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.status !== "approved" ? (
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleApproval(user._id, user.role)}
                                className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium transition"
                              >
                                <UserCheck className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejection(user._id, user.role)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition"
                              >
                                <UserX className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">Approved</span>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center px-6 py-8 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ManageUser;
