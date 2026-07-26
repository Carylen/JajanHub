'use client';
import { BottomSheet } from '@jajanhub/ui';
import { RatingFormBody } from './RatingFormBody';

export interface RatingFormProps {
  open: boolean;
  onClose: () => void;
  merchantName: string;
  orderCode: string;
  onSubmit: (rating: number, chips: string[], note: string) => void;
}

/** Mobile post-order rating — `RatingFormBody` inside a `BottomSheet`. Desktop
 * counterpart is `RatingModal` (same body, `Modal` shell) — two thin shell
 * files, not one breakpoint-branching component, per this codebase's
 * Sheet/Modal convention (CancelSheet/CancelModal, RejectSheet/RejectModal). */
export function RatingSheet({ open, onClose, merchantName, orderCode, onSubmit }: RatingFormProps) {
  return (
    <BottomSheet open={open} onClose={onClose} label="Beri rating pesanan">
      <RatingFormBody merchantName={merchantName} orderCode={orderCode} onSubmit={onSubmit} onSkip={() => onSubmit(0, [], '')} />
    </BottomSheet>
  );
}
