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

type ResponseShim = ServerResponse & {
  status(code: number): ResponseShim;
  send(payload: string): ResponseShim;
  json(payload: unknown): ResponseShim;
};

/**
 * `vite` only serves the SPA, so the handlers in `api/` are dead in local dev
 * unless you run `vercel dev`. This mounts them on the dev server with just
 * enough of the Vercel req/res shape for what they use, and mirrors the
 * /ctf/mini-ctf/admin rewrite that vercel.json applies in production.
 */
function ctfApiDev(): Plugin {
  const routes: Record<string, string> = {
    "/api/ctfValidator": "/api/ctfValidator.ts",
    "/api/adminPortal": "/api/adminPortal.ts",
    "/ctf/mini-ctf/admin": "/api/adminPortal.ts",
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
          await handler(Object.assign(req, { body }), shim);
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
