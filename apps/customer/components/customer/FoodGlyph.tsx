import type { MenuCategory } from '@jajanhub/api';

/** The plate / cup glyph shown on menu + stall thumbnails. */
export function FoodGlyph({ cat, size = 36 }: { cat: MenuCategory; size?: number }) {
  if (cat === 'drink') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 4.5h12l-1.1 14.4a2.2 2.2 0 0 1-2.2 2H9.3a2.2 2.2 0 0 1-2.2-2z"
          fill="rgba(255,255,255,.92)"
        />
        <path d="M7.4 9.5h9.2" stroke="#34C9A8" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 11.5h19a9.5 9.5 0 0 1-19 0z" fill="rgba(255,255,255,.92)" />
      <path
        d="M8 6.5c0-1.2.9-1.6.9-2.8M12 6.3c0-1.2.9-1.6.9-2.8M16 6.5c0-1.2.9-1.6.9-2.8"
        stroke="rgba(255,255,255,.92)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
