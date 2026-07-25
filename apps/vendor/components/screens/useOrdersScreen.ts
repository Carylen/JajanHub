'use client';
import { useMemo, useState } from 'react';
import { useVendorOrders, useAdvanceVendorOrder, useRejectVendorOrder, type VendorOrder } from '@jajanhub/api';

export interface OrdersScreenView {
  orders: VendorOrder[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  /** Rejected-last, priority-first, longest-waiting-first. */
  sorted: VendorOrder[];
  activeCount: number;
  advance: (id: string) => void;
  rejectId: string | null;
  openReject: (id: string) => void;
  closeReject: () => void;
  rejectingOrder: VendorOrder | undefined;
  confirmReject: (reason: string) => void;
  rejectPending: boolean;
}

/**
 * Shared order-board data + mutations. Mobile's tab/quota/preorder state and
 * desktop's Kanban column grouping are both view-specific derivations of
 * `sorted`/`orders` — they stay in each view rather than here, since
 * desktop's Kanban has no "Nanti" tab at all (the reference doesn't model
 * one; see OrdersDesktopView's doc comment).
 */
export function useOrdersScreen(): OrdersScreenView {
  const { data: orders, isLoading, isError, refetch } = useVendorOrders();
  const advanceMut = useAdvanceVendorOrder();
  const rejectMut = useRejectVendorOrder();
  const [rejectId, setRejectId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const list = [...(orders ?? [])];
    return list.sort((a, b) => {
      const ar = a.status === 'ditolak' ? 1 : 0;
      const br = b.status === 'ditolak' ? 1 : 0;
      if (ar !== br) return ar - br;
      return Number(b.priority) - Number(a.priority) || b.waitMins - a.waitMins;
    });
  }, [orders]);

  return {
    orders,
    isLoading,
    isError,
    refetch,
    sorted,
    activeCount: (orders ?? []).filter((o) => o.status !== 'ditolak').length,
    advance: (id) => advanceMut.mutate(id),
    rejectId,
    openReject: (id) => setRejectId(id),
    closeReject: () => setRejectId(null),
    rejectingOrder: orders?.find((o) => o.id === rejectId),
    confirmReject: (reason) => {
      if (rejectId) rejectMut.mutate({ id: rejectId, reason }, { onSuccess: () => setRejectId(null) });
    },
    rejectPending: rejectMut.isPending,
  };
}
