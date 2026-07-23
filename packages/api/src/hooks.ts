'use client';
/**
 * TanStack Query bindings + a thin realtime hook over `subscribeQueue` /
 * `subscribeRefund`. Components consume these and stay ignorant of mock vs http.
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getClient } from './getClient';
import type {
  CreateOrderInput,
  LoyalCustomer,
  Order,
  Payout,
  QueueState,
  RefundState,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  UserProfile,
  VendorOrder,
  VendorOrderStatus,
  Warung,
} from './types';

export const queryKeys = {
  warung: (id: string) => ['warung', id] as const,
  order: (id: string) => ['order', id] as const,
  stalls: ['stalls'] as const,
  plans: ['plans'] as const,
  benefits: ['benefits'] as const,
  profile: ['profile'] as const,
  vendorOrders: ['vendor', 'orders'] as const,
  payouts: ['vendor', 'payouts'] as const,
  loyalCustomers: ['vendor', 'customers'] as const,
};

export function useWarung(id: string): UseQueryResult<Warung> {
  return useQuery({ queryKey: queryKeys.warung(id), queryFn: () => getClient().getWarung(id) });
}

export function useOrder(id: string): UseQueryResult<Order> {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => getClient().getOrder(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrder(): UseMutationResult<Order, Error, CreateOrderInput> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => getClient().createOrder(input),
    onSuccess: (order) => qc.setQueryData(queryKeys.order(order.id), order),
  });
}

export function useMarkPaid(): UseMutationResult<Order, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getClient().markPaid(id),
    onSuccess: (order) => qc.setQueryData(queryKeys.order(order.id), order),
  });
}

export function useCancelOrder(): UseMutationResult<Order, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getClient().cancelOrder(id),
    onSuccess: (order) => qc.setQueryData(queryKeys.order(order.id), order),
  });
}

export function useConfirmPickup(): UseMutationResult<Order, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getClient().confirmPickup(id),
    onSuccess: (order) => qc.setQueryData(queryKeys.order(order.id), order),
  });
}

export function useStalls(): UseQueryResult<Stall[]> {
  return useQuery({ queryKey: queryKeys.stalls, queryFn: () => getClient().getStalls() });
}
export function usePlans(): UseQueryResult<SubscriptionPlan[]> {
  return useQuery({ queryKey: queryKeys.plans, queryFn: () => getClient().getPlans() });
}
export function useBenefits(): UseQueryResult<SubscriptionBenefit[]> {
  return useQuery({ queryKey: queryKeys.benefits, queryFn: () => getClient().getBenefits() });
}
export function useProfile(): UseQueryResult<UserProfile> {
  return useQuery({ queryKey: queryKeys.profile, queryFn: () => getClient().getProfile() });
}

export function useVendorOrders(): UseQueryResult<VendorOrder[]> {
  return useQuery({ queryKey: queryKeys.vendorOrders, queryFn: () => getClient().getVendorOrders() });
}
export function useUpdateVendorOrder(): UseMutationResult<
  VendorOrder,
  Error,
  { id: string; status: VendorOrderStatus }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => getClient().updateVendorOrder(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.vendorOrders }),
  });
}
export function useRejectVendorOrder(): UseMutationResult<
  void,
  Error,
  { id: string; reasonId: string }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reasonId }) => getClient().rejectVendorOrder(id, reasonId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.vendorOrders }),
  });
}
export function usePayouts(): UseQueryResult<Payout[]> {
  return useQuery({ queryKey: queryKeys.payouts, queryFn: () => getClient().getPayouts() });
}
export function useLoyalCustomers(): UseQueryResult<LoyalCustomer[]> {
  return useQuery({ queryKey: queryKeys.loyalCustomers, queryFn: () => getClient().getLoyalCustomers() });
}

/**
 * Subscribe to live queue state for an order. Keeps the TanStack cache for the
 * order in sync so status-derived UI updates everywhere.
 */
export function useQueueState(orderId: string | undefined): QueueState | null {
  const qc = useQueryClient();
  const [state, setState] = useState<QueueState | null>(null);
  useEffect(() => {
    if (!orderId) return;
    const unsub = getClient().subscribeQueue(orderId, (next) => {
      setState(next);
      qc.setQueryData<Order>(queryKeys.order(orderId), (prev) =>
        prev ? { ...prev, status: next.status } : prev,
      );
    });
    return unsub;
  }, [orderId, qc]);
  return state;
}

export function useRefundState(orderId: string | undefined): RefundState | null {
  const [state, setState] = useState<RefundState | null>(null);
  useEffect(() => {
    if (!orderId) return;
    return getClient().subscribeRefund(orderId, setState);
  }, [orderId]);
  return state;
}
