import { describe, it, expect } from "vitest";
import React from "react";
import fs from "fs";
import path from "path";
import CustomNumberInput from "./CustomNumberInput";

describe("CustomNumberInput Component Tests", () => {
  it("should export a function for CustomNumberInput", () => {
    expect(typeof CustomNumberInput).toBe("function");
  });

  it("should have flanking plus and minus buttons and custom number validation regex", () => {
    const filePath = path.resolve(__dirname, "./CustomNumberInput.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Flanking buttons must render decrement/increment
    expect(fileContent).toContain("decrement");
    expect(fileContent).toContain("increment");
    expect(fileContent).toContain("Plus");
    expect(fileContent).toContain("Minus");

    // Input configuration
    expect(fileContent).toContain("type=\"text\"");
    expect(fileContent).toContain("/^\\d*\\.?\\d*$/");

    // Style properties to hide native spinners
    expect(fileContent).toContain("[appearance:textfield]");
    expect(fileContent).toContain("border-teal-500");
  });

  it("should support the compact prop with different tailwind spacing and size classes", () => {
    const filePath = path.resolve(__dirname, "./CustomNumberInput.tsx");
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Property interface support
    expect(fileContent).toContain("compact?: boolean;");

    // Conditional styling for gap size
    expect(fileContent).toContain("compact ? \"gap-1.5\" : \"gap-2\"");

    // Conditional styling for decrement/increment buttons
    expect(fileContent).toContain("compact ? \"w-8 h-8 rounded-lg\" : \"w-10 h-10 rounded-xl\"");

    // Conditional styling for input field container (h-8 rounded-lg text-xs vs w-full h-10 px-4 rounded-xl)
    expect(fileContent).toContain("compact ? \"h-8 rounded-lg text-xs px-2.5\" : \"w-full h-10 px-4 rounded-xl\"");

    // Conditional styling for suffix position (right-2 vs right-3)
    expect(fileContent).toContain("compact ? \"right-2\" : \"right-3\"");
  });
});
