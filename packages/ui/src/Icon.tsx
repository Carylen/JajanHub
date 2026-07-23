import type { SVGProps } from 'react';

/**
 * Central icon set — the SVG paths repeated across the design files, extracted
 * once so screens reference `<Icon name="chevron-right" />` instead of pasting
 * inline `<svg>`. `currentColor` is used so color comes from Tailwind text-*.
 */
export type IconName =
  | 'chevron-left'
  | 'chevron-right'
  | 'plus'
  | 'minus'
  | 'clock'
  | 'star'
  | 'check'
  | 'check-circle'
  | 'card'
  | 'bolt'
  | 'map-pin'
  | 'bell'
  | 'grid'
  | 'edit'
  | 'trash'
  | 'logout'
  | 'help'
  | 'info'
  | 'speaker'
  | 'list'
  | 'map'
  | 'cart-arrow'
  | 'cup'
  | 'home'
  | 'chart'
  | 'users'
  | 'grid4'
  | 'play'
  | 'bag'
  | 'box'
  | 'store'
  | 'phone'
  | 'printer'
  | 'warning'
  | 'x'
  | 'backspace'
  | 'qr'
  | 'arrow-up'
  | 'download'
  | 'volume';

const PATHS: Record<IconName, JSX.Element> = {
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5l3 1.8" />
    </>
  ),
  star: (
    <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6 21l1.2-6.6L2.4 9.7l6.6-.9z" />
  ),
  check: <path d="M8.5 12l2.4 2.4 4.6-4.8" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12l2.4 2.4 4.6-4.8" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M3 10h18" />
    </>
  ),
  bolt: <path d="M13 2L4 14h6l-1 8 10-12h-6z" fill="currentColor" stroke="none" />,
  'map-pin': (
    <>
      <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M10.5 21a2 2 0 0 0 3 0" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="14" width="7" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="7" rx="1.5" />
      <path d="M14 15h3v5M20 15v5" />
    </>
  ),
  edit: <path d="M14.5 4.5l3 3M4 20l1-4L16 5a1.8 1.8 0 0 1 2.6 0l.4.4a1.8 1.8 0 0 1 0 2.6L8 19l-4 1z" />,
  trash: (
    <>
      <path d="M5 8h14l-1.4 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M10 12v5M14 12v5" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 8l-4 4 4 4M6 12h12" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.9" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  speaker: <path d="M4 9v6h4l6 4V5L8 9H4z" />,
  list: (
    <>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  map: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  'cart-arrow': (
    <>
      <path d="M12 3v13M6 11l6 6 6-6" />
      <path d="M5 21h14" />
    </>
  ),
  cup: (
    <>
      <path d="M6 4.5h12l-1.1 14.4a2.2 2.2 0 0 1-2.2 2H9.3a2.2 2.2 0 0 1-2.2-2z" />
      <path d="M7.4 9.5h9.2" />
    </>
  ),
  home: <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.5a3 3 0 0 1 0 5.5M20.5 19a5 5 0 0 0-3.5-4.8" />
    </>
  ),
  grid4: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  play: <path d="M8 5l11 7-11 7z" fill="currentColor" stroke="none" />,
  bag: (
    <>
      <path d="M6 8h12l-1 12H7z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  box: (
    <>
      <path d="M4 7l8-4 8 4v10l-8 4-8-4z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </>
  ),
  store: (
    <>
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  phone: <path d="M4.5 5.5c0 8 6 14 14 14l2-3.2-4-2-1.6 1.6a11 11 0 0 1-4.4-4.4L12.6 9l-2-4z" />,
  printer: (
    <>
      <rect x="6" y="3" width="12" height="5" />
      <path d="M6 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-2" />
      <rect x="7" y="15" width="10" height="6" />
    </>
  ),
  warning: (
    <>
      <path d="M12 8v5" />
      <circle cx="12" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3.5L2.5 20h19z" />
    </>
  ),
  x: <path d="M6 6l12 12M18 6L6 18" />,
  backspace: (
    <>
      <path d="M9 5h11v14H9L3 12z" />
      <path d="M12 10l4 4M16 10l-4 4" />
    </>
  ),
  qr: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <path d="M14 14h3v6M20 14v6" />
    </>
  ),
  'arrow-up': <path d="M5 15l7-7 7 7" />,
  download: (
    <>
      <path d="M12 3v13M6 11l6 6 6-6" />
      <path d="M5 21h14" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9v6h4l6 4V5L8 9H4z" />
      <path d="M17 9a4 4 0 0 1 0 6" />
    </>
  ),
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, strokeWidth = 2, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
