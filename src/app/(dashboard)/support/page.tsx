"use client";

import {
    HelpCircle,
    MessageCircle,
    Book,
    Mail,
    ExternalLink,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function SupportPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white">How can we help?</h1>
                <p className="text-slate-400 max-w-lg mx-auto">
                    Search our documentation or contact our team if you can't find what you're looking for.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SupportCard
                    icon={<Book className="w-6 h-6 text-blue-500" />}
                    title="Documentation"
                    description="Explore detailed guides on prompts and library usage."
                    link="#"
                />
                <SupportCard
                    icon={<MessageCircle className="w-6 h-6 text-purple-500" />}
                    title="Live Chat"
                    description="Talk to our support team directly (Coming Soon)."
                    disabled
                />
                <SupportCard
                    icon={<Mail className="w-6 h-6 text-emerald-500" />}
                    title="Email Support"
                    description="Send us a message at support@promptnexus.ai"
                    link="mailto:support@promptnexus.ai"
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white px-2">Frequently Asked Questions</h2>
                <div className="glass border border-white/10 rounded-3xl overflow-hidden divide-y divide-white/5">
                    <FaqItem
                        question="How do I upgrade to the Pro plan?"
                        answer="You can upgrade by clicking the 'Upgrade' button in your dashboard or sidebar. Pro plans give you unlimited access to premium prompt templates and deep-research models."
                    />
                    <FaqItem
                        question="What is PromptNexus?"
                        answer="PromptNexus is a premium platform for discover, sharing, and optimizing high-performance AI prompts for LLMs."
                    />
                    <FaqItem
                        question="Can I submit my own prompts?"
                        answer="Yes! Navigate to the Prompt Library and click 'Submit Prompt'. After a brief review by our admin team, it will be visible to all users."
                    />
                </div>
            </div>
        </div>
    );
}

function SupportCard({ icon, title, description, link, disabled = false }: any) {
    return (
        <div className={`p-6 glass border border-white/10 rounded-2xl flex flex-col space-y-4 transition-all ${!disabled && 'hover:border-white/20 hover:bg-white/5'}`}>
            <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
            {link && (
                <a href={link} className="pt-2 text-blue-400 text-xs font-bold flex items-center gap-1 hover:text-blue-300 transition-colors uppercase tracking-wider">
                    Learn More <ExternalLink className="w-3 h-3" />
                </a>
            )}
            {disabled && (
                <span className="pt-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest">Available for Pro</span>
            )}
        </div>
    );
}

function FaqItem({ question, answer }: any) {
    return (
        <div className="p-6 hover:bg-white/5 transition-colors group cursor-pointer">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{question}</h4>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{answer}</p>
        </div>
    );
}
