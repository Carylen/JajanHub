/**
 * OTP WhatsApp auth (API_CONTRACT.md §1). No screen in `apps/customer` calls
 * these yet — there is no login/OTP UI in the product today — so this module
 * only adds the capability to `packages/api` (types + client methods + mock +
 * http). Wiring an actual phone-entry/verify-code flow into the app is a
 * separate, larger feature and is intentionally out of scope here.
 */

export interface Customer {
  id: string;
  phone: string;
  phoneMasked: string;
  createdAt: string;
  isNewCustomer: boolean;
}

export interface RequestOtpResult {
  expiresInSec: number;
  resendAvailableInSec: number;
}

export interface AuthClient {
  requestOtp(phone: string): Promise<RequestOtpResult>;
  verifyOtp(phone: string, code: string): Promise<Customer>;
  getMe(): Promise<Customer>;
  logout(): Promise<void>;
}
