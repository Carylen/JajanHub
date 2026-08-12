'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

/**
 * Gates a route against direct deep-links (not just nav clicks): if the
 * visitor isn't logged in, opens the same global login flow `requireAuth`
 * powers, bouncing back to `/` if they close it without logging in. Screens
 * should render nothing (or `LoadingState`) while this returns `false`.
 */
export function usePageAuthGuard(): boolean {
  const { isLoggedIn, isSessionLoading, requireAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSessionLoading) return; // don't gate until we actually know the session state
    if (!isLoggedIn) requireAuth(() => {}, () => router.replace('/'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isSessionLoading]);

  return isLoggedIn && !isSessionLoading;
}
