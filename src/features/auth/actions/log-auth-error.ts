import "server-only";

interface LoggableAuthError {
  readonly name?: string;
  readonly code?: string;
  readonly status?: number;
}

/**
 * Technical details stay in the server log (.cursorrules §8): the user only sees a generic
 * message. Only the error name, code and HTTP status are written, never the email address
 * or the code the user typed.
 */
export function logAuthError(action: string, error: LoggableAuthError): void {
  console.error(`[auth] ${action} failed`, {
    name: error.name,
    code: error.code,
    status: error.status,
  });
}
