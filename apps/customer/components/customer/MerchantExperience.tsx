'use client';
import { useEffect, useState } from 'react';
import { useWarung } from '@jajanhub/api';
import { useCartStore } from '../../lib/cart-store';
import { LoadingState, ErrorState } from '../StateViews';
import { Splash } from './Splash';
import { Landing } from './Landing';
import { Menu } from './Menu';

type View = 'splash' | 'landing' | 'menu';

/**
 * Orchestrates the splash → landing → menu views for a merchant. These share
 * one URL (`/w/[merchantId]`) per BRIEF §4; only the transient view is local
 * state. Cart lives in the persisted store, scoped to this merchant.
 */
export function MerchantExperience({ merchantId }: { merchantId: string }) {
  const { data: warung, isLoading, isError, refetch } = useWarung(merchantId);
  const ensureMerchant = useCartStore((s) => s.ensureMerchant);
  const [view, setView] = useState<View>('splash');

  useEffect(() => {
    ensureMerchant(merchantId);
  }, [merchantId, ensureMerchant]);

  // Auto-advance the splash once (design: ~2.1s).
  useEffect(() => {
    if (view !== 'splash') return;
    const t = setTimeout(() => setView('landing'), 2100);
    return () => clearTimeout(t);
  }, [view]);

  if (isLoading) return <LoadingState label="Menyiapkan gerobak…" />;
  if (isError || !warung) {
    return (
      <ErrorState
        message="Gagal memuat gerobak ini. Cek koneksimu, ya."
        onRetry={() => refetch()}
      />
    );
  }

  if (view === 'splash') return <Splash warungName={warung.name} />;
  if (view === 'menu') return <Menu warung={warung} onBack={() => setView('landing')} />;
  return <Landing warung={warung} onSeeMenu={() => setView('menu')} />;
}
