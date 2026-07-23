/** JajanHub cart/pot glyph used in splash, QR center, and pickup cards. */
export function BrandMark({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20.5h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M6 20V10a6 6 0 0 1 12 0v10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 7V3.5M12 6.4V3M15 7V3.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
