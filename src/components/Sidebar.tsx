"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Library,
    Settings,
    Shield,
    ChevronLeft,
    Sparkles,
    X
} from "lucide-react";
import { motion } from "framer-motion";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Library, label: "Prompt Library", href: "/library" },
];

const adminItems = [
    { icon: Shield, label: "Admin Panel", href: "/admin" },
];

const bottomItems = [
    { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { profile } = useAuth();
    const isAdmin = profile?.role === 'admin';

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
        fixed left-0 top-0 bottom-0 z-[70] w-64 bg-[#0a0c10] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                <div className="h-16 flex items-center gap-3 px-6 border-b border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        Nexus
                    </span>
                    <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-lg md:hidden ml-auto text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
                    <div>
                        <p className="px-2 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px]">Main Navigation</p>
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <SidebarLink key={item.href} {...item} active={pathname === item.href} />
                            ))}
                        </div>
                    </div>

                    {isAdmin && (
                        <div>
                            <p className="px-2 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px]">Management</p>
                            <div className="space-y-1">
                                {adminItems.map((item) => (
                                    <SidebarLink key={item.href} {...item} active={pathname === item.href} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="px-2 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-[2px]">Other</p>
                        <div className="space-y-1">
                            {bottomItems.map((item) => (
                                <SidebarLink key={item.href} {...item} active={pathname === item.href} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 pb-8 border-t border-white/5 mt-auto flex flex-col items-center gap-3">
                    <p className="text-[10px] font-medium text-slate-500 text-center tracking-wider opacity-80">
                        BUILT BY <span className="text-blue-400 font-bold">ARYAN</span> ❤️
                    </p>
                    <div className="flex items-center gap-3">
                        {/* LinkedIn */}
                        <a
                            href="https://www.linkedin.com/in/aaryan-srivastava-40101a3aa"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="LinkedIn"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-blue-600/20 hover:border-blue-500/40 transition-all group"
                        >
                            <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        {/* AS Portfolio Logo */}
                        <a
                            href="https://aryan-s-cinematic-journey.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Portfolio"
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-purple-600/20 hover:border-purple-500/40 transition-all group"
                        >
                            <span className="text-[11px] font-black text-slate-400 group-hover:text-purple-400 transition-colors tracking-tight leading-none">
                                A<span className="text-blue-400 group-hover:text-purple-300">S</span>
                            </span>
                        </a>
                    </div>
                </div>
            </aside>
        </>
    );
}

function SidebarLink({ icon: Icon, label, href, active }: any) {
    return (
        <Link href={href}>
            <div className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative
        ${active ? "bg-blue-600/10 text-blue-400 shadow-[inset_0_0_10px_rgba(37,99,235,0.1)]" : "text-slate-400 hover:text-white hover:bg-white/5"}
      `}>
                {active && (
                    <motion.div
                        layoutId="active-sidebar-pill"
                        className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                    />
                )}
                <Icon className={`w-5 h-5 transition-colors ${active ? "text-blue-400" : "group-hover:text-white"}`} />
                <span className="text-sm font-medium">{label}</span>
            </div>
        </Link>
    );
}
