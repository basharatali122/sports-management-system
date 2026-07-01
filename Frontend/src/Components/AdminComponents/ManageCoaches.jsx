
import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";
import {
  Trash2, ShieldOff, ShieldCheck, Loader2,
  UserCog, Search, UserPlus, X, Eye, EyeOff,
} from "lucide-react";

const BASE_URL = "http://localhost:3000";
const VALID_SPORTS = ["Cricket", "Football", "Tennis", "Hockey"];

const EMPTY_FORM = { name: "", email: "", password: "", sport: "" };

export default function ManageCoaches() {
  const [coaches, setCoaches]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionId, setActionId]       = useState(null);
  const [search, setSearch]           = useState("");
  const [confirmModal, setConfirmModal] = useState(null); // { type, coach }
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]   = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const [showPass, setShowPass]       = useState(false);

  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  const token      = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // ── fetch ────────────────────────────────────────────────
  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const res  = await axios.get(`${BASE_URL}/admin/coaches`, authHeader);
      const data = res.data?.data ?? res.data ?? [];
      setCoaches(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch coaches");
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoaches(); }, []);

  // ── add coach ─────────────────────────────────────────────
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim())    errs.name     = "Name is required";
    if (!form.email.trim())   errs.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password)       errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Min 6 characters";
    if (!form.sport)          errs.sport    = "Please select a sport";
    return errs;
  };

  const handleAddCoach = async () => {
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      const res     = await axios.post(`${BASE_URL}/admin/coaches`, form, authHeader);
      const created = res.data?.data;
      if (created) setCoaches((prev) => [created, ...prev]);
      toast.success("Coach added successfully!");
      setShowAddModal(false);
      setForm(EMPTY_FORM);
      setFormErrors({});
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to add coach";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowPass(false);
  };

  // ── block ────────────────────────────────────────────────
  const handleBlock = async (coach) => {
    setConfirmModal(null);
    setActionId(coach._id);
    try {
      const res     = await axios.patch(`${BASE_URL}/admin/coaches/${coach._id}/block`, {}, authHeader);
      const updated = res.data?.data;
      if (updated) setCoaches((prev) => prev.map((c) => c._id === coach._id ? updated : c));
      toast.success(updated?.accountStatus === "blocked" ? "Coach blocked" : "Coach unblocked");
    } catch { toast.error("Action failed"); }
    finally   { setActionId(null); }
  };

  // ── delete ───────────────────────────────────────────────
  const handleDelete = async (coach) => {
    setConfirmModal(null);
    setActionId(coach._id);
    try {
      await axios.delete(`${BASE_URL}/admin/coaches/${coach._id}`, authHeader);
      setCoaches((prev) => prev.filter((c) => c._id !== coach._id));
      toast.success("Coach deleted");
    } catch { toast.error("Delete failed"); }
    finally { setActionId(null); }
  };

  const filtered = coaches.filter((c) =>
    (c.name + c.email + (c.sport ?? "")).toLowerCase().includes(search.toLowerCase())
  );

  // ── theme helpers ────────────────────────────────────────
  const card       = isDark ? "bg-gray-900/70 border-gray-800 text-gray-100" : "bg-white/80 border-gray-200 text-gray-800";
  const inputCls   = isDark ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400";
  const rowHover   = isDark ? "hover:bg-gray-800/60" : "hover:bg-emerald-50/60";
  const modalBg    = isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800";
  const labelCls   = isDark ? "text-gray-300" : "text-gray-600";
  const fieldCls   = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${inputCls}`;
  const badge      = (s) => s === "blocked"
    ? "bg-red-500/20 text-red-400 border border-red-500/30"
    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserCog className="w-7 h-7 text-emerald-500" />
          <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            Manage Coaches
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
            {coaches.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${inputCls}`}>
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              className="bg-transparent outline-none text-sm w-40"
              placeholder="Search coaches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Add button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors shadow"
          >
            <UserPlus className="w-4 h-4" />
            Add Coach
          </button>
        </div>
      </div>

      {/* ── Table ── */}
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
          <p className="text-center py-16 text-gray-400">No coaches found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${isDark ? "bg-gray-800/80 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Sport</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/20">
                {filtered.map((coach, idx) => (
                  <tr key={coach._id} className={`transition-colors ${rowHover}`}>
                    <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-5 py-3 font-medium">{coach.name}</td>
                    <td className="px-5 py-3 text-gray-400">{coach.email}</td>
                    <td className="px-5 py-3">{coach.sport ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge(coach.accountStatus)}`}>
                        {coach.accountStatus === "blocked" ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setConfirmModal({ type: "block", coach })}
                          disabled={actionId === coach._id}
                          title={coach.accountStatus === "blocked" ? "Unblock" : "Block"}
                          className={`p-2 rounded-lg transition-colors ${
                            coach.accountStatus === "blocked"
                              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                          }`}
                        >
                          {actionId === coach._id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : coach.accountStatus === "blocked"
                              ? <ShieldCheck className="w-4 h-4" />
                              : <ShieldOff className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => setConfirmModal({ type: "delete", coach })}
                          disabled={actionId === coach._id}
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

      {/* ── Add Coach Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-6 w-full max-w-md shadow-2xl border ${modalBg}`}
            >
              {/* modal header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-bold">Add New Coach</h3>
                </div>
                <button onClick={closeAddModal} className="p-1 rounded-lg hover:bg-gray-700/30">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Full Name</label>
                  <input
                    className={`${fieldCls} ${formErrors.name ? "border-red-500" : ""}`}
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setFormErrors({ ...formErrors, name: "" }); }}
                  />
                  {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Email</label>
                  <input
                    type="email"
                    className={`${fieldCls} ${formErrors.email ? "border-red-500" : ""}`}
                    placeholder="coach@example.com"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setFormErrors({ ...formErrors, email: "" }); }}
                  />
                  {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className={`${fieldCls} pr-10 ${formErrors.password ? "border-red-500" : ""}`}
                      placeholder="Min 6 characters"
                      value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setFormErrors({ ...formErrors, password: "" }); }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
                </div>

                {/* Sport */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelCls}`}>Sport</label>
                  <select
                    className={`${fieldCls} ${formErrors.sport ? "border-red-500" : ""}`}
                    value={form.sport}
                    onChange={(e) => { setForm({ ...form, sport: e.target.value }); setFormErrors({ ...formErrors, sport: "" }); }}
                  >
                    <option value="">Select a sport</option>
                    {VALID_SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {formErrors.sport && <p className="text-red-400 text-xs mt-1">{formErrors.sport}</p>}
                </div>
              </div>

              {/* actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeAddModal}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCoach}
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {submitting ? "Adding..." : "Add Coach"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Modal (block / delete) ── */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-6 w-80 shadow-2xl border ${modalBg}`}
            >
              <h3 className="text-lg font-bold mb-2">
                {confirmModal.type === "delete"
                  ? "Delete Coach?"
                  : confirmModal.coach.accountStatus === "blocked" ? "Unblock Coach?" : "Block Coach?"}
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                {confirmModal.type === "delete"
                  ? `Permanently delete "${confirmModal.coach.name}"? This cannot be undone.`
                  : confirmModal.coach.accountStatus === "blocked"
                    ? `Unblock "${confirmModal.coach.name}"? They will regain access.`
                    : `Block "${confirmModal.coach.name}"? They won't be able to log in.`}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal(null)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmModal.type === "delete" ? handleDelete(confirmModal.coach) : handleBlock(confirmModal.coach)}
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