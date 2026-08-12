'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRequestOtp, useMe, useVerifyOtp } from '@jajanhub/api';
import { useBreakpoint } from '@jajanhub/ui';
import { AuthContext } from './AuthContext';
import { AuthSheet } from './AuthSheet';
import { AuthModal } from './AuthModal';

export type AuthStep = 'phone' | 'otp' | 'ok';
const RESEND_SECONDS = 45;
const EMPTY_OTP = ['', '', '', '', '', ''];

export interface AuthFlowProps {
  open: boolean;
  step: AuthStep;
  onClose: () => void;
  phone: string;
  onPhoneChange: (v: string) => void;
  onSendOtp: () => void;
  sendingOtp: boolean;
  otp: string[];
  onOtpChange: (next: string[]) => void;
  onOtpComplete: (code: string) => void;
  onVerify: () => void;
  verifying: boolean;
  onEditNumber: () => void;
  error: string;
  resendLeft: number;
  onResend: () => void;
}

/**
 * Owns the phone + WhatsApp-OTP login flow (API_CONTRACT.md §1: gate
 * Profil/Pesanan Aktif/Langganan/Bayar, guest browsing stays open) and
 * renders a single global sheet (mobile) or modal (desktop) — same "hook
 * owns logic, view renders it" split as usePaymentScreen/useQueueScreen.
 * `useMe()` (React Query, backed by the mock's `authStore`/persisted
 * `Customer`) is the sole source of truth for `isLoggedIn`, so there's no
 * second, possibly-divergent client store.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const bp = useBreakpoint();
  const { data: customer, isLoading: isSessionLoading } = useMe();
  const isLoggedIn = !!customer;

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(EMPTY_OTP);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const resolveRef = useRef<(() => void) | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const resendTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopResendTimer = () => {
    if (resendTimer.current) {
      clearInterval(resendTimer.current);
      resendTimer.current = null;
    }
  };
  const startResendTimer = () => {
    stopResendTimer();
    setResendLeft(RESEND_SECONDS);
    resendTimer.current = setInterval(() => {
      setResendLeft((left) => {
        if (left <= 1) {
          stopResendTimer();
          return 0;
        }
        return left - 1;
      });
    }, 1000);
  };

  useEffect(() => stopResendTimer, []);

  const reset = () => {
    setStep('phone');
    setPhone('');
    setOtp(EMPTY_OTP);
    setError('');
    setAttempts(3);
    stopResendTimer();
  };

  const requireAuth = useCallback(
    (onSuccess: () => void, onCancel?: () => void) => {
      if (isLoggedIn) {
        onSuccess();
        return;
      }
      reset();
      resolveRef.current = onSuccess;
      cancelRef.current = onCancel ?? null;
      setOpen(true);
    },
    [isLoggedIn],
  );

  const close = () => {
    setOpen(false);
    cancelRef.current?.();
    resolveRef.current = null;
    cancelRef.current = null;
  };

  const handleSendOtp = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 9) {
      setError('Nomornya kurang lengkap nih, coba cek lagi');
      return;
    }
    setError('');
    requestOtp.mutate(phone, {
      onSuccess: () => {
        setOtp(EMPTY_OTP);
        setStep('otp');
        startResendTimer();
      },
    });
  };

  const verify = useCallback(
    (code: string) => {
      if (code.length < 6 || verifyOtp.isPending) return;
      verifyOtp.mutate(
        { phone, code },
        {
          onSuccess: () => {
            stopResendTimer();
            setStep('ok');
            setTimeout(() => {
              resolveRef.current?.();
              resolveRef.current = null;
              cancelRef.current = null;
              setOpen(false);
            }, 900);
          },
          onError: () => {
            const next = attempts - 1;
            if (next <= 0) {
              setError('Percobaan habis. Coba kirim ulang kodenya ya.');
              setAttempts(3);
            } else {
              setError(`Kode belum cocok. Sisa ${next} percobaan.`);
              setAttempts(next);
            }
            setOtp(EMPTY_OTP);
          },
        },
      );
    },
    [attempts, phone, verifyOtp],
  );

  const handleResend = () => {
    if (resendLeft > 0) return;
    setOtp(EMPTY_OTP);
    setError('');
    startResendTimer();
  };

  const flow: AuthFlowProps = {
    open,
    step,
    onClose: close,
    phone,
    onPhoneChange: (v) => setPhone(v.replace(/[^0-9-]/g, '')),
    onSendOtp: handleSendOtp,
    sendingOtp: requestOtp.isPending,
    otp,
    onOtpChange: setOtp,
    onOtpComplete: verify,
    onVerify: () => verify(otp.join('')),
    verifying: verifyOtp.isPending,
    onEditNumber: () => {
      stopResendTimer();
      setStep('phone');
      setError('');
      setOtp(EMPTY_OTP);
    },
    error,
    resendLeft,
    onResend: handleResend,
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isSessionLoading, requireAuth }}>
      {children}
      {bp === 'desktop' ? <AuthModal {...flow} /> : <AuthSheet {...flow} />}
    </AuthContext.Provider>
  );
}
