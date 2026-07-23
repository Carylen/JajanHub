import type { MenuItem } from '@jajanhub/api';

/** Food thumbnail gradients, ported from the design's GRADS constant. */
const FOOD_GRADIENTS = [
  'linear-gradient(135deg,#FFCE8F,#FF9A3D)',
  'linear-gradient(135deg,#FFB7A0,#FF7A5C)',
  'linear-gradient(135deg,#FFD98A,#F5A623)',
  'linear-gradient(135deg,#FFC48F,#F97B3D)',
  'linear-gradient(135deg,#FFD0A0,#FF8A4D)',
  'linear-gradient(135deg,#F5C48A,#E8863D)',
];

const DRINK_GRADIENT = 'linear-gradient(135deg,#A6ECD9,#34C9A8)';

/** Deterministic thumbnail gradient for a menu item. */
export function itemGradient(item: Pick<MenuItem, 'cat'>, index: number): string {
  if (item.cat === 'drink') return DRINK_GRADIENT;
  return FOOD_GRADIENTS[index % FOOD_GRADIENTS.length] ?? FOOD_GRADIENTS[0]!;
}

export { DRINK_GRADIENT, FOOD_GRADIENTS };
