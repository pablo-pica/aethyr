"use client";

import React from "react";
import { SendHorizontal, Lock, ReceiptText, Settings2 } from "lucide-react";

export type TabId = "send" | "escrow" | "activity" | "settings";

interface BottomNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    {
      id: "send" as TabId,
      label: "Send",
      icon: SendHorizontal,
    },
    {
      id: "escrow" as TabId,
      label: "Escrow",
      icon: Lock,
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
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-space-950/80 backdrop-blur-lg border-t border-space-700/30 pb-[calc(0.5rem+var(--sab))] pt-1 px-4">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none outline-none group transition-all duration-300 cursor-pointer focus-ring rounded-xl"
              data-testid={`bottom-nav-tab-${tab.id}`}
            >
              <div
                className={`relative flex items-center justify-center p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-teal-400 bg-teal-500/10 border border-teal-500/20 scale-105"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                <Icon className="w-5 h-5 transition-transform" />
              </div>
              <span
                className={`text-[10px] font-bold tracking-wide mt-1 transition-colors ${
                  isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-200"
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
