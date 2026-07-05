type Props = {
  size?: number;
};

export function SearchIcon() {
  return (
    <svg width="30" height="24" viewBox="0 0 25 25">
      <path
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-miterlimit="10"
        fill="none"
        d="M23.75 23.75l-9-9"
      />
      <circle
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-miterlimit="10"
        cx="9"
        cy="9"
        r="7.75"
        fill="none"
      />
      <path fill="none" d="M25 25h-25v-25h25z" />
    </svg>
  );
}

export function WallpaperIcon({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6.3A3.3 3.3 0 0 1 6.3 3H10a1 1 0 1 1 0 2H6.2C5.7 5 5 5.6 5 6.3V10a1 1 0 1 1-2 0V6.2ZM13 4a1 1 0 0 1 1-1h3.8A3.2 3.2 0 0 1 21 6.3V10a1 1 0 0 1-2 0V6.2c0-.6-.6-1.2-1.3-1.2H14a1 1 0 0 1-1-1Zm-9 9a1 1 0 0 1 1 1v3.6L9.5 13a3.5 3.5 0 0 1 5 0l4.5 4.5V14a1 1 0 0 1 2 0v3.8a3.2 3.2 0 0 1-3.3 3.2H14a1 1 0 0 1 0-2h3.6L13 14.5a1.5 1.5 0 0 0-2.2 0L6.4 19H10a1 1 0 0 1 0 2H6.2A3.2 3.2 0 0 1 3 17.7V14a1 1 0 0 1 1-1Zm13.5-4.3a2.3 2.3 0 1 1-4.5 0 2.3 2.3 0 0 1 4.5 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SystemThemeIcon({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="5"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        stroke-width="2"
      />
      <path
        d="M9 20h6M12 16v4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
}

export function SunIcon({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  );
}

export function MoonIcon({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M20 14.8A8 8 0 0 1 9.2 4a7 7 0 1 0 10.8 10.8Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  );
}
