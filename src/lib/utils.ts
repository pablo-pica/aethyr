import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind CSS classes dynamically
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validate Stellar public address format
export function validateStellarAddress(address: string): boolean {
  return /^G[A-D][A-Z2-7]{54}$/.test(address);
}
