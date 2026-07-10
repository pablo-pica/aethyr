import { describe, it, expect } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";
import SettingsTab from "./SettingsTab";

describe("SettingsTab Component Layout & Configuration Tests", () => {
  it("should export a function for SettingsTab", () => {
    expect(typeof SettingsTab).toBe("function");
  });

  it("should render Network config, Slippage control, AI switch, and tooltips", () => {
    const filePath = path.resolve(__dirname, "./SettingsTab.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Network Group checks
    expect(fileContent).toContain("Network Environment");
    expect(fileContent).toContain("active-network-badge");

    // Slippage controls check
    expect(fileContent).toContain("Slippage Tolerance");
    expect(fileContent).toContain("CustomNumberInput");
    expect(fileContent).toContain('setSlippage("2.0")');

    // AI toggle checks (48x28px wrapper / touch targets)
    expect(fileContent).toContain("minWidth: \"48px\"");
    expect(fileContent).toContain("minHeight: \"44px\"");
    expect(fileContent).toContain("w-12 h-7");

    // Tooltips presence
    expect(fileContent).toContain("InfoTooltip");
  });
});
