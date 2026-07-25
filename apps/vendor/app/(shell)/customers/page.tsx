'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { Customers } from '../../../components/screens/Customers';
import { CustomersDesktopView } from '../../../components/screens/CustomersDesktopView';

export default function CustomersPage() {
  const bp = useBreakpoint();
  return bp === 'desktop' ? <CustomersDesktopView /> : <Customers />;
}
