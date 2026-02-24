"use client";

import Link from "next/link";
import { Search, User, LogOut, Menu, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const { profile, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <nav className="fixed top-0 left-0 md:left-64 right-0 h-16 z-50 glass border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 hover:bg-white/5 rounded-lg md:hidden text-slate-400"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <Link href="/dashboard" className="flex items-center gap-2 group md:hidden">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-110">
                        <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
                        PromptNexus
                    </span>
                </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
                <div className="relative w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search prompts, tags, or categories..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        onChange={(e) => console.log("Searching for:", e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 p-1 pl-1 pr-3 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner">
                            {profile?.name?.charAt(0) || profile?.email?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm font-medium text-slate-200 hidden lg:block">{profile?.name || "User"}</span>
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-56 glass border border-white/10 rounded-2xl p-2 shadow-2xl"
                            >
                                <div className="px-3 py-2 border-b border-white/5 mb-2">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Account</p>
                                    <p className="text-sm text-white truncate">{profile?.email}</p>
                                </div>

                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                    <User className="w-4 h-4" />
                                    My Profile
                                </button>

                                <button
                                    onClick={() => logout()}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}
