'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { Subscription } from '../../components/customer/Subscription';
import { PriorityDesktopView } from '../../components/customer/PriorityDesktopView';

export default function SubscribePage() {
  const bp = useBreakpoint();
  return bp === 'desktop' ? <PriorityDesktopView /> : <Subscription />;
}
