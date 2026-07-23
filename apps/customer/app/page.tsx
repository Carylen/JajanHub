import { redirect } from 'next/navigation';
import { DEFAULT_MERCHANT_ID } from '@jajanhub/api';

/** Root simply drops into the default merchant (a QR would deep-link here). */
export default function HomePage() {
  redirect(`/m/${DEFAULT_MERCHANT_ID}`);
}
