"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useI18n } from "@/app/providers";
import { ChatSession } from "@/server/services/database/chats";
import {
  MessageSquare,
  Plus,
  Trash2,
  LogOut,
  Sun,
  Moon,
  Languages,
  User,
  MessageSquareCode,
} from "lucide-react";

interface SidebarProps {
  user: { name: string; email: string };
  sessions: ChatSession[];
  activeSessionId: string | null;
  loading: boolean;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onLogout: () => void;
}

export default function Sidebar({
  user,
  sessions,
  activeSessionId,
  loading,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onLogout,
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { lang, t, setLang } = useI18n();

  const toggleLang = () => {
    setLang(lang === "en" ? "es" : "en");
  };

  return (
    <aside className="w-72 border-r border-gray-200/60 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 flex flex-col h-full shrink-0 transition-colors duration-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200/50 dark:border-neutral-800/50 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <MessageSquareCode className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {t.navbar.title}
          </span>
        </Link>
      </div>

      {/* New Conversation Button */}
      <div className="p-3">
        <button
          onClick={onCreateSession}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/10 active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.dashboard.newChat}</span>
        </button>
      </div>

      {/* Chat Sessions History */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
          {t.dashboard.history}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <span className="w-5 h-5 rounded-full border-2 border-purple-600/30 border-t-purple-600 animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="px-3 py-6 text-xs text-gray-400 dark:text-neutral-500 text-center italic">
            {t.dashboard.emptyHistory}
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/50 border border-transparent"
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-purple-500" : "text-gray-400"}`} />
                  <span className="text-xs font-semibold truncate leading-none">
                    {session.title}
                  </span>
                </div>
                <button
                  onClick={(e) => onDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all shrink-0"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-gray-200/50 dark:border-neutral-800/50 space-y-3 bg-gray-50/50 dark:bg-neutral-900/10">
        {/* Quick Tools */}
        <div className="flex items-center justify-between px-2">
          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors flex items-center space-x-1"
            title="Change Language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">{lang}</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200/50 dark:border-neutral-800/50">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
              {user.name}
            </div>
            <div className="text-[10px] text-gray-400 truncate leading-none mt-0.5">
              {user.email}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors shrink-0"
            title={t.dashboard.logoutButton}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
