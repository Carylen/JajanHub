'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfirmPickup, type Order } from '@jajanhub/api';
import { useCartStore } from '../../lib/cart-store';

export interface PickupFlowView {
  confirm: (onSuccess?: () => void) => void;
  confirmPending: boolean;
  ratingOpen: boolean;
  openRating: () => void;
  closeRating: () => void;
  /** Clears the cart and returns to the merchant page — shared "we're done" exit for both flows. */
  finish: () => void;
}

/**
 * Owns the confirm-pickup mutation + rating-modal state, shared by mobile
 * (`Pickup.tsx`'s explicit code screen → confirm → "Beri Rating" button) and
 * desktop (`QueueDesktopView`'s single "Sudah diambil · kasih rating"
 * button). `confirm` takes an optional `onSuccess` so each view decides
 * whether confirming should also open the rating modal immediately — mobile
 * keeps its two-step confirm-then-rate flow (BRIEF's explicit product
 * decision to keep this app's pickup-confirmation step, absent from the
 * reference), desktop combines them into one click, matching the reference's
 * `queueReady` CTA.
 */
export function usePickupFlow(order: Order | undefined): PickupFlowView {
  const router = useRouter();
  const confirmPickup = useConfirmPickup();
  const clearCart = useCartStore((s) => s.clear);
  const [ratingOpen, setRatingOpen] = useState(false);

  return {
    confirm: (onSuccess) => {
      if (!order) return;
      confirmPickup.mutate(order.id, { onSuccess });
    },
    confirmPending: confirmPickup.isPending,
    ratingOpen,
    openRating: () => setRatingOpen(true),
    closeRating: () => setRatingOpen(false),
    finish: () => {
      setRatingOpen(false);
      clearCart();
      if (order) router.push(`/m/${order.vendorId}`);
    },
  };
}
