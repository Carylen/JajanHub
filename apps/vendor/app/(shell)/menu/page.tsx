'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { Menu } from '../../../components/screens/Menu';
import { MenuDesktopView } from '../../../components/screens/MenuDesktopView';

export default function MenuPage() {
  const bp = useBreakpoint();
  return bp === 'desktop' ? <MenuDesktopView /> : <Menu />;
}
