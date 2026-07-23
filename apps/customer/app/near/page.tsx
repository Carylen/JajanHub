import type { Metadata } from 'next';
import { getClient } from '@jajanhub/api';
import { Discovery } from '../../components/customer/Discovery';

export const metadata: Metadata = {
  title: 'Sekitar Sini · JajanHub',
  description: 'Temukan gerobak kaki lima yang buka di sekitarmu, lengkap dengan antrean live.',
};

/**
 * Discovery is server-rendered for SEO (BRIEF §4/M3): initial stall list is
 * fetched through the API layer on the server, then hydrated for interaction.
 */
export default async function NearPage() {
  const stalls = await getClient().getStalls();
  return <Discovery stalls={stalls} />;
}
