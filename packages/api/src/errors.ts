/**
 * Structured errors matching API_CONTRACT.md §0/§14's error envelope
 * (`{ error: { code, message, details } }`). `mockClient.ts` throws these
 * instead of plain `Error(...)` so UI error handling can branch on `code`
 * the same way it eventually will against the real backend; `httpClient.ts`
 * parses the same envelope out of non-2xx responses into this class.
 */

/** Every error code API_CONTRACT.md §14 documents, plus the ones §1/§4 mention inline. */
export type ApiErrorCode =
  | 'INVALID_PHONE'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'OTP_RATE_LIMITED'
  | 'TOO_MANY_ATTEMPTS'
  | 'UNAUTHENTICATED'
  | 'VENDOR_CLOSED'
  | 'ITEM_UNAVAILABLE'
  | 'ACTIVE_CART_CONFLICT'
  | 'CANCEL_NOT_ALLOWED'
  | 'CANCEL_LIMIT_REACHED'
  | 'ADDON_LIMIT_REACHED'
  | 'ORDER_NOT_ADDABLE'
  | 'CODE_MISMATCH'
  | 'ORDER_NOT_FOUND'
  /** Not a contract code — local fallback for a response that didn't match the documented error envelope at all. */
  | 'UNKNOWN';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly details: Record<string, unknown>;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, opts?: { details?: Record<string, unknown>; status?: number }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = opts?.details ?? {};
    this.status = opts?.status ?? STATUS_BY_CODE[code];
  }
}

/** HTTP status semantics per API_CONTRACT.md §0/§14. */
const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  INVALID_PHONE: 400,
  OTP_INVALID: 400,
  OTP_EXPIRED: 410,
  OTP_RATE_LIMITED: 429,
  TOO_MANY_ATTEMPTS: 429,
  UNAUTHENTICATED: 401,
  VENDOR_CLOSED: 409,
  ITEM_UNAVAILABLE: 409,
  ACTIVE_CART_CONFLICT: 409,
  CANCEL_NOT_ALLOWED: 409,
  CANCEL_LIMIT_REACHED: 429,
  ADDON_LIMIT_REACHED: 409,
  ORDER_NOT_ADDABLE: 409,
  CODE_MISMATCH: 400,
  ORDER_NOT_FOUND: 404,
  UNKNOWN: 500,
};

/** Parses `{ error: { code, message, details } }` from a failed fetch response body. Falls back to a generic error if the body isn't the expected shape (e.g. a non-Elysia 500). */
export function parseApiErrorBody(body: unknown, status: number): ApiError {
  if (body && typeof body === 'object' && 'error' in body) {
    const err = (body as { error?: unknown }).error;
    if (err && typeof err === 'object' && 'code' in err && 'message' in err) {
      const e = err as { code: string; message: string; details?: Record<string, unknown> };
      return new ApiError(e.code as ApiErrorCode, e.message, { details: e.details, status });
    }
  }
  return new ApiError('ORDER_NOT_FOUND', 'Terjadi kesalahan tak terduga', { status });
}
