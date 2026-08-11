'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useQueueState, useCancelOrder, stageOf, type CancelReason, type Order, type OrderStatus } from '@jajanhub/api';
import { useAddonFlow, type AddonFlowView } from './useAddonFlow';
import { usePickupFlow, type PickupFlowView } from './usePickupFlow';

export interface QueueTone {
  label: string;
  bg: string;
  color: string;
  dot: string;
}

export interface QueueScreenView {
  order: Order | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  status: OrderStatus;
  stage: number;
  ahead: number;
  eta: number;
  tone: QueueTone;
  isReady: boolean;
  canCancel: boolean;
  cannotCancel: boolean;
  cancelOpen: boolean;
  openCancel: () => void;
  closeCancel: () => void;
  confirmCancel: (reason: CancelReason) => void;
  cancelPending: boolean;
  goPickup: () => void;
  addon: AddonFlowView;
  pickup: PickupFlowView;
}

function tone(ahead: number): QueueTone {
  if (ahead <= 6) return { label: 'Antrean lancar', bg: 'bg-mint-soft', color: 'text-mint-deep', dot: 'bg-mint' };
  if (ahead <= 13) return { label: 'Agak ramai', bg: 'bg-[#FFF0E0]', color: 'text-[#B8791F]', dot: 'bg-[#F5A623]' };
  return { label: 'Lagi padat', bg: 'bg-[#FFEBE9]', color: 'text-danger', dot: 'bg-[#F5566B]' };
}

/**
 * Owns Queue screen data, the redirect-away side effects, and the cancel
 * flow's state/mutation — shared by mobile (BottomSheet-based CancelSheet)
 * and desktop (Modal-based CancelModal), which render different overlay
 * shells around this same `cancelOpen`/`confirmCancel`/`cancelPending`.
 */
export function useQueueScreen(orderId: string): QueueScreenView {
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const queue = useQueueState(orderId);
  const cancelOrder = useCancelOrder();
  const [cancelOpen, setCancelOpen] = useState(false);
  const addon = useAddonFlow(order);
  const pickup = usePickupFlow(order);

  const status: OrderStatus = queue?.status ?? order?.status ?? 'waiting_confirmation';
  const stage = stageOf(status);

  useEffect(() => {
    if (status === 'pending_payment') router.replace(`/order/${orderId}/pay`);
    if (status === 'cancelled' || status === 'rejected') {
      router.replace(`/order/${orderId}/refund`);
    }
  }, [status, orderId, router]);

  const ahead = queue?.peopleAhead ?? order?.queueNumber ?? 0;
  const eta = queue?.etaMin ?? 0;

  return {
    order,
    isLoading,
    isError,
    refetch,
    status,
    stage,
    ahead,
    eta,
    tone: tone(ahead),
    isReady: stage === 2,
    canCancel: stage === 0,
    cannotCancel: stage === 1,
    cancelOpen,
    openCancel: () => setCancelOpen(true),
    closeCancel: () => setCancelOpen(false),
    confirmCancel: (reason: CancelReason) => {
      cancelOrder.mutate(
        { id: orderId, reason },
        {
          onSuccess: () => {
            setCancelOpen(false);
            router.push(`/order/${orderId}/refund`);
          },
        },
      );
    },
    cancelPending: cancelOrder.isPending,
    goPickup: () => router.push(`/order/${orderId}/pickup`),
    addon,
    pickup,
  };
}
