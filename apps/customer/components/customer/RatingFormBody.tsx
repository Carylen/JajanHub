'use client';
import { useState } from 'react';
import { RATING_CHIPS, RATING_LABELS } from '@jajanhub/api';
import { Button, Chip, cn } from '@jajanhub/ui';

export interface RatingFormBodyProps {
  merchantName: string;
  orderCode: string;
  onSubmit: (rating: number, chips: string[], note: string) => void;
  onSkip: () => void;
}

/**
 * The rating form's content — stars, chips, note, submit/skip — with no
 * overlay shell of its own. `RatingSheet` (mobile, `BottomSheet`) and
 * `RatingModal` (desktop, `Modal`) both render this, so the form UI/state
 * exists in exactly one place; only the surrounding chrome differs.
 */
export function RatingFormBody({ merchantName, orderCode, onSubmit, onSkip }: RatingFormBodyProps) {
  const [rating, setRating] = useState(0);
  const [chips, setChips] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState('');

  const toggleChip = (c: string) => setChips((s) => ({ ...s, [c]: !s[c] }));
  const submit = () => onSubmit(rating, Object.keys(chips).filter((c) => chips[c]), note);

  return (
    <>
      <div className="text-center">
        <div className="w-[72px] h-[72px] rounded-[22px] mx-auto bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center shadow-[0_12px_26px_rgba(255,122,26,.3)]">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2.5 11.5h19a9.5 9.5 0 0 1-19 0z" fill="#fff" />
            <path
              d="M8 6.5c0-1.2.9-1.6.9-2.8M12 6.3c0-1.2.9-1.6.9-2.8M16 6.5c0-1.2.9-1.6.9-2.8"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="font-display font-extrabold text-2xl mt-4 mb-1.5 tracking-[-.4px]">Gimana pesananmu?</h1>
        <p className="text-faint text-sm">
          {merchantName} · Pesanan {orderCode}
        </p>
      </div>

      <div className="flex justify-center gap-2.5 mt-6">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`Beri ${n} bintang`}
            aria-pressed={n <= rating}
            onClick={() => setRating(n)}
            className="p-0.5 transition-transform active:scale-[.85]"
          >
            <svg width="42" height="42" viewBox="0 0 24 24" fill={n <= rating ? '#FFB020' : '#EFE6DA'} aria-hidden="true">
              <path
                d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6 21l1.2-6.6L2.4 9.7l6.6-.9z"
                stroke={n <= rating ? '#FFB020' : '#E0D4C4'}
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>
      <div className={cn('text-center text-brand font-bold text-sm mt-2.5 h-[18px]')}>
        {RATING_LABELS[rating] ?? ''}
      </div>

      <div className="flex flex-wrap gap-[9px] justify-center mt-5">
        {RATING_CHIPS.map((c) => (
          <Chip key={c} active={!!chips[c]} onClick={() => toggleChip(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="mt-[22px] bg-white rounded-[18px] px-4 py-1 shadow-card">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ada masukan buat pedagang? (opsional)"
          className="w-full border-0 outline-none resize-none h-16 py-3.5 text-sm text-ink bg-transparent font-sans"
        />
      </div>

      <Button variant="primary" fullWidth className="mt-5" onClick={submit}>
        Kirim Rating
      </Button>
      <Button variant="ghost" fullWidth className="text-faint pt-3.5" onClick={onSkip}>
        Nanti aja
      </Button>
    </>
  );
}
