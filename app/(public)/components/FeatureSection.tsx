"use client";

import React from "react";
import { useI18n } from "@/app/providers";
import { MessageSquareText, Layers, Zap } from "lucide-react";

export default function FeatureSection() {
  const { t } = useI18n();

  const features = [
    {
      title: t.landing.feature1Title,
      description: t.landing.feature1Desc,
      icon: MessageSquareText,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: t.landing.feature2Title,
      description: t.landing.feature2Desc,
      icon: Layers,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: t.landing.feature3Title,
      description: t.landing.feature3Desc,
      icon: Zap,
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <section className="py-20 bg-gray-50/50 dark:bg-neutral-900/30 border-t border-b border-gray-100 dark:border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t.landing.features}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-2xl border border-gray-200/50 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Feature Icon Container */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-md`}
              >
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
