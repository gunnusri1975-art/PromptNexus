"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    CheckCircle,
    XCircle,
    Shield,
    Search,
    Mail,
    Calendar,
    RefreshCcw,
    BookOpen,
    Plus,
    Trash2,
    X
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { AdminService } from "@/lib/services/admin";
import { collection, onSnapshot, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getPromptsAction, addPromptAction, deletePromptAction } from "@/lib/actions/prompts";

// =========================================
// Prompt Types & Constants
// =========================================
const CATEGORIES = ["Business", "Creative", "Coding", "Marketing", "Productivity", "Learning", "Other"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Expert", "Professional"];

type Prompt = {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    difficulty: string;
    tags: string[];
    approved: boolean;
};

const emptyForm = { title: "", description: "", content: "", category: "Creative", difficulty: "Intermediate", tags: "" };

// =========================================
// Main Admin Dashboard
// =========================================
export default function AdminDashboard() {
    // --- User Management ---
    const [stats, setStats] = useState({ pending: 0, approved: 0, total: 0 });
    const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
    const [usersLoading, setUsersLoading] = useState(true);

    // --- Prompt Management ---
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [promptsLoading, setPromptsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    // --- Users Effect ---
    useEffect(() => {
        const q = query(collection(db, "users"), where("approved", "==", false));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
            setPendingUsers(users);
            setUsersLoading(false);
            updateStats();
        });

        const updateStats = async () => {
            const usersRef = collection(db, "users");
            const [pendingSnap, approvedSnap, totalSnap] = await Promise.all([
                getCountFromServer(query(usersRef, where("approved", "==", false))),
                getCountFromServer(query(usersRef, where("approved", "==", true))),
                getCountFromServer(usersRef)
            ]);
            setStats({
                pending: pendingSnap.data().count,
                approved: approvedSnap.data().count,
                total: totalSnap.data().count
            });
        };

        updateStats();
        return () => unsubscribe();
    }, []);

    // --- Prompts Loader ---
    const loadPrompts = useCallback(async () => {
        setPromptsLoading(true);
        const result = await getPromptsAction();
        if (result.success) setPrompts((result.prompts as Prompt[]) || []);
        setPromptsLoading(false);
    }, []);

    useEffect(() => { loadPrompts(); }, [loadPrompts]);

    // --- Feedback Toast ---
    const showFeedback = (type: "success" | "error", msg: string) => {
        setFeedback({ type, msg });
        setTimeout(() => setFeedback(null), 3000);
    };

    // --- Handlers ---
    const handleApprove = async (uid: string) => {
        try { await AdminService.approveUser(uid); }
        catch (error) { console.error("Approval failed:", error); }
    };

    const handleReject = async (uid: string) => {
        try { await AdminService.rejectUser(uid); }
        catch (error) { console.error("Rejection failed:", error); }
    };

    const handleAddPrompt = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const tagsArray = form.tags.split(",").map(t => t.trim()).filter(Boolean);
        const result = await addPromptAction({
            title: form.title, description: form.description,
            content: form.content, category: form.category,
            difficulty: form.difficulty, tags: tagsArray,
        });
        if (result.success) {
            showFeedback("success", "Prompt added successfully!");
            setForm(emptyForm);
            setShowForm(false);
            loadPrompts();
        } else {
            showFeedback("error", result.message || "Failed to add prompt.");
        }
        setSubmitting(false);
    };

    const handleDeletePrompt = async (id: string) => {
        if (!confirm("Delete this prompt?")) return;
        setDeletingId(id);
        const result = await deletePromptAction(id);
        if (result.success) {
            setPrompts(prev => prev.filter(p => p.id !== id));
            showFeedback("success", "Prompt deleted.");
        } else {
            showFeedback("error", result.message || "Failed to delete.");
        }
        setDeletingId(null);
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">Admin Panel</h1>
                <p className="text-slate-400">Manage user access and prompt library.</p>
            </div>

            {/* ===== Stats ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pending Users", value: stats.pending, icon: Users, color: "amber" },
                    { label: "Approved Users", value: stats.approved, icon: CheckCircle, color: "blue" },
                    { label: "Total Registry", value: stats.total, icon: Shield, color: "purple" },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="p-6 glass border border-white/10 rounded-2xl flex items-center justify-between group">
                        <div>
                            <p className={`text-xs font-bold text-slate-500 uppercase tracking-widest mb-1`}>{label}</p>
                            <p className="text-3xl font-bold text-white">{value}</p>
                        </div>
                        <div className={`w-12 h-12 bg-${color}-500/10 rounded-2xl flex items-center justify-center border border-${color}-500/20`}>
                            <Icon className={`w-6 h-6 text-${color}-500`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* ===== User Approvals ===== */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <RefreshCcw className={`w-5 h-5 text-blue-500 ${usersLoading ? "animate-spin" : ""}`} />
                        User Approvals
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input type="text" placeholder="Search by email..."
                            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" />
                    </div>
                </div>
                <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[300px]">
                    {usersLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <RefreshCcw className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : pendingUsers.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Created</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {pendingUsers.map((user) => (
                                    <tr key={user.uid} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
                                                    {user.name?.charAt(0) || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">{user.name}</p>
                                                    <p className="text-slate-500 text-xs flex items-center gap-1.5">
                                                        <Mail className="w-3 h-3" />{user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase rounded border border-amber-500/20">Pending</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleApprove(user.uid)}
                                                    className="p-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-lg transition-all border border-blue-500/20">
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleReject(user.uid)}
                                                    className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all border border-red-500/20">
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] text-slate-500">
                            <CheckCircle className="w-12 h-12 text-blue-500/20 mb-4" />
                            <p className="text-lg font-bold text-white/50">All users cleared</p>
                            <p className="text-sm">There are no pending approvals at the moment.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== Manage Prompts ===== */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        Manage Prompts
                        <span className="text-sm font-normal text-slate-500">({prompts.length})</span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={loadPrompts} className="text-slate-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                            <RefreshCcw className={`w-4 h-4 ${promptsLoading ? "animate-spin" : ""}`} />
                        </button>
                        <button onClick={() => setShowForm(!showForm)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95">
                            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {showForm ? "Cancel" : "Add Prompt"}
                        </button>
                    </div>
                </div>

                {/* Feedback Toast */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div key="toast" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium border ${feedback.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            {feedback.msg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add Form */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <form onSubmit={handleAddPrompt} className="glass border border-white/10 rounded-2xl p-6 space-y-4">
                                <h3 className="text-base font-bold text-white">New Prompt</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Title</label>
                                        <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                            placeholder="e.g. Creative Story Starter"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all">
                                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Difficulty</label>
                                        <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all">
                                            {DIFFICULTIES.map(d => <option key={d} value={d} className="bg-gray-900">{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tags (comma-separated)</label>
                                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                                            placeholder="writing, story, creativity"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                                        <input required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                            placeholder="Short description of what this prompt does"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Prompt Content</label>
                                        <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                                            rows={5} placeholder="Write the full AI prompt here..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-none font-mono" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" disabled={submitting}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 active:scale-95">
                                        <Plus className="w-4 h-4" />
                                        {submitting ? "Saving..." : "Save Prompt"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Prompt List */}
                {promptsLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCcw className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : prompts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 glass border border-white/10 rounded-2xl">
                        <BookOpen className="w-10 h-10 mb-3 text-slate-700" />
                        <p className="text-sm">No prompts yet. Click &quot;Add Prompt&quot; to create one.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {prompts.map((prompt) => (
                            <motion.div key={prompt.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex items-center justify-between gap-4 glass border border-white/10 rounded-xl p-4 group hover:border-white/20 transition-all">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                        <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-[10px] font-bold uppercase rounded border border-blue-500/20">
                                            {prompt.category}
                                        </span>
                                        {prompt.approved && (
                                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded border border-emerald-500/20">Approved</span>
                                        )}
                                    </div>
                                    <p className="text-white font-semibold text-sm truncate">{prompt.title}</p>
                                    <p className="text-slate-500 text-xs line-clamp-1">{prompt.description}</p>
                                </div>
                                <button onClick={() => handleDeletePrompt(prompt.id)} disabled={deletingId === prompt.id}
                                    className="shrink-0 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 disabled:opacity-50">
                                    {deletingId === prompt.id
                                        ? <RefreshCcw className="w-4 h-4 animate-spin" />
                                        : <Trash2 className="w-4 h-4" />}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
