import { QueueHero } from '../../../components/customer/QueueHero';

export default function OrderPage({ params }: { params: { orderId: string } }) {
  return <QueueHero orderId={params.orderId} />;
}
