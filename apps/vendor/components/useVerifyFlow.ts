'use client';
import { useState } from 'react';
import { useVerifyPickupCode, type PickupRecord } from '@jajanhub/api';

export type VerifyResult = { status: 'ok'; record: PickupRecord } | { status: 'fail'; tried: string } | null;

export const VERIFY_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'qr', '0', 'del'] as const;

export interface VerifyFlowView {
  code: string;
  result: VerifyResult;
  shake: number;
  press: (key: (typeof VERIFY_KEYS)[number]) => void;
  runVerify: (value: string) => void;
  reset: () => void;
  pending: boolean;
}

/**
 * Pickup-code verification state machine, shared by the mobile BottomSheet
 * and desktop Modal shells (previously duplicated logic inside
 * VerifyCodeSheet only — extracted so both consume one source).
 */
export function useVerifyFlow(): VerifyFlowView {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<VerifyResult>(null);
  const [shake, setShake] = useState(0);
  const verify = useVerifyPickupCode();

  const reset = () => {
    setCode('');
    setResult(null);
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

  const press = (key: (typeof VERIFY_KEYS)[number]) => {
    if (key === 'del') return setCode((c) => c.slice(0, -1));
    if (key === 'qr') return runVerify('6042');
    setCode((c) => (c.length >= 4 ? c : c + key));
  };

  return { code, result, shake, press, runVerify, reset, pending: verify.isPending };
}
