'use client';
import { Modal } from '@jajanhub/ui';
import { RatingFormBody } from './RatingFormBody';
import type { RatingFormProps } from './RatingSheet';

/** Desktop post-order rating — matches Antre/Antri Desktop.dc.html's
 * `ratingOpen` modal (440px). Same `RatingFormBody` as `RatingSheet`
 * (mobile), just a `Modal` shell instead of a `BottomSheet`. */
export function RatingModal({ open, onClose, merchantName, orderCode, onSubmit }: RatingFormProps) {
  return (
    <Modal open={open} onClose={onClose} label="Beri rating pesanan" width="440px">
      <RatingFormBody merchantName={merchantName} orderCode={orderCode} onSubmit={onSubmit} onSkip={() => onSubmit(0, [], '')} />
    </Modal>
  );
}
