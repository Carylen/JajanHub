'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { useMerchantScreen } from '../../../components/customer/useMerchantScreen';
import { MerchantMobileView } from '../../../components/customer/MerchantMobileView';
import { MerchantDesktopView } from '../../../components/customer/MerchantDesktopView';

/** QR-per-gerobak entry point: splash+landing+menu (mobile) or merged catalog+cart (desktop). */
export default function MerchantPage({ params }: { params: { merchantId: string } }) {
  const vm = useMerchantScreen(params.merchantId);
  const bp = useBreakpoint();
  return bp === 'desktop' ? <MerchantDesktopView {...vm} /> : <MerchantMobileView {...vm} />;
}
