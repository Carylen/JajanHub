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
import type { AddonInput } from './client';
import type {
  AuthSession,
  CreateOrderInput,
  LoyalCustomer,
  Order,
  Payout,
  PickupRecord,
  Preorder,
  QueueState,
  RefundState,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  Txn,
  UserProfile,
  VendorMenuItem,
  VendorOrder,
  VendorSummary,
  Warung,
} from './types';

export const queryKeys = {
  warung: (id: string) => ['warung', id] as const,
  order: (id: string) => ['order', id] as const,
  activeOrders: ['orders', 'active'] as const,
  stalls: ['stalls'] as const,
  plans: ['plans'] as const,
  benefits: ['benefits'] as const,
  profile: ['profile'] as const,
  session: ['session'] as const,
  vendorSummary: ['vendor', 'summary'] as const,
  vendorOrders: ['vendor', 'orders'] as const,
  preorders: ['vendor', 'preorders'] as const,
  vendorMenu: ['vendor', 'menu'] as const,
  payouts: ['vendor', 'payouts'] as const,
  txns: ['vendor', 'txns'] as const,
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

export function useCreateAddon(): UseMutationResult<Order, Error, { orderId: string; items: AddonInput }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, items }) => getClient().createAddon(orderId, items),
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
export function useActiveOrders(): UseQueryResult<Order[]> {
  return useQuery({ queryKey: queryKeys.activeOrders, queryFn: () => getClient().getActiveOrders() });
}

export function useSession(): UseQueryResult<AuthSession> {
  return useQuery({ queryKey: queryKeys.session, queryFn: () => getClient().getSession() });
}
export function useSendOtp(): UseMutationResult<void, Error, string> {
  return useMutation({ mutationFn: (phone: string) => getClient().sendOtp(phone) });
}
export function useVerifyOtp(): UseMutationResult<AuthSession, Error, { phone: string; code: string }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, code }) => getClient().verifyOtp(phone, code),
    onSuccess: (session) => {
      qc.setQueryData(queryKeys.session, session);
      qc.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}
export function useLogout(): UseMutationResult<void, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => getClient().logout(),
    onSuccess: () => {
      qc.setQueryData(queryKeys.session, { phone: '', loggedIn: false });
      qc.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useVendorSummary(): UseQueryResult<VendorSummary> {
  return useQuery({ queryKey: queryKeys.vendorSummary, queryFn: () => getClient().getVendorSummary() });
}
export function useAdvanceVendorTier(): UseMutationResult<VendorSummary, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => getClient().advanceVendorTier(),
    onSuccess: (summary) => qc.setQueryData(queryKeys.vendorSummary, summary),
  });
}
export function useResetVendorTier(): UseMutationResult<VendorSummary, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => getClient().resetVendorTier(),
    onSuccess: (summary) => qc.setQueryData(queryKeys.vendorSummary, summary),
  });
}
export function useVendorOrders(): UseQueryResult<VendorOrder[]> {
  return useQuery({ queryKey: queryKeys.vendorOrders, queryFn: () => getClient().getVendorOrders() });
}
export function useAdvanceVendorOrder(): UseMutationResult<VendorOrder[], Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getClient().advanceVendorOrder(id),
    onSuccess: (orders) => qc.setQueryData(queryKeys.vendorOrders, orders),
  });
}
export function useRejectVendorOrder(): UseMutationResult<
  VendorOrder[],
  Error,
  { id: string; reason: string }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => getClient().rejectVendorOrder(id, reason),
    onSuccess: (orders) => qc.setQueryData(queryKeys.vendorOrders, orders),
  });
}
export function usePreorders(): UseQueryResult<Preorder[]> {
  return useQuery({ queryKey: queryKeys.preorders, queryFn: () => getClient().getPreorders() });
}
export function useVendorMenu(): UseQueryResult<VendorMenuItem[]> {
  return useQuery({ queryKey: queryKeys.vendorMenu, queryFn: () => getClient().getVendorMenu() });
}
export function useSetStock(): UseMutationResult<VendorMenuItem[], Error, { itemId: string; inStock: boolean }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, inStock }) => getClient().setStock(itemId, inStock),
    onSuccess: (menu) => qc.setQueryData(queryKeys.vendorMenu, menu),
  });
}
export function useMarkAllOut(): UseMutationResult<VendorMenuItem[], Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => getClient().markAllOut(),
    onSuccess: (menu) => qc.setQueryData(queryKeys.vendorMenu, menu),
  });
}
export function useVerifyPickupCode(): UseMutationResult<PickupRecord | null, Error, string> {
  return useMutation({ mutationFn: (code: string) => getClient().verifyPickupCode(code) });
}
export function usePayouts(): UseQueryResult<Payout[]> {
  return useQuery({ queryKey: queryKeys.payouts, queryFn: () => getClient().getPayouts() });
}
export function useTxns(): UseQueryResult<Txn[]> {
  return useQuery({ queryKey: queryKeys.txns, queryFn: () => getClient().getTxns() });
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
