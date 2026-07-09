"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Loader2 } from "lucide-react";

interface WalletConnectProps {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  openDrawer: () => void;
  isLoading: boolean;
}

export default function WalletConnect({
  isConnected,
  address,
  connect,
  openDrawer,
  isLoading,
}: WalletConnectProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  if (!mounted || isLoading) {
    return (
      <button
        disabled={true}
        className="h-10 px-4 rounded-xl bg-space-800 border border-space-700/50 flex items-center gap-2 text-slate-400 text-xs font-semibold"
      >
        <Loader2 className="w-4 h-4 animate-spin text-primary-cyan" />
        Checking...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <button
        onClick={openDrawer}
        type="button"
        className="h-10 px-3 rounded-xl bg-space-800/80 hover:bg-space-700/40 border border-teal-500/15 flex items-center gap-2 text-slate-200 text-xs font-semibold font-mono tracking-wide hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer focus-ring"
        data-testid="wallet-connected-pill"
      >
        <div
          className="w-4 h-4 rounded-full border border-teal-500/20 shrink-0"
          style={{ background: getIdenticonGradient(address) }}
          data-testid="wallet-identicon"
        />
        <span>{truncateAddress(address)}</span>
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      type="button"
      className="h-10 px-4 rounded-xl bg-gradient-to-r from-primary-cyan to-primary-indigo hover:shadow-lg hover:shadow-primary-cyan/15 flex items-center gap-2 text-white text-xs font-bold active:scale-[0.98] transition-all cursor-pointer focus-ring"
      data-testid="wallet-connect-btn"
    >
      <Wallet className="w-4 h-4 text-white" />
      Connect Wallet
    </button>
  );
}
