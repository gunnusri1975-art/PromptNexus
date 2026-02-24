"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, ArrowRight, Chrome } from "lucide-react";
import { useState } from "react";

export default function SignupPage() {
    const { loginWithGoogle } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleSignup = async () => {
        setLoading(true);
        setError("");
        try {
            await loginWithGoogle();
            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to sign up with Google");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background overflow-hidden relative">
            {/* Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -top-48 -left-48" />
                <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -bottom-48 -right-48" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 glass rounded-2xl border border-white/10"
            >
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        <ShieldCheck className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Join PromptNexus</h1>
                    <p className="text-slate-400">Create an account to start building with AI</p>
                </div>

                {error && (
                    <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all border rounded-xl glass border-white/10 text-white hover:bg-white/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    <Chrome className="w-5 h-5" />
                    {loading ? "Creating account..." : "Continue with Google"}
                </button>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
            >
                <Link
                    href="/"
                    className="text-slate-500 hover:text-white flex items-center gap-2 transition-colors text-sm"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}
