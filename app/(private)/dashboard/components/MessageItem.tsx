"use client";

import React from "react";
import { ChatMessage } from "@/server/services/database/chats";
import { formatTime } from "@/server/utils/local_functions/dateHelper";
import { Sparkles, User } from "lucide-react";

interface MessageItemProps {
  message: ChatMessage;
}

export default function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  // Simple formatter to handle newlines, lists and bold formatting in mock responses
  const renderContent = (content: string) => {
    return content.split("\n").map((line, lineIdx) => {
      let element = line;

      // Handle bold mapping
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-bold text-gray-900 dark:text-white">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // Check if it's a list item
      if (line.match(/^\d+\.\s/)) {
        return (
          <div key={lineIdx} className="pl-4 mb-1.5 flex items-start">
            <span className="mr-2 font-semibold text-purple-600 dark:text-purple-400">
              {line.match(/^\d+\./)?.[0]}
            </span>
            <span className="flex-1">
              {parts.length > 0 ? parts : line.replace(/^\d+\.\s/, "")}
            </span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className={line === "" ? "h-2" : "mb-1.5 leading-relaxed"}>
          {parts.length > 0 ? parts : element}
        </p>
      );
    });
  };

  return (
    <div
      className={`flex items-start space-x-3.5 max-w-[85%] ${
        isUser ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
      }`}
    >
      {/* Icon Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isUser
            ? "bg-purple-600 text-white"
            : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className="flex flex-col space-y-1">
        <div
          className={`px-4.5 py-3 rounded-2xl text-sm shadow-sm ${
            isUser
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none"
              : "bg-gray-100 dark:bg-neutral-800/80 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200/20 dark:border-neutral-800/50"
          }`}
        >
          <div className="whitespace-pre-wrap">{renderContent(message.content)}</div>
        </div>
        
        {/* Timestamp */}
        <span
          className={`text-[9px] text-gray-400 dark:text-neutral-500 font-medium ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
