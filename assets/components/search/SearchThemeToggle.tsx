import clsx from "clsx";
import { MoonIcon, SunIcon, SystemThemeIcon } from "../icons.tsx";
import {
  themePreferences,
  type ResolvedTheme,
  type ThemePreference,
} from "../../functions/theme.ts";

type Props = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  onPreferenceChange: (preference: ThemePreference) => void;
};

const themeLabels: Record<ThemePreference, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

const themeIcons = {
  system: SystemThemeIcon,
  light: SunIcon,
  dark: MoonIcon,
} satisfies Record<ThemePreference, typeof SystemThemeIcon>;

export function SearchThemeToggle({
  preference,
  resolvedTheme,
  onPreferenceChange,
}: Props) {
  return (
    <div class="theme-toggle" role="group" aria-label="Theme">
      {themePreferences.map((themePreference) => {
        const Icon = themeIcons[themePreference];
        const isActive = themePreference === preference;
        const label =
          themePreference === "system"
            ? `${themeLabels[themePreference]} (${resolvedTheme})`
            : themeLabels[themePreference];

        return (
          <button
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            class={clsx("theme-toggle__option", isActive && "is-active")}
            onClick={() => onPreferenceChange(themePreference)}
            key={themePreference}
          >
            <Icon size={18} />
          </button>
        );
      })}
    </div>
  );
}
