"use client";

import { useAuth } from "@/context/AuthContext";
import {
    User,
    Shield,
    Save
} from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { profile } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                <p className="text-slate-400">Manage your profile, preferences, and security settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Sidebar (Local to Settings) */}
                <div className="space-y-2">
                    <SettingsTab icon={<User className="w-4 h-4" />} label="Profile" active />
                </div>

                {/* Settings Content */}
                <div className="md:col-span-2 space-y-6">
                    <section className="glass border border-white/10 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center gap-4 pb-6 border-b border-white/5">

                            <div>
                                <h3 className="text-lg font-bold text-white">{profile?.name}</h3>
                                <p className="text-sm text-slate-500">{profile?.email}</p>
                                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                    {profile?.role} Account
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <InputField label="Full Name" value={profile?.name || ""} />
                            <InputField label="Email Address" value={profile?.email || ""} disabled />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </section>

                    <section className="glass border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-500" />
                            Account Verification
                        </h3>
                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-sm text-slate-300">
                            {profile?.approved ? (
                                <p className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Your account is verified and fully active.
                                </p>
                            ) : (
                                <p className="flex items-center gap-2 text-amber-400">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                                    Account verification is currently pending.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ icon, label, active = false }: any) {
    return (
        <button className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
            ${active
                ? "bg-white/10 text-white border border-white/10 shadow-lg"
                : "text-slate-400 hover:text-white hover:bg-white/5"}
        `}>
            {icon}
            {label}
        </button>
    );
}

function InputField({ label, value, disabled = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">{label}</label>
            <input
                type="text"
                defaultValue={value}
                disabled={disabled}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    );
}
