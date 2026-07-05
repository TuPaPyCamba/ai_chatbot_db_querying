"use client";

import React from "react";
import { useI18n } from "@/app/providers";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-8 border-t border-gray-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-950 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-gray-500 dark:text-neutral-500 text-sm">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <span className="font-bold text-gray-700 dark:text-neutral-300">
            {t.navbar.title}
          </span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex space-x-6 text-xs">
          <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}
