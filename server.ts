import "dotenv/config";
import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parser
  app.use(express.json());

  // Credentials and Security
  // Loaded securely from environment variables, with strict secure fallback defaults
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@zstore.com").toLowerCase().trim();
  const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ZStore#Sec982!Admin_Xk7";

  // In-memory active session token store (token -> { email, role, name, expiresAt })
  interface AdminSession {
    email: string;
    role: "admin";
    name: string;
    createdAt: number;
    expiresAt: number;
  }
  const activeSessions = new Map<string, AdminSession>();

  // Clean up expired sessions periodically (every 10 minutes)
  setInterval(() => {
    const now = Date.now();
    for (const [token, session] of activeSessions.entries()) {
      if (session.expiresAt <= now) {
        activeSessions.delete(token);
      }
    }
  }, 10 * 60 * 1000);

  // Helper to extract bearer token
  function extractToken(req: express.Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7).trim();
    }
    const queryToken = req.query.token as string | undefined;
    if (queryToken) return queryToken;
    return null;
  }

  // API 1: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API 2: Admin Login
  app.post("/api/admin/login", (req, res) => {
    const { identifier, password } = req.body || {};

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: "Both administrator identifier (email/username) and password are required."
      });
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const cleanPassword = String(password);

    // Verify identifier (email or username)
    const isIdentifierValid =
      cleanIdentifier === ADMIN_EMAIL || cleanIdentifier === ADMIN_USERNAME;

    // Constant-time timing-safe comparison on SHA-256 hashes to prevent timing attacks
    const providedHash = crypto.createHash("sha256").update(cleanPassword).digest();
    const expectedHash = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest();
    const isPasswordValid = crypto.timingSafeEqual(providedHash, expectedHash);

    if (!isIdentifierValid || !isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid administrator credentials. Access denied."
      });
    }

    // Generate secure cryptographically random token
    const token = crypto.randomBytes(32).toString("hex");
    const sessionDurationMs = 8 * 60 * 60 * 1000; // 8 hours
    const expiresAt = Date.now() + sessionDurationMs;

    activeSessions.set(token, {
      email: ADMIN_EMAIL,
      role: "admin",
      name: "ZStore Executive Administrator",
      createdAt: Date.now(),
      expiresAt
    });

    return res.json({
      success: true,
      token,
      expiresAt,
      admin: {
        name: "ZStore Executive Administrator",
        email: ADMIN_EMAIL,
        role: "admin"
      }
    });
  });

  // API 3: Verify Admin Session
  app.get("/api/admin/verify", (req, res) => {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({
        authenticated: false,
        error: "Missing authorization token."
      });
    }

    const session = activeSessions.get(token);
    if (!session || session.expiresAt <= Date.now()) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({
        authenticated: false,
        error: "Session expired or invalid. Please re-authenticate."
      });
    }

    return res.json({
      authenticated: true,
      admin: {
        name: session.name,
        email: session.email,
        role: session.role
      },
      expiresAt: session.expiresAt
    });
  });

  // API 4: Admin Logout / Invalidate Session
  app.post("/api/admin/logout", (req, res) => {
    const token = extractToken(req);
    if (token) {
      activeSessions.delete(token);
    }
    return res.json({
      success: true,
      message: "Admin session invalidated successfully."
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
