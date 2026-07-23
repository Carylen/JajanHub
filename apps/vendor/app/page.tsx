import { redirect } from 'next/navigation';

/** Vendor app opens on the orders board (BRIEF §4). */
export default function VendorHome() {
  redirect('/orders');
}
