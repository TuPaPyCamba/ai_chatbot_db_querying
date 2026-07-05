"use client";

import Link from "next/link";
import { MessageSquareCode, ArrowLeft } from "lucide-react";
import SignUpForm from "./components/SignUpForm";
import { useI18n } from "@/app/providers";

export default function SignUpView() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[30%] w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[80px] dark:bg-purple-600/15" />
        <div className="absolute top-[10%] right-[30%] w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[80px] dark:bg-indigo-600/15" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-6 ml-4 sm:ml-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to home</span>
        </Link>

        {/* Branding logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-4">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t.auth.signupTitle}
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm py-8 px-4 border border-gray-200/50 dark:border-neutral-800/80 shadow-xl rounded-2xl sm:px-10">
          <SignUpForm />
          
          <div className="mt-6 text-center text-xs">
            <span className="text-gray-500">{t.auth.haveAccount} </span>
            <Link
              href="/signin"
              className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              {t.auth.signinButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
