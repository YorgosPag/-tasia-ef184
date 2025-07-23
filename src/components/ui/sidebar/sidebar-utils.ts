
export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "j"

// Helper function to get a cookie by name
export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined
  }
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  if (match) {
    return match[2]
  }
}
