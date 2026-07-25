'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBreakpoint } from '@jajanhub/ui';
import { Cart } from '../../../../components/customer/Cart';

/**
 * At desktop the cart is an always-visible panel inside MerchantDesktopView
 * (`/m/[merchantId]`) — there's no separate cart screen to render, so this
 * route just bounces back there, preserving state (cart-store is a
 * merchantId-scoped singleton, unaffected by the redirect).
 */
export default function CartPage({ params }: { params: { merchantId: string } }) {
  const router = useRouter();
  const bp = useBreakpoint();

  useEffect(() => {
    if (bp === 'desktop') router.replace(`/m/${params.merchantId}`);
  }, [bp, params.merchantId, router]);

  if (bp === 'desktop') return null;
  return <Cart merchantId={params.merchantId} />;
}
