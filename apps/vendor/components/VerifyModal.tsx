'use client';
import { Modal, Button, Icon, cn } from '@jajanhub/ui';
import { useVerifyFlow, VERIFY_KEYS } from './useVerifyFlow';

interface VerifyModalProps {
  open: boolean;
  onClose: () => void;
}

/** Desktop counterpart to VerifyCodeSheet — same useVerifyFlow(), Modal shell
 * matching Antre/Antri Pedagang Desktop.dc.html's verify modal. */
export function VerifyModal({ open, onClose }: VerifyModalProps) {
  const { code, result, shake, press, runVerify, reset, pending } = useVerifyFlow();

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} label="Verifikasi kode pengambilan">
      {result === null && (
        <div className="text-center">
          <div className="font-display font-extrabold text-[23px]">Verifikasi Pengambilan</div>
          <div className="text-sm text-faint mt-1.5">Minta pelanggan sebut kode 4 digit</div>
          <div key={shake} className={cn('flex justify-center gap-3 my-6', shake > 0 && 'animate-[shakex_.4s]')}>
            {[0, 1, 2, 3].map((i) => {
              const ch = code[i];
              const filled = ch !== undefined;
              return (
                <div
                  key={i}
                  className={cn(
                    'w-[60px] h-[70px] rounded-2xl border-2 flex items-center justify-center',
                    filled ? 'bg-white border-brand' : 'bg-[#F4ECE2] border-line',
                  )}
                >
                  <span className="font-display font-extrabold text-[32px] text-ink">{ch ?? ''}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-[11px]">
            {VERIFY_KEYS.map((k) => {
              const isNum = k !== 'qr' && k !== 'del';
              return (
                <button
                  key={k}
                  type="button"
                  aria-label={k === 'qr' ? 'Scan QR' : k === 'del' ? 'Hapus' : k}
                  onClick={() => press(k)}
                  className={cn(
                    'rounded-2xl py-[17px] font-display font-extrabold text-[22px] flex items-center justify-center transition-transform active:scale-95',
                    isNum ? 'bg-white text-ink shadow-[0_3px_8px_rgba(35,24,15,.06)]' : 'bg-[#F1E7DC]',
                    k === 'qr' && 'text-prio',
                    k === 'del' && 'text-brand-press',
                  )}
                >
                  {k === 'qr' ? <Icon name="qr" size={24} /> : k === 'del' ? <Icon name="backspace" size={26} /> : k}
                </button>
              );
            })}
          </div>
          <Button
            variant="mint"
            fullWidth
            className="mt-4 disabled:bg-[#D6C9BA] disabled:shadow-none"
            disabled={code.length !== 4 || pending}
            onClick={() => runVerify(code)}
          >
            {pending ? 'Memeriksa…' : 'Verifikasi'}
          </Button>
        </div>
      )}

      {result?.status === 'ok' && (
        <div className="text-center animate-popin">
          <div className="w-[88px] h-[88px] rounded-full mx-auto bg-mint-soft flex items-center justify-center">
            <Icon name="check" size={46} className="text-mint" strokeWidth={2.8} />
          </div>
          <div className="font-display font-extrabold text-2xl mt-4">Cocok! Serahkan pesanan</div>
          <div className="bg-white rounded-2xl p-5 mt-5 text-left shadow-card">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <div className="font-display font-extrabold text-xl">{result.record.no}</div>
                <div className="text-xs text-faint">
                  {result.record.customer} · {result.record.slot}
                </div>
              </div>
              <span className="bg-mint-soft text-mint-deep text-xs font-extrabold px-3 py-1.5 rounded-full">Kode {result.record.code}</span>
            </div>
            <div className="flex flex-col gap-[7px] border-t border-line pt-3.5">
              {result.record.lines.map((l, i) => (
                <div key={i} className="flex gap-2.5 text-sm">
                  <span className="font-extrabold text-brand-deep">{l.qty}×</span>
                  <span>{l.name}</span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="mint" fullWidth className="mt-[18px]" onClick={handleClose}>
            Selesai · Sudah diserahkan
          </Button>
        </div>
      )}

      {result?.status === 'fail' && (
        <div className="text-center animate-popin">
          <div className="w-[88px] h-[88px] rounded-full mx-auto bg-danger-soft flex items-center justify-center">
            <Icon name="x" size={44} className="text-danger" strokeWidth={2.8} />
          </div>
          <div className="font-display font-extrabold text-2xl mt-4">Kode tidak ditemukan</div>
          <div className="text-sm text-faint mt-1.5 leading-[1.5]">
            Kode <b className="text-brand-press">{result.tried}</b> nggak cocok sama pesanan yang siap. Cek lagi sama pelanggan ya.
          </div>
          <Button variant="dark" fullWidth className="mt-[22px]" onClick={reset}>
            Coba Lagi
          </Button>
        </div>
      )}
    </Modal>
  );
}
