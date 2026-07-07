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

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  // Render a loading state during server-side rendering and initial client hydration
  if (!mounted || isLoading) {
    return (
      <button
        disabled={true}
        className="h-10 px-4 rounded-xl bg-space-800 border border-space-700/50 flex items-center gap-2 text-slate-400 text-xs font-semibold"
      >
        <Loader2 className="w-4 h-4 animate-spin text-primary-indigo" />
        Checking...
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <button
        onClick={openDrawer}
        className="h-10 px-3.5 rounded-xl bg-primary-indigo/10 hover:bg-primary-indigo/20 border border-primary-indigo/35 hover:border-primary-indigo/50 flex items-center gap-2 text-slate-200 text-xs font-semibold font-mono tracking-wide hover:shadow-lg hover:shadow-primary-indigo/5 active:scale-[0.98] transition-all"
      >
        <Wallet className="w-3.5 h-3.5 text-primary-indigo animate-pulse-glow" />
        {truncateAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      className="h-10 px-4 rounded-xl neon-button flex items-center gap-2 text-white text-xs font-semibold active:scale-[0.98] transition-all"
    >
      <Wallet className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}
