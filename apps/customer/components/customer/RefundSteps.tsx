import { Icon, cn } from '@jajanhub/ui';
import { COPY, type RefundStage } from '@jajanhub/api';

const STEPS = [
  { label: 'Pesanan Dibatalkan', sub: 'Pembatalan berhasil diterima' },
  { label: 'Refund Diproses', sub: 'Dana lagi dikembalikan ke metode pembayaranmu' },
  { label: 'Dana Kembali', sub: `Masuk ke QRIS/e-wallet dalam ${COPY.refundEtaShort}` },
];

/** How many steps are complete for a given refund stage. */
function stageIndex(stage: RefundStage): number {
  return stage === 'cancelled' ? 1 : stage === 'processing' ? 2 : 3;
}

export function RefundSteps({ stage }: { stage: RefundStage }) {
  const idx = stageIndex(stage);
  return (
    <div>
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        const hasLine = i < STEPS.length - 1;
        return (
          <div key={s.label} className="flex gap-[14px] items-start relative pb-6">
            <div
              className={cn(
                'relative z-[2] flex-none w-10 h-10 rounded-[13px] flex items-center justify-center',
                done ? 'bg-mint text-white' : active ? 'bg-brand text-white' : 'bg-[#F1E7DC] text-[#B8A99B]',
              )}
              style={active ? { boxShadow: '0 0 0 6px rgba(255,122,26,.16)' } : undefined}
            >
              {done ? (
                <Icon name="check" size={20} strokeWidth={2.4} />
              ) : active ? (
                <span className="w-[18px] h-[18px] rounded-full border-[2.5px] border-white/50 border-t-white animate-spin" />
              ) : (
                <span className="w-[9px] h-[9px] rounded-full bg-current" />
              )}
            </div>
            <div className="pt-[3px] flex-1">
              <div className={cn('font-bold text-[15px]', done || active ? 'text-ink' : 'text-faint')}>
                {s.label}
              </div>
              <div className="text-xs text-faint mt-0.5 leading-[1.4]">{s.sub}</div>
            </div>
            {hasLine && (
              <span
                className={cn('absolute left-[19px] top-[42px] h-6 w-0.5 z-[1]', done ? 'bg-mint' : 'bg-[#F1E7DC]')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
