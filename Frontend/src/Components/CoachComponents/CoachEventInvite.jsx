/**
 * CoachParticipants.jsx
 * Place: Frontend/src/Components/CoachComponents/CoachParticipants.jsx
 *
 * Features:
 *  - Lists participants whose sportsPreferences include coach's sport
 *  - Tab filter: All / Pending approval / Approved / Rejected
 *  - Approve / Reject pending participants
 *  - Edit participant profile (name, sports prefs, achievements, bio)
 *  - Search by name / email
 */
import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast } from "react-hot-toast";
import {
  Users, Search, CheckCircle, XCircle, Pencil,
  Loader2, X, Save, ChevronDown,
} from "lucide-react";

const BASE_URL     = "http://localhost:3000";
const VALID_SPORTS = ["Cricket", "Football", "Tennis", "Hockey"];

export default function CoachParticipants() {
  const [participants, setParticipants] = useState([]);
  const [sport, setSport]               = useState("");
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filter, setFilter]             = useState("all");   // all | pending | approved | rejected
  const [actionId, setActionId]         = useState(null);
  const [editModal, setEditModal]       = useState(null);    // participant doc
  const [editForm, setEditForm]         = useState({});
  const [saving, setSaving]             = useState(false);

  const { themeMode } = useContext(ThemeContext);
  const isDark = themeMode === "dark";

  const token      = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // ── fetch ─────────────────────────────────────────────
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/coach/participants`, authHeader);
      setParticipants(res.data?.data?.participants ?? []);
      setSport(res.data?.data?.sport ?? "");
    } catch {
      toast.error("Failed to load participants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParticipants(); }, []);

  // ── approve ───────────────────────────────────────────
  const handleApprove = async (p) => {
    setActionId(p._id + "_approve");
    try {
      const res = await axios.patch(
        `${BASE_URL}/coach/participants/${p._id}/approve`, {}, authHeader
      );
      const updated = res.data?.data;
      setParticipants((prev) => prev.map((x) => x._id === p._id ? updated : x));
      toast.success(`${p.name} approved`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Approval failed");
    } finally { setActionId(null); }
  };

  // ── reject ────────────────────────────────────────────
  const handleReject = async (p) => {
    setActionId(p._id + "_reject");
    try {
      const res = await axios.patch(
        `${BASE_URL}/coach/participants/${p._id}/reject`, {}, authHeader
      );
      const updated = res.data?.data;
      setParticipants((prev) => prev.map((x) => x._id === p._id ? updated : x));
      toast.success(`${p.name} rejected`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Rejection failed");
    } finally { setActionId(null); }
  };

  // ── open edit modal ───────────────────────────────────
  const openEdit = (p) => {
    setEditModal(p);
    setEditForm({
      name:              p.name || "",
      sportsPreferences: p.sportsPreferences || [],
      achievements:      p.achievements || "",
      bio:               p.bio || "",
      phone:             p.phone || "",
      age:               p.age || "",
    });
  };

  const toggleSport = (s) => {
    const cur = editForm.sportsPreferences || [];
    if (cur.includes(s)) {
      setEditForm({ ...editForm, sportsPreferences: cur.filter((x) => x !== s) });
    } else if (cur.length < 2) {
      setEditForm({ ...editForm, sportsPreferences: [...cur, s] });
    } else {
      toast.error("Maximum 2 sports");
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) { toast.error("Name is required"); return; }
    if (!editForm.sportsPreferences.length) { toast.error("Select at least one sport"); return; }
    setSaving(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/coach/participants/${editModal._id}`,
        editForm,
        authHeader
      );
      const updated = res.data?.data;
      setParticipants((prev) => prev.map((x) => x._id === editModal._id ? updated : x));
      toast.success("Profile updated");
      setEditModal(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally { setSaving(false); }
  };

  // ── filtered list ─────────────────────────────────────
  const filtered = participants.filter((p) => {
    const matchSearch = (p.name + p.email).toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "pending")  return !p.approvedByCoach && p.status !== "rejected";
    if (filter === "approved") return p.approvedByCoach && p.status === "approved";
    if (filter === "rejected") return p.status === "rejected";
    return true;
  });

  // ── theme ──────────────────────────────────────────────
  const card    = isDark ? "bg-gray-900/70 border-gray-800" : "bg-white/80 border-gray-200";
  const text    = isDark ? "text-gray-100" : "text-gray-800";
  const sub     = isDark ? "text-gray-400" : "text-gray-500";
  const inputC  = isDark ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-400";
  const row     = isDark ? "hover:bg-gray-800/60" : "hover:bg-emerald-50/50";
  const modalBg = isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800";
  const field   = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${inputC}`;

  const statusBadge = (p) => {
    if (p.status === "rejected")         return "bg-red-500/20 text-red-400 border-red-500/30";
    if (p.approvedByCoach)               return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };
  const statusLabel = (p) => {
    if (p.status === "rejected")  return "Rejected";
    if (p.approvedByCoach)        return "Approved";
    return "Pending";
  };

  const tabs = ["all", "pending", "approved", "rejected"];

  return (
    <div className="w-full px-6 py-8 space-y-6 font-[Poppins]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-emerald-500" />
          <div>
            <h2 className={`text-2xl font-bold ${text}`}>
              {sport} Participants
            </h2>
            <p className={`text-xs ${sub}`}>Manage participants in your sport</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
            {participants.length}
          </span>
        </div>

        {/* Search */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${inputC} w-full sm:w-64`}>
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            className="bg-transparent outline-none text-sm w-full"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === t
                ? "bg-emerald-500 border-emerald-500 text-white"
                : isDark
                  ? "border-gray-700 text-gray-400 hover:border-emerald-500 hover:text-emerald-400"
                  : "border-gray-200 text-gray-500 hover:border-emerald-400 hover:text-emerald-600"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "pending" && (
              <span className="ml-1">
                ({participants.filter((p) => !p.approvedByCoach && p.status !== "rejected").length})
              </span>
            )}
          </button>
        ))}
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
          <p className={`text-center py-16 ${sub}`}>No participants found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${isDark ? "bg-gray-800/80 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Sports</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/20">
                {filtered.map((p, idx) => (
                  <tr key={p._id} className={`transition-colors ${row}`}>
                    <td className={`px-5 py-3 ${sub}`}>{idx + 1}</td>
                    <td className={`px-5 py-3 font-medium ${text}`}>{p.name}</td>
                    <td className={`px-5 py-3 ${sub}`}>{p.email}</td>
                    <td className={`px-5 py-3 ${sub} text-xs`}>
                      {(p.sportsPreferences || []).join(", ") || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(p)}`}>
                        {statusLabel(p)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">

                        {/* Approve button — only if not yet approved */}
                        {!p.approvedByCoach && p.status !== "rejected" && (
                          <button
                            onClick={() => handleApprove(p)}
                            disabled={actionId === p._id + "_approve"}
                            title="Approve"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-medium transition-colors"
                          >
                            {actionId === p._id + "_approve"
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <CheckCircle className="w-3 h-3" />
                            }
                            Approve
                          </button>
                        )}

                        {/* Reject button — only if not yet rejected */}
                        {p.status !== "rejected" && (
                          <button
                            onClick={() => handleReject(p)}
                            disabled={actionId === p._id + "_reject"}
                            title="Reject"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-medium transition-colors"
                          >
                            {actionId === p._id + "_reject"
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <XCircle className="w-3 h-3" />
                            }
                            Reject
                          </button>
                        )}

                        {/* Edit button — always available */}
                        <button
                          onClick={() => openEdit(p)}
                          title="Edit Profile"
                          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
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

      {/* ── Edit Profile Modal ── */}
      <AnimatePresence>
        {editModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-6 w-full max-w-md shadow-2xl border ${modalBg} max-h-[90vh] overflow-y-auto`}
            >
              {/* header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-blue-400" /> Edit Profile
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {editModal.email}
                  </p>
                </div>
                <button onClick={() => setEditModal(null)} className="p-1 rounded-lg hover:bg-gray-700/30">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Full Name</label>
                  <input
                    className={field}
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Participant name"
                  />
                </div>

                {/* Sports Preferences */}
                <div>
                  <label className={`block text-xs font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    Sports Preferences <span className="text-gray-500">(1–2)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {VALID_SPORTS.map((s) => {
                      const sel = (editForm.sportsPreferences || []).includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSport(s)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                            sel
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : isDark
                                ? "bg-gray-800 border-gray-700 text-gray-300 hover:border-emerald-500"
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-emerald-400"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Phone</label>
                  <input
                    className={field}
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="03xx-xxxxxxx"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Age</label>
                  <input
                    type="number"
                    className={field}
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    placeholder="Age"
                  />
                </div>

                {/* Achievements */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Achievements</label>
                  <textarea
                    rows={2}
                    className={`${field} resize-none`}
                    value={editForm.achievements}
                    onChange={(e) => setEditForm({ ...editForm, achievements: e.target.value })}
                    placeholder="e.g. Best bowler 2023..."
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Bio</label>
                  <textarea
                    rows={2}
                    className={`${field} resize-none`}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Short bio..."
                  />
                </div>
              </div>

              {/* actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditModal(null)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif !important; }
      `}</style>
    </div>
  );
}