import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

/** Collects a JSON request body; non-POST requests have none. */
function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    if (req.method !== "POST") return resolve(undefined);

    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : undefined);
      } catch {
        resolve(undefined);
      }
    });
  });
}

/**
 * Mirrors Vercel's `req.query`: repeated parameters collapse to an array, a
 * single one stays a string. Without this the handlers that read query
 * parameters work in production and throw in dev.
 */
function readQuery(url: string | undefined): Record<string, string | string[]> {
  const params = new URL(url ?? "/", "http://localhost").searchParams;
  const query: Record<string, string | string[]> = {};

  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    query[key] = values.length > 1 ? values : values[0];
  }

  return query;
}

type ResponseShim = ServerResponse & {
  status(code: number): ResponseShim;
  send(payload: string): ResponseShim;
  json(payload: unknown): ResponseShim;
};

/**
 * `vite` only serves the SPA, so the handlers in `api/` are dead in local dev
 * unless you run `vercel dev`. This mounts them on the dev server with just
 * enough of the Vercel req/res shape for what they use, and mirrors the
 * /ctf/hands-on-practice/* rewrites that vercel.json applies in production.
 */
function ctfApiDev(): Plugin {
  const routes: Record<string, string> = {
    "/api/ctfValidator": "/api/ctfValidator.ts",
    "/api/adminPortal": "/api/adminPortal.ts",
    "/api/diskImage": "/api/diskImage.ts",
    "/api/sqlPortal": "/api/sqlPortal.ts",
    "/api/osintProfiles": "/api/osintProfiles.ts",
    "/api/triageAssistant": "/api/triageAssistant.ts",
    "/api/cloudBucket": "/api/cloudBucket.ts",
    "/api/smartLock": "/api/smartLock.ts",
    "/api/lockDatasheet": "/api/lockDatasheet.ts",
    "/ctf/hands-on-practice/admin": "/api/adminPortal.ts",
    "/ctf/hands-on-practice/image": "/api/diskImage.ts",
    "/ctf/hands-on-practice/login": "/api/sqlPortal.ts",
    "/ctf/hands-on-practice/social": "/api/osintProfiles.ts",
    "/ctf/hands-on-practice/triage": "/api/triageAssistant.ts",
    "/ctf/hands-on-practice/bucket": "/api/cloudBucket.ts",
    "/ctf/hands-on-practice/lock": "/api/smartLock.ts",
    "/ctf/hands-on-practice/lock-datasheet": "/api/lockDatasheet.ts",
  };

  return {
    name: "nusec-ctf-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const modulePath = routes[(req.url ?? "").split("?")[0]];
        if (!modulePath) return next();

        try {
          const { default: handler } = await server.ssrLoadModule(modulePath);

          const shim = res as ResponseShim;
          shim.status = (code) => {
            res.statusCode = code;
            return shim;
          };
          shim.send = (payload) => {
            res.end(payload);
            return shim;
          };
          shim.json = (payload) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(payload));
            return shim;
          };

          const body = await readJsonBody(req);
          const query = readQuery(req.url);
          await handler(Object.assign(req, { body, query }), shim);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig({
  base: "/",
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [react(), ctfApiDev()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
