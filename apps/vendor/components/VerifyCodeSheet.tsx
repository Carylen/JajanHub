'use client';
import { useState } from 'react';
import { useVerifyPickupCode, type PickupRecord } from '@jajanhub/api';
import { BottomSheet, Button, Icon, cn } from '@jajanhub/ui';

type Result = { status: 'ok'; record: PickupRecord } | { status: 'fail'; tried: string } | null;

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'qr', '0', 'del'] as const;

interface VerifyCodeSheetProps {
  open: boolean;
  onClose: () => void;
}

/** Pickup-code verification overlay: numeric keypad → match / not-found (BRIEF §5). */
export function VerifyCodeSheet({ open, onClose }: VerifyCodeSheetProps) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<Result>(null);
  const [shake, setShake] = useState(0);
  const verify = useVerifyPickupCode();

  const reset = () => {
    setCode('');
    setResult(null);
  };
  const handleClose = () => {
    reset();
    onClose();
  };

  const press = (key: (typeof KEYS)[number]) => {
    if (key === 'del') return setCode((c) => c.slice(0, -1));
    if (key === 'qr') return runVerify('6042');
    setCode((c) => (c.length >= 4 ? c : c + key));
  };

  const runVerify = (value: string) => {
    if (value.length < 4) return;
    verify.mutate(value, {
      onSuccess: (record) => {
        if (record) setResult({ status: 'ok', record });
        else {
          setResult({ status: 'fail', tried: value });
          setCode('');
          setShake((s) => s + 1);
        }
      },
    });
  };

  return (
    <BottomSheet open={open} onClose={handleClose} label="Verifikasi kode pengambilan" draggable={false}>
      <div className="flex items-center justify-between mb-1.5 -mt-2">
        <div className="font-display font-extrabold text-xl">Verifikasi Pengambilan</div>
        <button
          type="button"
          aria-label="Tutup"
          onClick={handleClose}
          className="w-10 h-10 rounded-[13px] bg-[#F1E7DC] flex items-center justify-center transition-transform active:scale-90"
        >
          <Icon name="x" size={19} className="text-muted" strokeWidth={2.2} />
        </button>
      </div>

      {result === null && (
        <div>
          <div className="text-sm text-faint mb-4">Ketik 4 digit kode dari pelanggan</div>
          <div key={shake} className={cn('flex justify-center gap-3 mb-2', shake > 0 && 'animate-[shakex_.4s]')}>
            {[0, 1, 2, 3].map((i) => {
              const ch = code[i];
              const filled = ch !== undefined;
              return (
                <div
                  key={i}
                  className={cn(
                    'w-[62px] h-[76px] rounded-[18px] border-2 flex items-center justify-center',
                    filled ? 'bg-white border-brand' : 'bg-[#F4ECE2] border-line',
                  )}
                >
                  <span className="font-display font-extrabold text-[40px] text-ink">{ch ?? ''}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-2.5 mt-[18px]">
            {KEYS.map((k) => {
              const isNum = k !== 'qr' && k !== 'del';
              return (
                <button
                  key={k}
                  type="button"
                  aria-label={k === 'qr' ? 'Scan QR' : k === 'del' ? 'Hapus' : k}
                  onClick={() => press(k)}
                  className={cn(
                    'h-[66px] rounded-[18px] font-display font-extrabold text-[26px] flex items-center justify-center transition-transform active:scale-95',
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
          <Button variant="mint" fullWidth className="mt-4 disabled:bg-[#D6C9BA] disabled:shadow-none" disabled={code.length !== 4} onClick={() => runVerify(code)}>
            Verifikasi Kode
          </Button>
        </div>
      )}

      {result?.status === 'ok' && (
        <div className="text-center pt-2">
          <div className="w-[88px] h-[88px] rounded-[28px] mx-auto bg-[linear-gradient(135deg,#34E0A8,#16C784)] flex items-center justify-center shadow-[0_14px_30px_rgba(22,199,132,.4)] animate-popin">
            <Icon name="check" size={46} className="text-white" strokeWidth={2.8} />
          </div>
          <div className="font-display font-extrabold text-[23px] mt-4">Kode Cocok!</div>
          <div className="text-sm text-faint mt-1">Serahkan pesanan ke pelanggan</div>
          <div className="mt-[18px] bg-white rounded-[20px] p-[18px] shadow-card text-left">
            <div className="flex items-center gap-3 pb-3 border-b border-dashed border-line">
              <div className="flex-none w-[46px] h-[46px] rounded-[14px] bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center text-white font-display font-extrabold text-[15px]">
                {result.record.no.split('-')[1]}
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-base">{result.record.customer}</div>
                <div className="text-xs text-faint">Kode {result.record.code} · {result.record.slot}</div>
              </div>
            </div>
            <div className="pt-3 flex flex-col gap-2">
              {result.record.lines.map((l, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm">
                  <span className="flex-none min-w-[28px] h-[26px] px-[7px] rounded-lg bg-[#FFF3E7] text-brand-deep font-extrabold text-[13px] flex items-center justify-center">
                    {l.qty}×
                  </span>
                  <span className="font-semibold">{l.name}</span>
                </div>
              ))}
            </div>
          </div>
          <Button variant="mint" fullWidth className="mt-[18px]" onClick={handleClose}>
            Selesai
          </Button>
        </div>
      )}

      {result?.status === 'fail' && (
        <div className="text-center pt-2">
          <div className="w-[88px] h-[88px] rounded-[28px] mx-auto bg-[linear-gradient(135deg,#FF7A6B,#E5484D)] flex items-center justify-center shadow-[0_14px_30px_rgba(229,72,77,.36)] animate-popin">
            <Icon name="x" size={44} className="text-white" strokeWidth={2.8} />
          </div>
          <div className="font-display font-extrabold text-[23px] mt-4">Kode tidak ditemukan</div>
          <div className="text-sm text-faint mt-1.5 leading-[1.5] max-w-[280px] mx-auto">
            Kode <b className="text-brand-press">{result.tried}</b> nggak cocok sama pesanan yang siap. Cek lagi sama pelanggan ya.
          </div>
          <Button variant="dark" fullWidth className="mt-[22px]" onClick={reset}>
            Coba Lagi
          </Button>
        </div>
      )}
    </BottomSheet>
  );
}
