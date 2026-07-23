import { Icon, cn } from '@jajanhub/ui';

interface Step {
  label: string;
  sub: string;
}

const STEPS: Step[] = [
  { label: 'Dibayar', sub: 'Pembayaran diterima' },
  { label: 'Dimasak', sub: 'Chef lagi masak pesananmu' },
  { label: 'Siap Diambil', sub: 'Ambil di gerobak, tunjukin nomormu' },
];

/** Vertical progress timeline driven by the current queue stage (0/1/2). */
export function QueueSteps({ stage }: { stage: number }) {
  return (
    <div>
      {STEPS.map((s, i) => {
        const done = i < stage;
        const active = i === stage;
        const hasLine = i < STEPS.length - 1;
        return (
          <div key={s.label} className="flex gap-[14px] items-start relative pb-[22px]">
            <div
              className={cn(
                'relative z-[2] flex-none w-10 h-10 rounded-[13px] flex items-center justify-center',
                done ? 'bg-mint text-white' : active ? 'bg-brand text-white' : 'bg-[#F1E7DC] text-[#B8A99B]',
              )}
              style={active ? { boxShadow: '0 0 0 6px rgba(255,122,26,.16)' } : undefined}
            >
              {done ? (
                <Icon name="check" size={20} strokeWidth={2.4} />
              ) : (
                <span className="font-extrabold text-[15px]">{i + 1}</span>
              )}
            </div>
            <div className="pt-0.5">
              <div className={cn('font-bold text-[15px]', done || active ? 'text-ink' : 'text-[#B8A99B]')}>
                {s.label}
              </div>
              <div className="text-xs text-faint mt-px">{s.sub}</div>
            </div>
            {hasLine && (
              <span
                className={cn(
                  'absolute left-[19px] top-[42px] h-5 w-0.5 z-[1]',
                  done ? 'bg-mint' : 'bg-[#F1E7DC]',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
