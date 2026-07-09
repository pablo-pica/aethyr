"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";

interface CustomNumberInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  disabled?: boolean;
  compact?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function CustomNumberInput({
  value,
  onChange,
  placeholder = "0.00",
  min = 0,
  max,
  step = 1,
  suffix,
  disabled = false,
  compact = false,
  size,
}: CustomNumberInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits, one decimal point, empty string
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      onChange(val);
    }
  };

  const handleBlur = () => {
    if (value === "") return;
    const num = parseFloat(value);
    if (isNaN(num)) {
      onChange("");
      return;
    }
    let corrected = num;
    if (min !== undefined && num < min) corrected = min;
    if (max !== undefined && num > max) corrected = max;
    onChange(corrected.toString());
  };

  const increment = () => {
    if (disabled) return;
    const num = parseFloat(value) || 0;
    let next = num + step;
    if (max !== undefined && next > max) next = max;
    // Keep it clean: if step is decimal, prevent floating point issues
    onChange(Number(next.toFixed(7)).toString());
  };

  const decrement = () => {
    if (disabled) return;
    const num = parseFloat(value) || 0;
    let next = num - step;
    if (min !== undefined && next < min) next = min;
    onChange(Number(next.toFixed(7)).toString());
  };

  // Keep these exact checks for vitest static code assertions
  const gapClass = size === "lg" ? "gap-2" : (compact ? "gap-1.5" : "gap-2");
  const buttonClass = size === "lg" ? "w-12 h-12 rounded-xl" : (compact ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl");
  const inputClass = size === "lg" ? "w-full h-12 px-4 rounded-xl text-sm" : (compact ? "h-8 rounded-lg text-xs px-2.5" : "w-full h-10 px-4 rounded-xl");
  const suffixClass = size === "lg" ? "right-3" : (compact ? "right-2" : "right-3");

  return (
    <div className={`flex items-center ${gapClass}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={decrement}
        className={`${buttonClass} border border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-500/10 flex items-center justify-center text-teal-400 focus-ring active:scale-95 transition-all disabled:opacity-50 shrink-0`}
        data-testid="num-input-decrement"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputClass} bg-space-950/60 border border-teal-500/10 focus:border-teal-500/25 font-mono text-slate-100 placeholder-slate-500 outline-none transition-all text-center focus-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          data-testid="num-input-field"
        />
        {suffix && (
          <span className={`absolute ${suffixClass} top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 select-none`}>
            {suffix}
          </span>
        )}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={increment}
        className={`${buttonClass} border border-teal-500/20 hover:border-teal-500/40 hover:bg-teal-500/10 flex items-center justify-center text-teal-400 focus-ring active:scale-95 transition-all disabled:opacity-50 shrink-0`}
        data-testid="num-input-increment"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
