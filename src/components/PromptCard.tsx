"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Eye, MoreVertical, Tag, Check, RefreshCcw, Terminal } from "lucide-react";
import { Prompt } from "@/types/prompt";
import { useAuth } from "@/context/AuthContext";
import { PromptService } from "@/lib/services/prompt";
import { useState } from "react";

interface PromptCardProps {
    prompt: Prompt;
    onView?: (prompt: Prompt) => void;
}

export default function PromptCard({ prompt, onView }: PromptCardProps) {
    const { user } = useAuth();
    const [duplicating, setDuplicating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [showContent, setShowContent] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleDuplicate = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return;
        setDuplicating(true);
        try {
            await PromptService.duplicatePrompt(user.uid, prompt);
            alert("Prompt duplicated successfully!");
        } catch (error) {
            console.error("Duplication failed:", error);
        } finally {
            setDuplicating(false);
        }
    };
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="flex flex-col glass border border-white/10 rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-all"
        >
            <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="px-2 py-1 bg-blue-600/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded border border-blue-500/20">
                        {prompt.category}
                    </div>
                    <button className="text-slate-500 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                    {prompt.title}
                </h3>
                <div className="relative">
                    <p className={`text-sm text-slate-400 leading-relaxed transition-all ${isDescriptionExpanded ? "" : "line-clamp-3"}`}>
                        {prompt.description}
                    </p>
                    {prompt.description.length > 150 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsDescriptionExpanded(!isDescriptionExpanded); }}
                            className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-wider mt-2 transition-colors"
                        >
                            {isDescriptionExpanded ? "Show Less" : "Read More"}
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-6"
                        >
                            <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative group">
                                <label className="absolute -top-2 left-3 bg-[#0a0c10] px-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest border border-white/5 rounded">Full Prompt</label>
                                <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {prompt.content}
                                </pre>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-wrap gap-2 mt-6">
                    {prompt.tags.map((tag) => (
                        <div key={tag} className="flex items-center gap-1 text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded-full border border-white/5">
                            <Tag className="w-3 h-3 text-slate-600" />
                            {tag}
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between gap-3">
                <button
                    onClick={() => onView?.(prompt)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold rounded-xl border border-white/10 transition-all active:scale-95"
                >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowContent(!showContent); }}
                        title={showContent ? "Hide content" : "Quick view content"}
                        className={`p-2 rounded-xl border transition-all active:scale-90 ${showContent
                            ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                            }`}
                    >
                        <Terminal className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCopy}
                        title="Copy to clipboard"
                        className={`p-2 rounded-xl border transition-all active:scale-90 ${copied
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-500"
                            : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleDuplicate}
                        disabled={duplicating}
                        title="Duplicate to my prompts"
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 active:scale-90"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
