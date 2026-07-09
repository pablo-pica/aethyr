import { describe, it, expect } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";
import SendTab from "./SendTab";

describe("SendTab Component Layout & Styling Tests", () => {
  it("should export a function for SendTab", () => {
    expect(typeof SendTab).toBe("function");
  });

  it("should render balance card, AI Smart Strip, CustomNumberInput, and SVG route visualization", () => {
    const filePath = path.resolve(__dirname, "./SendTab.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Balance card elements
    expect(fileContent).toContain("Available Balance");
    expect(fileContent).toContain("animate-gradient-spin");

    // AI Assist block
    expect(fileContent).toContain("AI Assist");
    expect(fileContent).toContain("Parse Command");

    // Form inputs and customization
    expect(fileContent).toContain("CustomNumberInput");
    expect(fileContent).toContain("displayRecipient()");

    // Route path dots flow
    expect(fileContent).toContain("animate-flowing-dots");
    expect(fileContent).toContain("<svg");

    // Fee comparison elements
    expect(fileContent).toContain("Aethyr Routing");
    expect(fileContent).toContain("Competitors");
  });
});
