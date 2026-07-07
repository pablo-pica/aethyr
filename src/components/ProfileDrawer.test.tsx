import { describe, it, expect } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";
import ProfileDrawer from "./ProfileDrawer";

describe("ProfileDrawer Layout & Styling Tests", () => {
  it("should export a function for ProfileDrawer", () => {
    expect(typeof ProfileDrawer).toBe("function");
  });

  it("should use absolute positioning instead of fixed for mockup containment", () => {
    const filePath = path.resolve(__dirname, "./ProfileDrawer.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // The root wrapper should contain 'absolute' positioning, and not 'fixed' for the container
    expect(fileContent).toContain("absolute inset-0 z-50 overflow-hidden");
    expect(fileContent).not.toContain("fixed inset-0 z-50 overflow-hidden");
  });
});
