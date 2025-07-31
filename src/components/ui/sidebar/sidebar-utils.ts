"use client";

// --- Constants ---
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "15rem";
export const SIDEBAR_WIDTH_ICON = "3.25rem";
export const SIDEBAR_COOKIE_NAME = "sidebar-open";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// --- Functions ---
export function getCookie(name: string): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}
