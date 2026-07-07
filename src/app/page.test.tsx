import { describe, it, expect } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";
import Dashboard from "./page";

describe("Dashboard Page Background Style Tests", () => {
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
});
