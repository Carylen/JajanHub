import { redirect } from 'next/navigation';

/** Folded into Beranda (`/`) — kept as a redirect for old links/bookmarks. */
export default function NearPage() {
  redirect('/');
}
