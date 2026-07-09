"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, ShieldCheck, LogOut } from "lucide-react";
import BottomSheet from "./ui/BottomSheet";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  address: string | null;
  balance: string | null;
  disconnect: () => void;
  isLoading: boolean;
}

export default function ProfileDrawer({
  isOpen,
  onClose,
  address,
  balance,
  disconnect,
  isLoading,
}: ProfileDrawerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getIdenticonGradient = (addr: string | null) => {
    if (!addr) return "radial-gradient(circle, #6366f1, #06b6d4)";
    let hash = 0;
    for (let i = 0; i < addr.length; i++) {
      hash = addr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c1 = `hsl(${Math.abs(hash) % 360}, 70%, 55%)`;
    const c2 = `hsl(${Math.abs(hash + 80) % 360}, 75%, 45%)`;
    return `radial-gradient(circle at 30% 30%, ${c1}, ${c2})`;
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Wallet Account">
      <div className="space-y-6 mt-1 pb-4">
        {address ? (
          <>
            {/* Identicon + address display card */}
            <div className="p-4 rounded-2xl bg-space-900/50 border border-space-700/50 flex flex-col items-center gap-4">
              <div
                className="w-16 h-16 rounded-full border border-teal-500/20 shadow-lg shadow-teal-500/5"
                style={{ background: getIdenticonGradient(address) }}
                data-testid="profile-identicon"
              />
              <div className="flex flex-col items-center gap-1 w-full text-center">
                <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider">
                  {truncateAddress(address)}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto w-fit">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Testnet
                </span>
              </div>
              <div className="flex items-center justify-between w-full bg-space-950/60 p-3 rounded-xl border border-space-850">
                <code className="text-[10px] font-mono text-slate-300 break-all select-all pr-2 max-w-[220px] truncate text-left">
                  {address}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-space-800 transition-all cursor-pointer shrink-0"
                  aria-label="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Balances Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 text-left">
                Token Balances
              </h4>
              <div className="space-y-2">
                {/* XLM Balance */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-space-800/40 border border-space-700/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-indigo/10 border border-primary-indigo/30 flex items-center justify-center text-xs font-bold text-primary-indigo select-none">
                      XLM
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-100">Stellar Lumens</p>
                      <p className="text-[10px] text-slate-400">Native Asset</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isLoading ? (
                      <div className="w-16 h-4 rounded bg-space-800 animate-pulse" />
                    ) : (
                      <p className="text-sm font-bold font-mono text-slate-100">
                        {Number(balance).toLocaleString(undefined, {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 4,
                        })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mock USDC */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-space-850 border border-space-700/10 opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400 select-none">
                      USDC
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-200">Mock USD Coin</p>
                      <p className="text-[10px] text-slate-500">Soroban Token</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold font-mono text-slate-300">0.0000 (Mock)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Utilities */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 text-left">
                Developer Utilities
              </h4>
              <a
                href="https://laboratory.stellar.org/#account-creator?network=testnet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-space-800/30 border border-space-700/30 hover:bg-space-850 hover:border-teal-500/30 transition-all text-slate-300 hover:text-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-space-950 flex items-center justify-center text-xs font-bold select-none">
                    🔧
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold">Stellar Friendbot</p>
                    <p className="text-[10px] text-slate-400">Get Testnet XLM Funds</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
              </a>
            </div>

            {/* Disconnect Footer */}
            <div className="pt-4 border-t border-space-700/30">
              <button
                onClick={() => {
                  disconnect();
                  onClose();
                }}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-semibold text-sm active:scale-[0.99] transition-all cursor-pointer"
                data-testid="profile-disconnect-btn"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Wallet
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
            <p className="text-xs text-slate-400">No account connected.</p>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
