export const themeStorageKey = "local-research-theme";
export const systemThemeMediaQuery = "(prefers-color-scheme: light)";

export const themePreferences = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof themePreferences)[number];
export type ResolvedTheme = Exclude<ThemePreference, "system">;

type ReadableStorage = Pick<Storage, "getItem">;
type WritableStorage = Pick<Storage, "setItem">;

const fallbackPreference: ThemePreference = "system";

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    themePreferences.includes(value as ThemePreference)
  );
}

export function normalizeThemePreference(value: unknown): ThemePreference {
  return isThemePreference(value) ? value : fallbackPreference;
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme: ResolvedTheme,
): ResolvedTheme {
  return preference === "system" ? systemTheme : preference;
}

export function getSystemTheme(
  mediaQueryList: Pick<MediaQueryList, "matches">,
): ResolvedTheme {
  return mediaQueryList.matches ? "light" : "dark";
}

export function readThemePreference(
  storage: ReadableStorage | null = getBrowserStorage(),
): ThemePreference {
  if (!storage) {
    return fallbackPreference;
  }

  try {
    return normalizeThemePreference(storage.getItem(themeStorageKey));
  } catch {
    return fallbackPreference;
  }
}

export function writeThemePreference(
  preference: ThemePreference,
  storage: WritableStorage | null = getBrowserStorage(),
) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(themeStorageKey, preference);
  } catch {
    // Ignore storage failures, the in-memory preference still applies.
  }
}
