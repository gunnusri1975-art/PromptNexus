"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Plus,
    RefreshCcw,
    Bookmark,
    Sparkles,
    Tag,
    X,
    Send,
    BookOpen,
    Check,
    Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prompt } from "@/types/prompt";
import PromptCard from "@/components/PromptCard";
import { useSearch } from "@/hooks/useSearch";
import { getPromptsAction, submitPromptAction } from "@/lib/actions/prompts";

interface PromptDetailModalProps {
    prompt: Prompt;
    onClose: () => void;
}

function PromptDetailModal({ prompt, onClose }: PromptDetailModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl glass border border-white/20 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                            <Sparkles className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">
                                    {prompt.category}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{prompt.title}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="space-y-10">
                        <section>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">About this prompt</h3>
                            <div className="space-y-6">
                                <p className="text-slate-300 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 text-sm">
                                    {prompt.description}
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-1">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Prompt System Data</h4>
                                        <button
                                            onClick={handleCopy}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${copied
                                                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50"
                                                    : "bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20"
                                                }`}
                                        >
                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            {copied ? "Copied" : "Copy to Clipboard"}
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full -z-10 opacity-50" />
                                        <pre className="bg-[#050608] border border-white/10 rounded-2xl p-8 text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed min-h-[250px] shadow-2xl selection:bg-blue-500/30">
                                            {prompt.content}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-wrap gap-2 pt-4">
                            {prompt.tags.map((tag: string) => (
                                <div key={tag} className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                                    <Tag className="w-3 h-3 text-slate-500" />
                                    {tag}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/10 flex items-center justify-end gap-4">
                    <p className="mr-auto text-[10px] text-slate-500 font-medium">Added on {new Date(prompt.createdAt).toLocaleDateString()}</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-slate-400 hover:text-white font-bold text-sm transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg active:scale-95"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied to Clipboard" : "Copy Full Prompt"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default function LibraryPage() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "General",
        tags: ""
    });

    const { query, setQuery, filteredResults } = useSearch(prompts, ['title', 'description', 'tags']);

    const fetchPrompts = async () => {
        setLoading(true);
        const res = await getPromptsAction();
        if (res.success && res.prompts) {
            setPrompts(res.prompts as unknown as Prompt[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await submitPromptAction({
            ...formData,
            tags: formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
        });
        if (res.success) {
            setShowModal(false);
            setFormData({ title: "", description: "", category: "General", tags: "" });
            fetchPrompts();
        } else {
            alert("Submission failed: " + res.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="space-y-8 relative">
            {/* Header section with search and actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Prompt Library</h1>
                    <p className="text-slate-400">Discover and duplicate high-performance community prompts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Submit Prompt
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 max-w-2xl relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Nexus Library (e.g. 'react', 'marketing', 'python')..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-xl"
                    />
                </div>
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                    <RefreshCcw className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-sm font-medium animate-pulse">Scanning Nexus databases...</p>
                </div>
            ) : filteredResults.length > 0 ? (
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredResults.map((prompt: any) => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            onView={(p) => setSelectedPrompt(p)}
                        />
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
                    <BookOpen className="w-12 h-12 text-slate-700 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or explore a different category.</p>
                </div>
            )}

            {/* Submit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg glass border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                                <h2 className="text-xl font-bold text-white">Submit to Library</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Title</label>
                                    <input
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="e.g. Next.js Architecture Expert"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option>General</option>
                                            <option>Coding</option>
                                            <option>Creative</option>
                                            <option>Marketing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Tags (comma-separated)</label>
                                        <input
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="react, tailwind"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">System Prompt / Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                        placeholder="Describe how the AI should behave..."
                                    />
                                </div>
                                <button
                                    disabled={submitting}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    {submitting ? "Submitting..." : "Submit for Approval"}
                                </button>
                                <p className="text-[10px] text-slate-500 text-center">New submissions are reviewed by the Nexus Admin team.</p>
                            </form>
                        </motion.div>
                    </div>
                )}
                {/* Prompt Detail Modal */}
                {selectedPrompt && (
                    <PromptDetailModal
                        prompt={selectedPrompt}
                        onClose={() => setSelectedPrompt(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
