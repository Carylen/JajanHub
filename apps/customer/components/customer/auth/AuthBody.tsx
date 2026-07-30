'use client';
import { Button, Icon, OtpInput } from '@jajanhub/ui';
import type { AuthFlowProps } from './AuthProvider';

/** Step content shared by AuthSheet (mobile) and AuthModal (desktop) — only the surrounding shell differs. */
export function AuthBody(props: AuthFlowProps) {
  if (props.step === 'ok') return <OkStep />;
  if (props.step === 'otp') return <OtpStep {...props} />;
  return <PhoneStep {...props} />;
}

function PhoneStep({ phone, onPhoneChange, onSendOtp, sendingOtp, error }: AuthFlowProps) {
  return (
    <div>
      <div className="w-16 h-16 rounded-[20px] bg-mint-soft flex items-center justify-center shadow-[0_8px_20px_rgba(22,199,132,.18)]">
        <Icon name="phone" size={30} className="text-mint-deep" strokeWidth={2} />
      </div>
      <h1 className="font-display font-extrabold text-[25px] mt-[18px] mb-2 tracking-[-.5px] leading-[1.15]">
        Masuk atau daftar
        <br />
        pakai nomor HP
      </h1>
      <p className="text-faint text-sm leading-[1.5]">
        Nggak pakai password. Kami kirim kode verifikasi lewat WhatsApp.
      </p>

      <div className="flex gap-2.5 mt-6">
        <div className="flex-none flex items-center gap-1.5 bg-[#F1E7DC] rounded-[14px] px-[15px] font-extrabold text-base text-ink">
          <span className="text-base">🇮🇩</span>+62
        </div>
        <input
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          inputMode="numeric"
          placeholder="812-3456-7890"
          className="flex-1 min-w-0 border-2 border-line rounded-[14px] px-4 py-[15px] font-bold text-base text-ink bg-white outline-none focus:border-brand"
        />
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-3 text-danger text-[13px] font-semibold">
          <Icon name="warning" size={15} />
          {error}
        </div>
      )}
      <div className="flex items-center gap-2 mt-3.5 text-[#0E9F6E] text-[12.5px] font-semibold">
        <Icon name="check-circle" size={15} className="text-mint-deep" />
        Kode dikonfirmasi lewat WhatsApp ke nomor ini
      </div>

      <Button variant="primary" fullWidth className="mt-6" onClick={onSendOtp} disabled={sendingOtp}>
        {sendingOtp ? 'Mengirim…' : 'Kirim Kode OTP'}
        {!sendingOtp && <Icon name="chevron-right" size={18} className="text-white" strokeWidth={2.4} />}
      </Button>
    </div>
  );
}

function OtpStep({
  phone,
  otp,
  onOtpChange,
  onOtpComplete,
  onVerify,
  verifying,
  onEditNumber,
  error,
  resendLeft,
  onResend,
}: AuthFlowProps) {
  return (
    <div>
      <h1 className="font-display font-extrabold text-[25px] mb-2 tracking-[-.5px] leading-[1.15]">
        Masukkan kode
      </h1>
      <p className="text-faint text-sm leading-[1.5]">
        Kode 6 digit dikirim via WhatsApp ke <b className="text-ink">+62 {phone || '812-3456-7890'}</b> ·{' '}
        <span onClick={onEditNumber} className="text-brand-deep font-bold cursor-pointer">
          Ubah nomor
        </span>
      </p>

      <div className="mt-6">
        <OtpInput values={otp} onChange={onOtpChange} onComplete={onOtpComplete} error={!!error} autoFocus />
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-3.5 text-danger text-[13px] font-semibold">
          <Icon name="warning" size={15} />
          {error}
        </div>
      )}

      <div className="text-center mt-[22px]">
        {resendLeft === 0 ? (
          <button type="button" onClick={onResend} className="text-brand-deep font-extrabold text-sm">
            Kirim Ulang Kode
          </button>
        ) : (
          <div className="text-faint text-[13px] font-semibold">
            Kirim ulang dalam 00:{String(resendLeft).padStart(2, '0')}
          </div>
        )}
      </div>

      <Button variant="primary" fullWidth className="mt-[22px]" onClick={onVerify} disabled={verifying}>
        {verifying ? 'Memverifikasi…' : 'Verifikasi'}
      </Button>
      <div className="text-center text-[#B8A99B] text-[11.5px] mt-4">
        Kode demo: <b className="text-faint">123456</b>
      </div>
    </div>
  );
}

function OkStep() {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-6">
      <div className="relative w-[100px] h-[100px] flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-mint/[.16] animate-ripple" />
        <div className="w-[84px] h-[84px] rounded-[28px] bg-[linear-gradient(135deg,#34E0A8,#16C784)] flex items-center justify-center shadow-[0_16px_34px_rgba(22,199,132,.4)] animate-pop">
          <Icon name="check" size={40} className="text-white" strokeWidth={3} />
        </div>
      </div>
      <div className="font-display font-extrabold text-[23px] tracking-[-.4px]">Nomor terverifikasi!</div>
      <div className="text-faint text-sm">Sebentar, lagi nyiapin pesananmu…</div>
    </div>
  );
}
