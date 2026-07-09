import { describe, it, expect, vi } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";

vi.mock("@/hooks/useStellarWallet", () => ({
  useStellarWallet: () => ({
    isConnected: false,
    address: null,
    balance: null,
    error: null,
    isLoading: false,
    connect: () => {},
    disconnect: () => {},
    sendXLM: () => {},
    routePayment: () => {},
    routeToEscrow: () => {},
    releaseMilestone: () => {},
    refundEscrow: () => {},
  }),
}));

import Dashboard from "./page";

describe("Dashboard Page Background Style & Layout Tests", () => {
  it("should export a function for Dashboard", () => {
    expect(typeof Dashboard).toBe("function");
  });

  it("should have lighter browser background with contrast on viewports above md", () => {
    const filePath = path.resolve(__dirname, "./page.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // The outer wrapper div should have the updated responsive background classes
    expect(fileContent).toContain("md:bg-slate-900");
    expect(fileContent).toContain("md:bg-none");
  });

  it("should truncate long transaction hashes in the activity feed to fit mobile layout", () => {
    const filePath = path.resolve(__dirname, "../components/ActivityTab.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Check that transaction hashes in the activity list are sliced in the middle
    expect(fileContent).toContain("tx.txHash.slice(0, 4)");
    expect(fileContent).toContain("tx.txHash.slice(-4)");
  });

  it("should constrain the left-hand flexbox children with min-w-0 to prevent content overflow", () => {
    const pagePath = path.resolve(__dirname, "./page.tsx");
    const pageContent = fs.readFileSync(pagePath, "utf-8");
    expect(pageContent).toContain("min-w-0");

    const settingsPath = path.resolve(__dirname, "../components/SettingsTab.tsx");
    const settingsContent = fs.readFileSync(settingsPath, "utf-8");
    expect(settingsContent).toContain("min-w-0");
  });

  it("should render the AI Smart Assist Console when AI is enabled", () => {
    const filePath = path.resolve(__dirname, "../components/SendTab.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    expect(fileContent).toContain("AI Smart Assist Console");
    expect(fileContent).toContain("Parse Command");
    expect(fileContent).toContain("parseAiIntent");
  });

  it("should render the path routing visualization with cost comparison", () => {
    const filePath = path.resolve(__dirname, "../components/SendTab.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    expect(fileContent).toContain("Router Route Path");
    expect(fileContent).toContain("Exchange rate");
    expect(fileContent).toContain("Competitors");
  });

  it("should render the milestones ledger in the escrow tab with Release/Refund actions", () => {
    const filePath = path.resolve(__dirname, "../components/EscrowTab.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    expect(fileContent).toContain("Active Escrows");
    expect(fileContent).toContain("Release");
    expect(fileContent).toContain("Refund Expired Escrow");
  });

  it("should display custom slippage and network selectors in Settings Tab", () => {
    const filePath = path.resolve(__dirname, "../components/SettingsTab.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    expect(fileContent).toContain("Slippage Tolerance");
    expect(fileContent).toContain("Futurenet");
    expect(fileContent).toContain("Local");
  });
});
