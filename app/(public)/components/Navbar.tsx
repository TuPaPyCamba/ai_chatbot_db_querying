"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useI18n } from "@/app/providers";
import { Sun, Moon, Languages, MessageSquareCode, ArrowRight } from "lucide-react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { lang, t, setLang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const toggleLang = () => {
    setLang(lang === "en" ? "es" : "en");
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/75 dark:bg-neutral-950/75 border-b border-gray-200/50 dark:border-neutral-800/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {t.navbar.title}
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors flex items-center space-x-1"
            title="Change Language"
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase">{lang}</span>
          </button>

          {/* Theme Switcher */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* Auth Action */}
          {mounted && (
            <>
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-sm transition-all flex items-center space-x-1"
                >
                  <span>{t.navbar.dashboard}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/signin"
                    className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    {t.navbar.signin}
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm hover:shadow-purple-500/10 transition-all"
                  >
                    {t.navbar.signup}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
