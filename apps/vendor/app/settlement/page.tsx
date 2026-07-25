'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { Settlement } from '../../components/screens/Settlement';
import { SettlementDesktopView } from '../../components/screens/SettlementDesktopView';

export default function SettlementPage() {
  const bp = useBreakpoint();
  return bp === 'desktop' ? <SettlementDesktopView /> : <Settlement />;
}
