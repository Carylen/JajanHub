import { Payment } from '../../../../components/customer/Payment';

export default function PayPage({ params }: { params: { orderId: string } }) {
  return <Payment orderId={params.orderId} />;
}
