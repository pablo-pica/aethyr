"use client";

import React from "react";
import { SendHorizontal, ReceiptText, Settings2 } from "lucide-react";

export type TabId = "send" | "activity" | "settings";

interface BottomNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    {
      id: "send" as TabId,
      label: "Send / Swap",
      icon: SendHorizontal,
    },
    {
      id: "activity" as TabId,
      label: "Activity",
      icon: ReceiptText,
    },
    {
      id: "settings" as TabId,
      label: "Settings",
      icon: Settings2,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-space-950/80 backdrop-blur-lg border-t border-space-700/30 pb-[env(safe-area-inset-bottom)] px-4">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none outline-none group transition-all duration-300`}
            >
              <div
                className={`relative flex items-center justify-center p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-primary-indigo bg-primary-indigo/10 border border-primary-indigo/20 scale-105"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5 transition-transform" />
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide mt-1 transition-colors ${
                  isActive ? "text-primary-indigo font-semibold" : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
