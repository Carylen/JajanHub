'use client';
import { useActiveOrders, type Order } from '@jajanhub/api';
import { usePageAuthGuard } from './auth/usePageAuthGuard';

export interface ActiveOrdersScreenView {
  isLoggedIn: boolean;
  orders: Order[] | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/** `/orders` — gated (direct deep-link too, via usePageAuthGuard) list of every non-terminal order across vendors. */
export function useActiveOrdersScreen(): ActiveOrdersScreenView {
  const isLoggedIn = usePageAuthGuard();
  const { data: orders, isLoading, isError, refetch } = useActiveOrders();
  return { isLoggedIn, orders, isLoading, isError, refetch };
}
