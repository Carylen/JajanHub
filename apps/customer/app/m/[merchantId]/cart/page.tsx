import { Cart } from '../../../../components/customer/Cart';

export default function CartPage({ params }: { params: { merchantId: string } }) {
  return <Cart merchantId={params.merchantId} />;
}
