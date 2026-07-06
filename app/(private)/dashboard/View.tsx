"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useI18n } from "@/app/providers";
import {
  Send,
  Sparkles,
  MessageSquareCode,
  Sun,
  Moon,
  Languages,
  User,
  AlertTriangle,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function View() {
  const { theme, setTheme } = useTheme();
  const { lang, t, setLang } = useI18n();

  // 1. React States as explicitly required by the instructions
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to the bottom when messages or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const toggleLang = () => {
    setLang(lang === "en" ? "es" : "en");
  };

  // 2. sendMessage function as explicitly required by instructions
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessageContent = inputText;
    // Add the user's message to the messages state
    const newUserMessage: Message = { role: "user", content: userMessageContent };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);

    // Clear the input
    setInputText("");
    // Set isLoading = true
    setIsLoading(true);

    try {
      // Fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages: newMessages }) })
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }

      const data = await res.json();

      // Receive the response from the backend and add the assistant's message to the messages state
      if (data && data.content) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      } else {
        throw new Error("Invalid response format received from server.");
      }
    } catch (error) {
      console.error("Fetch error details:", error);
      // Catch fetch error and display a generic error message in the chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            lang === "es"
              ? "Lo sentimos, ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo."
              : "Something went wrong while communicating with the server. Please try again.",
        },
      ]);
    } finally {
      // Disable isLoading
      setIsLoading(false);
    }
  };



  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-neutral-950 transition-colors duration-200">
      {/* Left Sidebar */}
      <aside className="w-72 border-r border-gray-200/60 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 flex flex-col h-full shrink-0 transition-colors duration-200">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200/50 dark:border-neutral-800/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <MessageSquareCode className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {t.navbar.title}
            </span>
          </div>
        </div>

        {/* Info Area / Welcome message placeholder in sidebar */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-4">
            <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-1.5 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Database Assistant
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-neutral-400 leading-relaxed">
              Ask questions about assets, transactions, and dividends. The AI will formulate SQL queries and fetch the data directly.
            </p>
          </div>

          <div className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-wider px-1">
            Available Tables
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">assets</span>
              <span className="text-gray-400 dark:text-neutral-500 block mt-0.5">id, ticker, type, name, sector</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">transactions</span>
              <span className="text-gray-400 dark:text-neutral-500 block mt-0.5">id, asset_id, transaction_type, quantity, unit_price, date</span>
            </div>
            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800">
              <span className="font-mono font-bold text-purple-600 dark:text-purple-400">dividends_paid</span>
              <span className="text-gray-400 dark:text-neutral-500 block mt-0.5">id, asset_id, amount_per_share, payment_date</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-200/50 dark:border-neutral-800/50 space-y-3 bg-gray-50/50 dark:bg-neutral-900/10">
          <div className="flex items-center justify-between px-2">
            <button
              onClick={toggleLang}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors flex items-center space-x-1"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase">{lang}</span>
            </button>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors"
              title="Toggle Theme"
            >
              {mounted ? (
                theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />
              ) : (
                <div className="w-3.5 h-3.5" /> /* Invisible placeholder with the same size to avoid UI jumps */
              )}
            </button>
          </div>

          {/* App Info */}
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200/50 dark:border-neutral-800/50">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                {t.navbar.title}
              </div>
              <div className="text-[10px] text-gray-400 truncate leading-none mt-0.5">
                Powered by Groq & Llama-3
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-950 transition-colors duration-200">
        {/* Header */}
        <header className="px-6 py-4 border-b border-gray-200/50 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {t.dashboard.welcome}
            </h2>
            <p className="text-[10px] text-gray-400 font-semibold uppercase mt-0.5">
              Powered by Groq & Llama-3
            </p>
          </div>
        </header>

        {/* Chat History Panel */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Sparkles className="w-8 h-8 text-purple-500/40 mb-3 animate-pulse" />
              <h3 className="text-base font-bold text-gray-850 dark:text-white mb-1.5">
                Start a New Query Session
              </h3>
              <p className="max-w-md text-xs text-gray-400 dark:text-neutral-500 leading-relaxed">
                Send a question about your portfolio (e.g., &quot;What assets are in the database?&quot; or &quot;Show me the top 3 largest buy transactions&quot;).
              </p>
            </div>
          ) : (
            // Differentiating user and assistant messages with beautiful styles as requested
            messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  className={`flex items-start space-x-3.5 max-w-[85%] ${
                    isUser ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-purple-600 text-white rounded-tr-none shadow-md"
                        : msg.content.includes("Something went wrong") || msg.content.includes("Lo sentimos, ocurrió un error")
                        ? "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border border-red-150 dark:border-red-900/30 rounded-tl-none font-medium flex items-center space-x-2"
                        : "bg-gray-100 dark:bg-neutral-800/80 text-gray-850 dark:text-gray-150 rounded-tl-none border border-gray-200/20 dark:border-neutral-700/20 shadow-sm"
                    }`}
                  >
                    {(!isUser && (msg.content.includes("Something went wrong") || msg.content.includes("Lo sentimos, ocurrió un error"))) && (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 inline-block mr-1.5 align-middle" />
                    )}
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </div>
              );
            })
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3.5 max-w-[80%]">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-gray-100 dark:bg-neutral-800/80 rounded-2xl rounded-tl-none px-4 py-3 text-sm text-gray-800 dark:text-gray-200 flex items-center space-x-1.5 border border-gray-200/20 dark:border-neutral-700/20 shadow-sm">
                <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-gray-500 dark:bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Footer */}
        <footer className="p-4 border-t border-gray-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-950 shrink-0">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex space-x-3">
            <div className="relative flex-grow">
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                placeholder={t.dashboard.chatPlaceholder}
                className="block w-full py-3 px-4 border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50/50 dark:bg-neutral-900/50 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 disabled:opacity-50 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl disabled:bg-purple-600/40 shadow-md hover:shadow-purple-500/10 active:scale-[0.98] transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
