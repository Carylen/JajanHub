import type { Metadata } from 'next';
import { getClient } from '@jajanhub/api';
import { DiscoveryScreen } from '../components/customer/DiscoveryScreen';

export const metadata: Metadata = {
  title: 'Beranda · JajanHub',
  description: 'Temukan gerobak kaki lima yang buka di sekitarmu, lengkap dengan antrean live.',
};

/**
 * Beranda (home) — multi-vendor marketplace, server-rendered for SEO: the
 * initial stall list is fetched through the API layer on the server, then
 * handed to the client `DiscoveryScreen`, which picks mobile/desktop chrome
 * via `useBreakpoint()`. Used to redirect straight into the single seeded
 * merchant; a vendor's own QR code is now the deep-link into `/m/[id]`.
 */
export default async function HomePage() {
  const stalls = await getClient().getStalls();
  return <DiscoveryScreen stalls={stalls} />;
}
