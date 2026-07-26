'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { Profile } from '../../components/customer/Profile';
import { ProfileDesktopView } from '../../components/customer/ProfileDesktopView';

export default function ProfilePage() {
  const bp = useBreakpoint();
  return bp === 'desktop' ? <ProfileDesktopView /> : <Profile />;
}
