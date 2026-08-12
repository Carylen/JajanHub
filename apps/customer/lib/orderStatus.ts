import type { OrderStatus } from '@jajanhub/api';

export interface OrderStatusMeta {
  label: string;
  bg: string;
  color: string;
  dot: string;
}

/** Status → badge tone for the Pesanan Aktif list (mobile + desktop). */
export function orderStatusMeta(status: OrderStatus): OrderStatusMeta {
  switch (status) {
    case 'pending_payment':
      return { label: 'Menunggu pembayaran', bg: 'bg-[#FFEBE9]', color: 'text-danger', dot: 'bg-[#F5566B]' };
    case 'waiting_confirmation':
      return { label: 'Menunggu konfirmasi gerobak', bg: 'bg-[#FFF3E7]', color: 'text-brand-deep', dot: 'bg-[#F5A623]' };
    case 'cooking':
      return { label: 'Lagi dimasak', bg: 'bg-[#FFF3E7]', color: 'text-brand-deep', dot: 'bg-[#F5A623]' };
    case 'ready':
      return { label: 'Siap diambil', bg: 'bg-mint-soft', color: 'text-mint-deep', dot: 'bg-mint' };
    case 'rejected':
      return { label: 'Ditolak, refund diproses', bg: 'bg-[#F1E7DC]', color: 'text-muted', dot: 'bg-[#C4B29B]' };
    default:
      return { label: 'Dalam antrean', bg: 'bg-mint-soft', color: 'text-mint-deep', dot: 'bg-mint' };
  }
}
