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
import type { Customer, RequestOtpResult } from './auth';
import type {
  CancelReason,
  ConfigFees,
  CreateOrderInput,
  LoyalCustomer,
  Order,
  Payout,
  PickupRecord,
  Preorder,
  QueueState,
  RefundState,
  RejectReasonId,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  SubscriptionStatus,
  Txn,
  UserProfile,
  Vendor,
  VendorMenuItem,
  VendorSummary,
  VendorTierStatus,
} from './types';

export const queryKeys = {
  warung: (id: string) => ['warung', id] as const,
  order: (id: string) => ['order', id] as const,
  me: ['auth', 'me'] as const,
  stalls: ['stalls'] as const,
  configFees: ['config', 'fees'] as const,
  plans: ['plans'] as const,
  benefits: ['benefits'] as const,
  subscriptionStatus: ['subscription', 'status'] as const,
  profile: ['profile'] as const,
  vendorSummary: ['vendor', 'summary'] as const,
  vendorTier: ['vendor', 'tier'] as const,
  vendorOrders: ['vendor', 'orders'] as const,
  preorders: ['vendor', 'preorders'] as const,
  vendorMenu: ['vendor', 'menu'] as const,
  payouts: ['vendor', 'payouts'] as const,
  txns: ['vendor', 'txns'] as const,
  loyalCustomers: ['vendor', 'customers'] as const,
};

/* auth (API_CONTRACT.md §1) — not wired into any screen yet, see auth.ts */
export function useRequestOtp(): UseMutationResult<RequestOtpResult, Error, string> {
  return useMutation({ mutationFn: (phone: string) => getClient().requestOtp(phone) });
}
export function useVerifyOtp(): UseMutationResult<Customer, Error, { phone: string; code: string }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, code }) => getClient().verifyOtp(phone, code),
    onSuccess: (customer) => qc.setQueryData(queryKeys.me, customer),
  });
}
export function useMe(): UseQueryResult<Customer> {
  return useQuery({ queryKey: queryKeys.me, queryFn: () => getClient().getMe(), retry: false });
}
export function useLogout(): UseMutationResult<void, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => getClient().logout(),
    onSuccess: () => qc.setQueryData(queryKeys.me, null),
  });
}

export function useWarung(id: string): UseQueryResult<Vendor> {
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

export function useCancelOrder(): UseMutationResult<Order, Error, { id: string; reason: CancelReason }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => getClient().cancelOrder(id, reason),
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
export function useConfigFees(): UseQueryResult<ConfigFees> {
  return useQuery({ queryKey: queryKeys.configFees, queryFn: () => getClient().getConfigFees(), staleTime: Infinity });
}
export function usePlans(): UseQueryResult<SubscriptionPlan[]> {
  return useQuery({ queryKey: queryKeys.plans, queryFn: () => getClient().getPlans() });
}
export function useBenefits(): UseQueryResult<SubscriptionBenefit[]> {
  return useQuery({ queryKey: queryKeys.benefits, queryFn: () => getClient().getBenefits() });
}
export function useSubscriptionStatus(): UseQueryResult<SubscriptionStatus> {
  return useQuery({ queryKey: queryKeys.subscriptionStatus, queryFn: () => getClient().getSubscriptionStatus() });
}
export function useProfile(): UseQueryResult<UserProfile> {
  return useQuery({ queryKey: queryKeys.profile, queryFn: () => getClient().getProfile() });
}

export function useVendorSummary(): UseQueryResult<VendorSummary> {
  return useQuery({ queryKey: queryKeys.vendorSummary, queryFn: () => getClient().getVendorSummary() });
}
export function useVendorTier(): UseQueryResult<VendorTierStatus> {
  return useQuery({ queryKey: queryKeys.vendorTier, queryFn: () => getClient().getVendorTier() });
}
export function useAdvanceVendorTier(): UseMutationResult<VendorTierStatus, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => getClient().advanceVendorTier(),
    onSuccess: (status) => qc.setQueryData(queryKeys.vendorTier, status),
  });
}
export function useResetVendorTier(): UseMutationResult<VendorTierStatus, Error, void> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => getClient().resetVendorTier(),
    onSuccess: (status) => qc.setQueryData(queryKeys.vendorTier, status),
  });
}
export function useVendorOrders(): UseQueryResult<Order[]> {
  return useQuery({ queryKey: queryKeys.vendorOrders, queryFn: () => getClient().getVendorOrders() });
}
export function useAdvanceVendorOrder(): UseMutationResult<Order[], Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => getClient().advanceVendorOrder(id),
    onSuccess: (orders) => qc.setQueryData(queryKeys.vendorOrders, orders),
  });
}
export function useRejectVendorOrder(): UseMutationResult<Order[], Error, { id: string; reason: RejectReasonId }> {
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
