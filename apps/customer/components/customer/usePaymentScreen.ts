'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useQueueState, useMarkPaid, type Order } from '@jajanhub/api';

export interface PaymentScreenView {
  order: Order | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  payLeft: number;
  markPaid: () => void;
  markPaidPending: boolean;
  goBack: () => void;
}

/**
 * Owns Payment screen data + the redirect-away side effect (once the order
 * leaves `awaiting_payment`, move to the live queue). D0 proof-of-concept
 * for the screen-hook/view split: convention settled here is that
 * router-driven side effects live in the hook, never in either view, so
 * `PaymentMobileView`/`PaymentDesktopView` stay pure render functions of
 * this return value.
 */
export function usePaymentScreen(orderId: string): PaymentScreenView {
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const queue = useQueueState(orderId);
  const markPaid = useMarkPaid();

  useEffect(() => {
    if (order && order.status !== 'pending_payment') {
      router.replace(`/order/${orderId}`);
    }
  }, [order, orderId, router]);

  return {
    order,
    isLoading,
    isError,
    refetch,
    payLeft: queue?.payLeft ?? 299,
    markPaid: () => markPaid.mutate(orderId),
    markPaidPending: markPaid.isPending,
    goBack: () => router.back(),
  };
}
