import { Pickup } from '../../../../components/customer/Pickup';

export default function PickupPage({ params }: { params: { orderId: string } }) {
  return <Pickup orderId={params.orderId} />;
}
