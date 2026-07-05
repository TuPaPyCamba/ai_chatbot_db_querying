"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/app/providers";
import { Sparkles, MessageCircle, ArrowRight } from "lucide-react";

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[80px] dark:bg-purple-600/15" />
        <div className="absolute top-[10%] right-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-600/15" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Sparkle Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Architecture</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="block text-gray-900 dark:text-white">
            {t.landing.heroTitle.split("AI Chat")[0]}
          </span>
          <span className="block mt-1 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            AI Chat Platform
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
          {t.landing.heroSubtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>{t.landing.getStarted}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/signin"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold border border-gray-300 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>{t.landing.chatNow}</span>
          </Link>
        </div>

        {/* Mock UI Showcase */}
        <div className="relative max-w-4xl mx-auto rounded-2xl border border-gray-200/60 dark:border-neutral-800/80 shadow-2xl overflow-hidden bg-gray-50/50 dark:bg-neutral-900/50 backdrop-blur-sm p-2 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-2xl pointer-events-none" />
          
          {/* Header Mock */}
          <div className="flex items-center space-x-2 px-4 py-3 border-b border-gray-200/50 dark:border-neutral-800/50 bg-white/80 dark:bg-neutral-950/80 rounded-t-xl">
            <div className="flex space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-grow text-center text-xs font-semibold text-gray-400 dark:text-neutral-500">
              chatsphere-ai-client (localhost:3000/dashboard)
            </div>
          </div>

          {/* Body Mock */}
          <div className="p-4 sm:p-6 bg-white/40 dark:bg-neutral-950/40 min-h-[300px] flex flex-col justify-end space-y-4 text-left rounded-b-xl">
            <div className="max-w-[80%] self-start bg-gray-100 dark:bg-neutral-800/80 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
              How does the i18n system handle translations in Next.js?
            </div>
            <div className="max-w-[80%] self-end bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm shadow-md">
              It matches standard dictionaries dynamically! The backend reads it from cookies to render Spanish or English seamlessly.
            </div>
            <div className="border-t border-gray-200/50 dark:border-neutral-800/50 pt-4 flex space-x-2">
              <div className="flex-grow bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-gray-400">
                Ask me about Next.js, database services or Tailwind CSS v4...
              </div>
              <div className="px-4 py-2.5 bg-purple-600 text-white font-semibold text-xs rounded-xl shadow-sm">
                Send
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
