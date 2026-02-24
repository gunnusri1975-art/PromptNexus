"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    Sparkles,
    TrendingUp,
    Clock,
    ArrowUpRight,
    Plus,
    RefreshCcw,
    Activity,
    BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import { getPromptsAction } from "@/lib/actions/prompts";
import { getRecentActivityAction, ActivityLog } from "@/lib/actions/activity";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
    const { profile, user } = useAuth();
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [promptCount, setPromptCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            setLoading(true);

            const [activityRes, promptsRes] = await Promise.all([
                getRecentActivityAction(user.uid),
                getPromptsAction()
            ]);

            if (activityRes.success && activityRes.activities) {
                setActivities(activityRes.activities);
            }

            if (promptsRes.success && promptsRes.prompts) {
                setPromptCount(promptsRes.prompts.length);
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, [user]);

    return (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {profile?.name || "Explorer"}</h1>
                    <p className="text-slate-400">Here's what's happening with your AI projects today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-gradient">Usage Today</p>
                        <p className="text-sm font-bold text-white">{profile?.dailyUsageCount || 0}</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<TrendingUp className="text-blue-500" />}
                    label="Total Executions"
                    value={profile?.dailyUsageCount?.toString() || "0"}
                    trend="Real-time"
                />
                <StatCard
                    icon={<Sparkles className="text-purple-500" />}
                    label="Active Prompts"
                    value={promptCount !== null ? promptCount.toString() : "..."}
                    trend="Library size"
                />
                <StatCard
                    icon={<Clock className="text-amber-500" />}
                    label="Account Status"
                    value={profile?.approved ? "Verified" : "Pending"}
                    trend={profile?.role?.toUpperCase() || "USER"}
                />
            </div>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-500" />
                        Recent Activity
                    </h2>
                    <div className="glass border border-white/10 rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center p-10">
                                <RefreshCcw className="w-6 h-6 animate-spin text-blue-500" />
                            </div>
                        ) : activities.length > 0 ? (
                            <>
                                <div className="divide-y divide-white/5 flex-1">
                                    {activities.map((act) => (
                                        <ActivityItem
                                            key={act.id}
                                            title={act.title}
                                            type={act.type}
                                            time={formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}
                                            tokens={act.tokens}
                                        />
                                    ))}
                                </div>
                                <Link href="/library" className="w-full py-4 text-sm text-slate-500 hover:text-white text-center transition-colors border-t border-white/5 bg-white/5">
                                    View Library
                                </Link>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                                <Activity className="w-10 h-10 text-slate-700 mb-4" />
                                <p className="text-slate-500 text-sm">No recent activity detected.</p>
                                <Link href="/library" className="mt-4 text-blue-400 text-xs font-bold hover:underline">Explore templates to log activity</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Quick Actions</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/library">
                            <QuickActionButton
                                label="Library Explorer"
                                description="Browse high-performance templates"
                                color="blue"
                            />
                        </Link>
                        <div className="p-4 glass border border-white/10 rounded-2xl">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pro Tip</p>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Use the <span className="text-blue-400">Library</span> to find optimized prompts for deep research and creative writing.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend }: any) {
    return (
        <div className="p-6 glass border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{trend}</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
        </div>
    );
}

function ActivityItem({ title, type, time, tokens }: any) {
    return (
        <div className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-slate-500">{type} • {time}</p>
                </div>
            </div>
            {tokens && (
                <span className="text-xs font-medium px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {tokens} tokens
                </span>
            )}
        </div>
    );
}

function QuickActionButton({ label, description, color }: any) {
    const colors: any = {
        blue: "hover:border-blue-500/50 hover:bg-blue-500/5",
        purple: "hover:border-purple-500/50 hover:bg-purple-500/5",
        emerald: "hover:border-emerald-500/50 hover:bg-emerald-500/5"
    };

    return (
        <div className={`w-full p-4 flex flex-col items-start transition-all glass border border-white/10 rounded-2xl text-left group ${colors[color]}`}>
            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{label}</span>
            <span className="text-xs text-slate-500">{description}</span>
        </div>
    );
}
