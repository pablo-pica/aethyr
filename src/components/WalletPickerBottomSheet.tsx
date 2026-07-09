"use client";

import React, { useEffect, useState } from "react";
import BottomSheet from "./ui/BottomSheet";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
}

interface WalletPickerBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (id: string) => void;
}

export default function WalletPickerBottomSheet({
  isOpen,
  onClose,
  onSelectWallet,
}: WalletPickerBottomSheetProps) {
  const [wallets, setWallets] = useState<WalletOption[]>([
    { id: "freighter", name: "Freighter", icon: "🚀", installed: false },
    { id: "xbull", name: "xBull", icon: "🐂", installed: false },
    { id: "albedo", name: "Albedo", icon: "🌌", installed: false },
    { id: "lobstr", name: "Lobstr", icon: "🦞", installed: true },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isFreighterInstalled = !!(window as any).stellarPublicKey || !!(window as any).FreighterApi;
      const isXbullInstalled = !!(window as any).xBullSDK;
      const isAlbedoInstalled = !!(window as any).albedo;
      setWallets([
        { id: "freighter", name: "Freighter", icon: "🚀", installed: isFreighterInstalled },
        { id: "xbull", name: "xBull", icon: "🐂", installed: isXbullInstalled },
        { id: "albedo", name: "Albedo", icon: "🌌", installed: isAlbedoInstalled },
        { id: "lobstr", name: "Lobstr", icon: "🦞", installed: true },
      ]);
    }
  }, [isOpen]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Connect Wallet">
      <div className="space-y-3 mt-1">
        <p className="text-xs text-slate-400 text-center pb-2">
          Choose a Stellar wallet extension to connect.
        </p>

        <div className="space-y-2">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => {
                onSelectWallet(wallet.id);
                onClose();
              }}
              className="w-full p-4 rounded-xl bg-space-900/50 hover:bg-space-800/40 border border-space-700/50 hover:border-teal-500/30 flex items-center justify-between transition-all group focus-ring cursor-pointer"
              data-testid={`wallet-option-${wallet.id}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl select-none">{wallet.icon}</span>
                <div className="text-left">
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {wallet.name}
                  </span>
                  {wallet.installed ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-medium text-emerald-400">Detected</span>
                    </div>
                  ) : (
                    <p className="text-[9px] text-slate-500 mt-0.5">Not detected</p>
                  )}
                </div>
              </div>

              {!wallet.installed && (
                <span className="text-[10px] font-bold text-slate-400 border border-space-700 px-2 py-0.5 rounded-lg group-hover:text-teal-400 group-hover:border-teal-500/30 transition-all select-none">
                  Install ↗
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}
