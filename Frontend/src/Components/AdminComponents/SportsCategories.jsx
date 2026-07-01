

import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import { PlusCircle, Trash2, Trophy, Loader2 } from "lucide-react";

function SportsCategories() {
  const [categories, setCategories] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  // 🔥 Always get fresh token
  const getToken = () => localStorage.getItem("token");

  // ================= FETCH CATEGORIES =================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:3000/sport-categories"
      );

      setCategories(
        Array.isArray(res.data.data?.categories)
          ? res.data.data.categories
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH ORGANIZERS =================
  const fetchOrganizers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/users/getAllCoaches"
      );

      setOrganizers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      toast.error("Failed to fetch organizers");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchOrganizers();
  }, []);

  // ================= ADD CATEGORY =================
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      return toast.warning("Category name required");
    }

    try {
      setActionLoading(true);

      await axios.post(
        "http://localhost:3000/sport-categories/",
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      setNewCategory("");
      toast.success("Category added successfully");
      fetchCategories();
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to add category"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ================= ASSIGN ORGANIZER =================
  const handleAssignOrganizer = async (categoryId, organizerId) => {
    if (!organizerId) return;

    try {
      setActionLoading(true);

      await axios.put(
        `http://localhost:3000/sport-categories/${categoryId}/assign-organizer`,
        { organizerId },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      toast.success("Organizer assigned successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to assign organizer");
    } finally {
      setActionLoading(false);
    }
  };

  // ================= DELETE CATEGORY =================
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      setActionLoading(true);

      await axios.delete(
        `http://localhost:3000/sport-categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="w-full px-6 py-8 font-[Poppins] transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-2xl shadow-lg backdrop-blur-md border ${
          isDark
            ? "bg-gray-900/60 border-gray-700"
            : "bg-white/70 border-blue-100"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center gap-2 mb-8">
          <Trophy className="text-blue-500 w-6 h-6" />
          <h2
            className={`text-2xl font-semibold ${
              isDark ? "text-gray-100" : "text-blue-600"
            }`}
          >
            Manage Sports Categories
          </h2>
        </div>

        {/* ADD CATEGORY */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className={`flex-1 px-4 py-3 rounded-xl border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          />
          <button
            onClick={handleAddCategory}
            disabled={actionLoading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            {actionLoading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-10 text-blue-500">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Organizer</th>
                  <th className="p-3 text-left">Assign</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <tr key={cat._id} className="border-b">
                      <td className="p-3">{cat.name}</td>

                      <td className="p-3">
                        {cat.organizer?.name || "Not Assigned"}
                      </td>

                      <td className="p-3">
                        <select
                          value={cat.organizer?._id || ""}
                          onChange={(e) =>
                            handleAssignOrganizer(cat._id, e.target.value)
                          }
                          className="px-3 py-2 border rounded"
                        >
                          <option value="">Select Organizer</option>
                          {organizers.map((org) => (
                            <option key={org._id} value={org._id}>
                              {org.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-5 text-gray-500">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default SportsCategories;