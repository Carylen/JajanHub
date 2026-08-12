'use client';
import { createContext, useContext } from 'react';

export interface AuthContextValue {
  isLoggedIn: boolean;
  /** True until the initial `useMe()` fetch resolves — guards must wait on this before deciding to gate, or an already-logged-in visitor would see a false-positive login prompt flash on every hard reload. */
  isSessionLoading: boolean;
  /**
   * Run `onSuccess` if already logged in; otherwise open the login sheet/modal
   * and run it after a successful OTP verify. `onCancel` (if given) runs if
   * the user dismisses the flow without logging in — used by page-level
   * guards to bounce back home from a direct deep-link.
   */
  requireAuth: (onSuccess: () => void, onCancel?: () => void) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
