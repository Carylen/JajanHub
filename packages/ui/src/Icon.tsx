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
  | 'cup';

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
