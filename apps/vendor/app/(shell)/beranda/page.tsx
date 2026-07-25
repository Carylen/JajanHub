'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { useHomeScreen } from '../../../components/screens/useHomeScreen';
import { HomeMobileView } from '../../../components/screens/HomeMobileView';
import { HomeDesktopView } from '../../../components/screens/HomeDesktopView';

export default function BerandaPage() {
  const vm = useHomeScreen();
  const bp = useBreakpoint();
  return bp === 'desktop' ? <HomeDesktopView {...vm} /> : <HomeMobileView {...vm} />;
}
