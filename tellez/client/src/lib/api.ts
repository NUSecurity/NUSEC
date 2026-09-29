import type {
  ApprovalRequest, BoardView, ChallengeAnswer, ChallengeResult, ChallengeView, DirListing,
  LoginResult, NodeContent, NodeSummary, SessionView,
} from "#shared/protocol";

/**
 * Every call the client can make.
 *
 * A 403 is a normal outcome here, not an exception to be avoided — it is how
 * the machine says "access is denied", and the UI shows that in world.
 */
export class ApiError extends Error {
  constructor(readonly status: number, readonly code: string, message?: string) {
    super(message ?? code);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new ApiError(response.status, payload.error ?? "error", payload.detail);
  }

  return payload as T;
}

const post = <T>(url: string, body: unknown) =>
  request<T>(url, { method: "POST", body: JSON.stringify(body) });

export interface ReadResult {
  summary: NodeSummary;
  content: NodeContent;
  opensWith: string;
}

export interface PageResult {
  host: string;
  path: string;
  /** The route pattern that matched, e.g. "/member/:slug". */
  route: string;
  title: string;
  data: unknown;
  needsAuth: boolean;
  /** Present while a challenge stands between the session and this route. */
  challenge?: ChallengeView;
}

export const api = {
  join: (displayName: string) => post<SessionView>("/api/session", { displayName }),

  me: () => request<SessionView>("/api/session"),

  signOut: () => request<{ ok: boolean }>("/api/session", { method: "DELETE" }),

  login: (username: string, password: string) =>
    post<LoginResult>("/api/login", { username, password }),

  list: (path: string, showHidden = false) =>
    request<DirListing>(
      `/api/fs/list?path=${encodeURIComponent(path)}${showHidden ? "&hidden=1" : ""}`,
    ),

  read: (path: string) => request<ReadResult>(`/api/fs/read?path=${encodeURIComponent(path)}`),

  page: (host: string, path: string) =>
    request<PageResult>(
      `/api/web/fetch?host=${encodeURIComponent(host)}&path=${encodeURIComponent(path)}`,
    ),

  siteAuth: (host: string, username: string, password: string) =>
    post<{ ok: boolean; message?: string }>("/api/web/auth", { host, username, password }),

  answerChallenge: (answer: ChallengeAnswer) => post<ChallengeResult>("/api/web/challenge", answer),

  approvals: (app: string) =>
    request<{ requests: ApprovalRequest[] }>(`/api/web/challenge?app=${encodeURIComponent(app)}`),

  board: (key: string) => request<BoardView & { storage: string }>(`/api/board?key=${encodeURIComponent(key)}`),
};
