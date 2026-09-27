import react from "@vitejs/plugin-react-swc";
import { readdirSync, statSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join, relative, resolve } from "node:path";
import { defineConfig, loadEnv, type Plugin } from "vite";

/**
 * Mounts `api/**.ts` on the dev server.
 *
 * Without this the handlers are dead locally unless you run `vercel dev`,
 * which needs a Vercel login — a real barrier for a contributor who just
 * cloned the repo. This walks the directory the same way Vercel's router does,
 * so `/api/fs/read` finds `api/fs/read.ts`, and gives the handler just enough
 * of the req/res shape for what it uses.
 */
function apiDev(): Plugin {
  const root = resolve("api");

  function routes(): Map<string, string> {
    const found = new Map<string, string>();

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          walk(full);
        } else if (entry.endsWith(".ts")) {
          const route = `/api/${relative(root, full).replace(/\.ts$/, "")}`;
          found.set(route.split("\\").join("/"), `/api/${relative(root, full)}`);
        }
      }
    };

    walk(root);
    return found;
  }

  return {
    name: "tellez-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/")) return next();

        const modulePath = routes().get(url.split("?")[0]);
        if (!modulePath) return next();

        try {
          const { default: handler } = await server.ssrLoadModule(modulePath);
          await handler(await shimRequest(req), shimResponse(res));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

async function shimRequest(req: IncomingMessage) {
  const params = new URL(req.url ?? "/", "http://localhost").searchParams;
  const query: Record<string, string | string[]> = {};

  for (const key of new Set(params.keys())) {
    const values = params.getAll(key);
    query[key] = values.length > 1 ? values : values[0];
  }

  const body = await new Promise<unknown>((done) => {
    if (req.method !== "POST" && req.method !== "PUT") return done(undefined);

    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      try {
        done(raw ? JSON.parse(raw) : undefined);
      } catch {
        done(undefined);
      }
    });
  });

  return Object.assign(req, { body, query });
}

function shimResponse(res: ServerResponse) {
  const shim = res as ServerResponse & {
    status(code: number): typeof shim;
    json(payload: unknown): typeof shim;
    send(payload: string | Buffer): typeof shim;
  };

  shim.status = (code) => {
    res.statusCode = code;
    return shim;
  };
  shim.json = (payload) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
    return shim;
  };
  shim.send = (payload) => {
    res.end(payload);
    return shim;
  };

  return shim;
}

export default defineConfig(({ mode }) => {
  // Handlers read secrets from process.env the way they will on Vercel. Vite
  // only exposes VITE_-prefixed vars to the client, so the whole .env goes
  // into the dev server's own process instead. None of it reaches the bundle.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), apiDev()],
    server: { host: "::", port: 4311 },
    resolve: {
      alias: {
        "@": resolve(__dirname, "client/src"),
        "#shared": resolve(__dirname, "shared"),
      },
    },
    build: { outDir: "dist" },
  };
});
