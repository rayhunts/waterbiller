import { treaty } from "@elysiajs/eden";
import type { AnyElysia } from "elysia";

// Environment-aware API URL configuration
const getApiUrl = () => {
  // Check if running in browser
  if (globalThis.window !== undefined) {
    // In browser: check for Vite environment variable
    // @ts-expect-error - import.meta.env is available in Vite
    return import.meta.env?.VITE_API_URL;
  }
  return process.env.VITE_API_URL;
};

export const api = treaty<AnyElysia>(getApiUrl());