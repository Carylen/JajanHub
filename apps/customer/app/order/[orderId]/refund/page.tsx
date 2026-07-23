import { RefundStatus } from '../../../../components/customer/RefundStatus';

export default function RefundPage({ params }: { params: { orderId: string } }) {
  return <RefundStatus orderId={params.orderId} />;
}
