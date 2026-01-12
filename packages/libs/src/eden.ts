import { treaty, Treaty } from "@elysiajs/eden";
import type { App } from "api";

const getApiUrl = () => {
  if (globalThis.window !== undefined) {
    // @ts-expect-error - Vite env
    return import.meta.env?.VITE_API_URL;
  }
  return process.env.VITE_API_URL;
};

const getAuthHeaders = (): Record<string, string> => {
  // Only access localStorage in browser
  if (globalThis.window !== undefined) return {};

  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api: Treaty.Create<App> = treaty<App>(getApiUrl(), {
  headers: getAuthHeaders,
});