import type { Metadata } from 'next';
import { getClient } from '@jajanhub/api';
import { DiscoveryScreen } from '../../components/customer/DiscoveryScreen';

export const metadata: Metadata = {
  title: 'Sekitar Sini · JajanHub',
  description: 'Temukan gerobak kaki lima yang buka di sekitarmu, lengkap dengan antrean live.',
};

/**
 * Discovery is server-rendered for SEO (BRIEF §4/M3): initial stall list is
 * fetched through the API layer on the server, then handed to the client
 * `DiscoveryScreen`, which picks mobile/desktop chrome via `useBreakpoint()`.
 */
export default async function NearPage() {
  const stalls = await getClient().getStalls();
  return <DiscoveryScreen stalls={stalls} />;
}
