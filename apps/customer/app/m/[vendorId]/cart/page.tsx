'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBreakpoint } from '@jajanhub/ui';
import { Cart } from '../../../../components/customer/Cart';

/**
 * At desktop the cart is an always-visible panel inside MerchantDesktopView
 * (`/m/[vendorId]`) — there's no separate cart screen to render, so this
 * route just bounces back there, preserving state (cart-store is a
 * vendorId-scoped singleton, unaffected by the redirect).
 */
export default function CartPage({ params }: { params: { vendorId: string } }) {
  const router = useRouter();
  const bp = useBreakpoint();

  useEffect(() => {
    if (bp === 'desktop') router.replace(`/m/${params.vendorId}`);
  }, [bp, params.vendorId, router]);

  if (bp === 'desktop') return null;
  return <Cart vendorId={params.vendorId} />;
}
