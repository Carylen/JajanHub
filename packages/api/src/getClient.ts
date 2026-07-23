/**
 * Resolves the active client implementation from env. A single module-level
 * instance is shared so mock timers/order state stay consistent app-wide.
 */
import type { JajanhubClient } from './client';
import { resolveApiMode, resolveApiUrl } from './config';
import { createHttpClient } from './http/httpClient';
import { createMockClient } from './mock/mockClient';

let client: JajanhubClient | null = null;

export function getClient(): JajanhubClient {
  if (client) return client;
  client = resolveApiMode() === 'http' ? createHttpClient(resolveApiUrl()) : createMockClient();
  return client;
}
