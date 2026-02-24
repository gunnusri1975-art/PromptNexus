"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Clock, LogOut, Sparkles } from "lucide-react";

export default function PendingApproval() {
    const { logout, profile } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background overflow-hidden relative">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -top-48 -left-48" />
                <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -bottom-48 -right-48" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg p-10 glass rounded-3xl border border-white/10 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600" />

                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                            <Clock className="text-blue-500 w-10 h-10 animate-pulse" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center border-2 border-background">
                            <Sparkles className="text-white w-3 h-3" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Account Pending Review</h1>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    Welcome to PromptNexus, <span className="text-blue-400 font-semibold">{profile?.name || "Explorer"}</span>!
                    Your account is currently being reviewed by our administration team to maintain platform quality.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">What happens next?</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>Admins will verify your account details.</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>You will receive access to the Prompt Library and features once approved.</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <span>Typically takes 12-24 hours for review.</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    >
                        Check Status
                    </button>
                    <button
                        onClick={logout}
                        className="w-full sm:w-auto px-8 py-3 glass border border-white/10 text-white font-semibold rounded-xl transition-all hover:bg-white/5 flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </motion.div>

            <p className="mt-12 text-slate-500 text-sm italic">
                Building the future of prompt engineering.
            </p>
        </div>
    );
}
