import { MerchantExperience } from '../../../components/customer/MerchantExperience';

/** QR-per-gerobak entry point: splash + landing + menu (BRIEF §4). */
export default function MerchantPage({ params }: { params: { merchantId: string } }) {
  return <MerchantExperience merchantId={params.merchantId} />;
}
