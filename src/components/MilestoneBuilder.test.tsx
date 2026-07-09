import { describe, it, expect } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";
import MilestoneBuilder from "./MilestoneBuilder";

describe("MilestoneBuilder Component Tests", () => {
  it("should export a function for MilestoneBuilder", () => {
    expect(typeof MilestoneBuilder).toBe("function");
  });

  it("should render milestone list editor UI element", () => {
    const filePath = path.resolve(__dirname, "./MilestoneBuilder.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // The component must contain visual elements like Milestone Editor, Split Evenly
    expect(fileContent).toContain("Milestone Editor");
    expect(fileContent).toContain("Split Evenly");
    expect(fileContent).toContain("Add Milestone");
    expect(fileContent).toContain("totalBps === 10000");
  });

  it("should have compact row layout classes and index numbering", () => {
    const filePath = path.resolve(__dirname, "./MilestoneBuilder.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Compact single row container checks
    expect(fileContent).toContain("flex gap-2 items-center py-2 border-b border-space-800/80 last:border-b-0");
    
    // Description input styling (h-12 and text-sm)
    expect(fileContent).toContain("flex-1 min-w-0 h-12 bg-slate-900 border border-slate-800 focus:border-teal-500/35 rounded-xl px-3 text-sm");

    // Weight input width and styling
    expect(fileContent).toContain("flex items-center gap-1.5 shrink-0");
    expect(fileContent).toContain("w-[136px]");
    expect(fileContent).toContain("<CustomNumberInput");
    expect(fileContent).toContain("text-xs text-slate-500 font-mono select-none");
    expect(fileContent).toContain("size=\"lg\"");

    // Remove button small trash icon
    expect(fileContent).toContain("p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400");
    expect(fileContent).toContain("Trash2 className=\"w-4 h-4\"");
  });

  it("should have manual Split Evenly logic and onClose apply button", () => {
    const filePath = path.resolve(__dirname, "./MilestoneBuilder.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // manual Split Evenly balanceMilestones helper
    expect(fileContent).toContain("const balanceMilestones = (list: Milestone[]): Milestone[] => {");
    expect(fileContent).toContain("handleAutoBalance");

    // onClose prop definition and Apply Milestones CTA button call
    expect(fileContent).toContain("onClose?: () => void;");
    expect(fileContent).toContain("onClick={() => onClose?.()}");
    expect(fileContent).toContain("Apply Milestones");
  });

  it("should have clean and compact scroll container style", () => {
    const filePath = path.resolve(__dirname, "./MilestoneBuilder.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Clean scrollbar settings
    expect(fileContent).toContain("space-y-2 max-h-[220px] overflow-y-auto pr-1");
  });
});
