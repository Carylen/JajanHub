'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { Analytics } from '../../../components/screens/Analytics';
import { AnalyticsDesktopView } from '../../../components/screens/AnalyticsDesktopView';

export default function AnalyticsPage() {
  const bp = useBreakpoint();
  return bp === 'desktop' ? <AnalyticsDesktopView /> : <Analytics />;
}
