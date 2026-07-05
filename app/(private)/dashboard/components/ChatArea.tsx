"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatSession, ChatMessage } from "@/server/services/database/chats";
import MessageItem from "./MessageItem";
import { useI18n } from "@/app/providers";
import { Send, Sparkles, MessageSquare } from "lucide-react";

interface ChatAreaProps {
  session: ChatSession | null;
  messages: ChatMessage[];
  loading: boolean;
  sending: boolean;
  onSendMessage: (text: string) => void;
}

export default function ChatArea({
  session,
  messages,
  loading,
  sending,
  onSendMessage,
}: ChatAreaProps) {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    onSendMessage(input);
    setInput("");
  };

  // If no conversation is active
  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-neutral-950">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 shadow-sm border border-purple-500/10 animate-bounce">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t.dashboard.welcome}
        </h3>
        <p className="max-w-md text-sm text-gray-500 dark:text-neutral-500 leading-relaxed">
          Create a new conversation or select one from the sidebar history to get started querying metadata, optimizing databases, or chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-950 transition-colors duration-200">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
            {session.title}
          </h2>
          <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">
            Active Chat Session
          </p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="w-8 h-8 rounded-full border-3 border-purple-600/30 border-t-purple-600 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-8 h-8 text-purple-500/40 mb-3 animate-pulse" />
            <p className="text-sm text-gray-400 dark:text-neutral-500 italic">
              Send your first message to start the AI conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => <MessageItem key={message.id} message={message} />)
        )}

        {/* AI Typing Indicator */}
        {sending && (
          <div className="flex items-start space-x-3.5 max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-gray-100 dark:bg-neutral-800/80 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800 dark:text-gray-200 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <footer className="p-4 border-t border-gray-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-950 shrink-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex space-x-3">
          <div className="relative flex-grow">
            <input
              type="text"
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              placeholder={t.dashboard.chatPlaceholder}
              className="block w-full py-3 px-4 border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50/50 dark:bg-neutral-900/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 disabled:opacity-50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl disabled:bg-purple-600/40 shadow-md hover:shadow-purple-500/10 active:scale-[0.98] transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </footer>
    </div>
  );
}
