"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import PendingApproval from "./PendingApproval";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { profile, loading, user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(37,99,235,0.2)]" />
            </div>
        );
    }

    if (!user && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
                <p className="text-slate-400">Redirecting to login...</p>
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    if (profile && !profile.approved) {
        return <PendingApproval />;
    }

    return (
        <div className="min-h-screen bg-background text-white">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="pt-16 md:pl-64 transition-all duration-300">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="dashboard-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
