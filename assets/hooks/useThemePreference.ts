import { useComputed, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import {
  getSystemTheme,
  readThemePreference,
  resolveTheme,
  systemThemeMediaQuery,
  writeThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from "../functions/theme.ts";

function getInitialSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "dark";
  }

  return getSystemTheme(window.matchMedia(systemThemeMediaQuery));
}

function applyThemeToDocument(
  preference: ThemePreference,
  resolvedTheme: ResolvedTheme,
) {
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function useThemePreference() {
  const preference = useSignal<ThemePreference>(readThemePreference());
  const systemTheme = useSignal<ResolvedTheme>(getInitialSystemTheme());
  const resolvedTheme = useComputed(() =>
    resolveTheme(preference.value, systemTheme.value),
  );

  const setPreference = (nextPreference: ThemePreference) => {
    preference.value = nextPreference;
    writeThemePreference(nextPreference);
  };

  useEffect(() => {
    if (!window.matchMedia) {
      return;
    }

    const mediaQueryList = window.matchMedia(systemThemeMediaQuery);
    const updateSystemTheme = () => {
      systemTheme.value = getSystemTheme(mediaQueryList);
    };

    updateSystemTheme();
    mediaQueryList.addEventListener("change", updateSystemTheme);

    return () => {
      mediaQueryList.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  useEffect(() => {
    applyThemeToDocument(preference.value, resolvedTheme.value);
  }, [preference.value, resolvedTheme.value]);

  return {
    preference,
    resolvedTheme,
    setPreference,
  };
}
