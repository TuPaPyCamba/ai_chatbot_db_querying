"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/app/providers";
import { Loader2, KeyRound, Mail } from "lucide-react";

export default function SignInForm() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.auth.authError);
      }

      // Refresh router and redirect to dashboard
      router.refresh();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || t.auth.authError);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    // Submit login using set timeout to allow states to update
    setTimeout(() => {
      const form = document.getElementById("signin-form") as HTMLFormElement;
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      <form id="signin-form" onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 uppercase">
            {t.auth.email}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3.5 py-3 border border-gray-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
              placeholder={t.auth.emailPlaceholder}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-gray-600 dark:text-neutral-400 mb-1.5 uppercase">
            {t.auth.password}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3.5 py-3 border border-gray-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/30 focus:border-purple-600 transition-all"
              placeholder={t.auth.passwordPlaceholder}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 shadow-md hover:shadow-purple-500/10 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <span>{t.auth.signinButton}</span>
          )}
        </button>
      </form>

      {/* Demo Credentials Helper */}
      <div className="pt-4 border-t border-gray-200/50 dark:border-neutral-800/50">
        <div className="text-center text-xs text-gray-400 dark:text-neutral-500 mb-3 font-semibold uppercase">
          Or Quick Sign In With Demo Accounts:
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDemoLogin("john@example.com", "password123")}
            className="p-2 border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50/50 dark:bg-neutral-950 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-500/30 text-left transition-all"
          >
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">John Doe</div>
            <div className="text-[10px] text-gray-400">john@example.com</div>
          </button>
          <button
            onClick={() => handleDemoLogin("jane@example.com", "secure456")}
            className="p-2 border border-gray-200 dark:border-neutral-800 rounded-xl bg-gray-50/50 dark:bg-neutral-950 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-500/30 text-left transition-all"
          >
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Jane Smith</div>
            <div className="text-[10px] text-gray-400">jane@example.com</div>
          </button>
        </div>
      </div>
    </div>
  );
}
