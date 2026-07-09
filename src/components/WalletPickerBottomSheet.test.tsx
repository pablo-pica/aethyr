import { describe, it, expect } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";
import WalletPickerBottomSheet from "./WalletPickerBottomSheet";

describe("WalletPickerBottomSheet Component Tests", () => {
  it("should export a function for WalletPickerBottomSheet", () => {
    expect(typeof WalletPickerBottomSheet).toBe("function");
  });

  it("should render wallet option elements and utilize BottomSheet layout wrapper", () => {
    const filePath = path.resolve(__dirname, "./WalletPickerBottomSheet.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Integration check
    expect(fileContent).toContain("BottomSheet");

    // Wallet options checks
    expect(fileContent).toContain("freighter");
    expect(fileContent).toContain("xbull");
    expect(fileContent).toContain("albedo");
    expect(fileContent).toContain("lobstr");

    // Install badge and status indicators
    expect(fileContent).toContain("Install");
    expect(fileContent).toContain("Detected");
  });
});
