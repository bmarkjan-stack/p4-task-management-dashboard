/**
 * Set VITE_API_URL (see .env.example) to point the app at a running
 * TaskFlow backend (see /server). When it's unset the app runs entirely
 * client-side, backed by localStorage.
 */
const rawUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_URL = rawUrl ? rawUrl.replace(/\/$/, "") : undefined;
export const USE_API = Boolean(API_URL);
