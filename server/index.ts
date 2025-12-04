import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  let port = parseInt(process.env.PORT || '3000', 10);

  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  const isLinux = process.platform === 'linux';

  log(`Detected OS: ${process.platform} (Windows: ${isWindows}, Mac: ${isMac}, Linux: ${isLinux})`);

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
    log("NODE_ENV not set, defaulting to 'development'");
  }

  const host = 'localhost';

  // Try to bind to the requested port; if it's in use, try subsequent ports.
  async function tryListen(startPort: number, attempts = 6) {
    let p = startPort;
    for (let i = 0; i < attempts; i++) {
      try {
        await new Promise<void>((resolve, reject) => {
          const onError = (err: any) => {
            server.removeListener('listening', onListening);
            reject(err);
          };

          const onListening = () => {
            server.removeListener('error', onError);
            resolve();
          };

          server.once('error', onError);
          server.once('listening', onListening);

          server.listen({ port: p, host });
        });

        // success
        log(`Server running at: http://${host}:${p}`);
        port = p;
        return;
      } catch (err: any) {
        // if address in use, try next port
        if (err && err.code === 'EADDRINUSE') {
          log(`port ${p} in use, trying ${p + 1}`);
          p++;
          // continue loop
        } else {
          // unknown error - rethrow
          throw err;
        }
      }
    }
    throw new Error("Unable to bind to any port");
  }

  try {
    await tryListen(port, 12);
  } catch (err: any) {
    log(`Failed to start server: ${err?.message || err}`);
    process.exit(1);
  }
})();
