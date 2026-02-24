"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Code, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 overflow-hidden bg-background">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 flex items-center justify-center w-full h-full pointer-events-none -z-10">
          <div className="absolute w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] top-1/4 left-1/4" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium border rounded-full glass border-white/10 text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>The Future of Prompt Engineering</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
            <span className="text-white">Empower Your AI with</span><br />
            <span className="text-blue-500">PromptNexus</span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-slate-400 md:text-xl max-w-2xl mx-auto">
            A premium AI Prompt Library platform designed for modern builders.
            Discover, curate, and optimize high-performance prompts for your project.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Features Grid Simulation */}
        <div className="grid grid-cols-1 gap-6 mt-24 md:grid-cols-2 max-w-4xl w-full">
          <FeatureCard
            icon={<Code className="w-10 h-10 text-blue-500" />}
            title="Prompt Library"
            description="Browse, duplicate, and customize production-ready prompts from the community."
            delay={0.2}
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-amber-500" />}
            title="Optimized Output"
            description="High-performance templates designed to extract the best quality results from modern AI models."
            delay={0.4}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-bold text-slate-500 tracking-[3px] uppercase">
            Built with ❤️ by <span className="text-blue-500">Aryan</span>
          </p>
          <p className="mt-4 text-[10px] text-slate-600">
            &copy; {new Date().getFullYear()} PromptNexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 transition-all glass hover:border-blue-500/50 group"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-slate-400 group-hover:text-slate-300 transition-colors">{description}</p>
    </motion.div>
  );
}
