/**
 * The minimal request/response shape the handlers use.
 *
 * Vercel's `VercelRequest`/`VercelResponse` satisfy this structurally, and so
 * does the shim the Vite dev plugin builds — so one handler runs unmodified in
 * both places, and local development needs no `vercel dev` and no extra login.
 */

export interface ApiRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  query: Record<string, string | string[] | undefined>;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(data: unknown): unknown;
  send(data: string | Buffer): unknown;
  setHeader(name: string, value: string | string[]): unknown;
  end(): unknown;
}

export type Handler = (req: ApiRequest, res: ApiResponse) => Promise<unknown> | unknown;

/** First value of a query parameter, ignoring repeats. */
export function param(req: ApiRequest, name: string): string | undefined {
  const value = req.query[name];
  if (Array.isArray(value)) return value[0];
  return value;
}

export function bodyOf<T>(req: ApiRequest): Partial<T> {
  return (req.body ?? {}) as Partial<T>;
}

export function fail(res: ApiResponse, code: number, error: string, detail?: string): void {
  res.status(code).json(detail ? { error, detail } : { error });
}

/** Guards a handler to one method, answering 405 otherwise. */
export function methodIs(req: ApiRequest, res: ApiResponse, method: string): boolean {
  if ((req.method ?? "GET").toUpperCase() === method) return true;
  fail(res, 405, "method_not_allowed", `expected ${method}`);
  return false;
}

export function header(req: ApiRequest, name: string): string | undefined {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}
