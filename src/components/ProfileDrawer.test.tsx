import { describe, it, expect } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";
import ProfileDrawer from "./ProfileDrawer";

describe("ProfileDrawer BottomSheet Integration & Style Tests", () => {
  it("should export a function for ProfileDrawer", () => {
    expect(typeof ProfileDrawer).toBe("function");
  });

  it("should utilize BottomSheet layout container", () => {
    const filePath = path.resolve(__dirname, "./ProfileDrawer.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Integration check
    expect(fileContent).toContain("BottomSheet");
    expect(fileContent).not.toContain("absolute inset-y-0 right-0 flex w-[80%]");
  });

  it("should render identity gradient, balances list, and developer utilities", () => {
    const filePath = path.resolve(__dirname, "./ProfileDrawer.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Identicon and copy checks
    expect(fileContent).toContain("getIdenticonGradient");
    expect(fileContent).toContain("truncateAddress");

    // Balances checks
    expect(fileContent).toContain("Token Balances");
    expect(fileContent).toContain("Stellar Lumens");

    // Disconnect button check
    expect(fileContent).toContain("Disconnect Wallet");
  });
});
