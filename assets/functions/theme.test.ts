import { describe, expect, it } from "vitest";
import {
  getSystemTheme,
  normalizeThemePreference,
  readThemePreference,
  resolveTheme,
  themeStorageKey,
  writeThemePreference,
} from "./theme.ts";

describe("theme preference", () => {
  it("defaults invalid or missing preferences to system", () => {
    expect(normalizeThemePreference(null)).toBe("system");
    expect(normalizeThemePreference("unknown")).toBe("system");
  });

  it("keeps supported preferences", () => {
    expect(normalizeThemePreference("system")).toBe("system");
    expect(normalizeThemePreference("light")).toBe("light");
    expect(normalizeThemePreference("dark")).toBe("dark");
  });

  it("resolves system preference from the current system theme", () => {
    expect(resolveTheme("system", "light")).toBe("light");
    expect(resolveTheme("system", "dark")).toBe("dark");
  });

  it("lets explicit preferences override the system theme", () => {
    expect(resolveTheme("light", "dark")).toBe("light");
    expect(resolveTheme("dark", "light")).toBe("dark");
  });

  it("reads the system theme from the media query result", () => {
    expect(getSystemTheme({ matches: true })).toBe("light");
    expect(getSystemTheme({ matches: false })).toBe("dark");
  });

  it("persists and restores the chosen preference", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    };

    writeThemePreference("light", storage);

    expect(store.get(themeStorageKey)).toBe("light");
    expect(readThemePreference(storage)).toBe("light");
  });
});
