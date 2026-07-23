'use client';
import { useRouter } from 'next/navigation';
import { useOrder, useRefundState } from '@jajanhub/api';
import { Button, Card, Icon, Money } from '@jajanhub/ui';
import { ScreenHeader } from '../ScreenHeader';
import { LoadingState, ErrorState } from '../StateViews';
import { RefundSteps } from './RefundSteps';
import { useCartStore } from '../../lib/cart-store';

export function RefundStatus({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const refund = useRefundState(orderId);
  const clearCart = useCartStore((s) => s.clear);

  if (isLoading) return <LoadingState label="Memuat status refund…" />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  const amount = refund?.amount ?? order.total;
  const stage = refund?.stage ?? 'cancelled';
  const method = refund?.method ?? 'GoPay •••• 7890';

  const orderAgain = () => {
    clearCart();
    router.push(`/m/${order.merchantId}`);
  };

  return (
    <div className="animate-screen-in min-h-screen bg-[linear-gradient(180deg,#FFF8F1,#FFF1E4)] pb-[130px]">
      <ScreenHeader title="Status Refund" backHref={`/m/${order.merchantId}`} />

      <div className="text-center mt-3.5">
        <div className="w-[72px] h-[72px] rounded-[22px] mx-auto bg-[linear-gradient(135deg,#FF9A8A,#E5484D)] flex items-center justify-center shadow-[0_12px_26px_rgba(229,72,77,.28)] animate-popin">
          <Icon name="trash" size={36} className="text-white" strokeWidth={2} />
        </div>
        <h1 className="font-display font-extrabold text-2xl mt-4 mb-1.5 tracking-[-.4px]">Pesanan dibatalkan</h1>
        <p className="text-faint text-sm">
          Pesanan {order.code} · {order.merchantName}
        </p>
      </div>

      <Card className="mx-5 mt-5 p-[22px] text-center shadow-soft">
        <div className="text-[13px] text-faint font-semibold">Dana dikembalikan</div>
        <Money amount={amount} display className="text-[38px] text-mint-deep tracking-[-.5px] mt-0.5 block" />
        <div className="inline-flex items-center gap-1.5 mt-2 bg-mint-soft text-[#0E7A56] font-bold text-xs px-3 py-1.5 rounded-full">
          ke {method}
        </div>
      </Card>

      <Card className="mx-5 mt-4 px-5 pt-[22px] pb-1.5">
        <RefundSteps stage={stage} />
      </Card>

      <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-app px-5 pt-4 pb-[22px] bg-[linear-gradient(to_top,#FFF1E4_72%,transparent)] z-20">
        <Button variant="primary" fullWidth onClick={orderAgain}>
          Pesan Lagi
        </Button>
      </div>
    </div>
  );
}
