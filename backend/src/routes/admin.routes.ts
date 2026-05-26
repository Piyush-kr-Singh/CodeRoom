import { createHash, timingSafeEqual } from "node:crypto";
import { Router, urlencoded, type NextFunction, type Request, type Response } from "express";

import { env } from "../config/env.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { adminAccessLimiter } from "../middleware/rate-limit.js";
import type {
  AdminDashboardReader,
  AdminDashboardSnapshot,
  AdminMessageSnapshot,
  AdminRoomSnapshot
} from "../services/admin.service.js";

const ADMIN_REALM = "CodeSyncUp Secure Console";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateLabel(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
    timeZone: "Asia/Kolkata"
  });
}

function hashCredential(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function safeEqual(left: string, right: string) {
  return timingSafeEqual(hashCredential(left), hashCredential(right));
}

function parseBasicCredentials(authorizationHeader: string | undefined) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (!scheme || !token || scheme.toLowerCase() !== "basic") {
    return null;
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1)
    };
  } catch {
    return null;
  }
}

function setAdminSecurityHeaders(response: Response) {
  response.set({
    "Cache-Control": "no-store, max-age=0",
    Pragma: "no-cache",
    Expires: "0",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy":
      "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; form-action 'self'; frame-ancestors 'none';"
  });
}

function renderShell(title: string, eyebrow: string, description: string, body: string, isLogin = false) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,nofollow,noarchive" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: dark;
        --background: #071018;
        --surface: rgba(8, 20, 31, 0.9);
        --surface-strong: rgba(10, 24, 38, 0.98);
        --line: rgba(148, 180, 206, 0.18);
        --text: #e5eef8;
        --muted: #8da2ba;
        --accent: #5dddc8;
        --warning: #ffb36b;
        --danger: #ff8a78;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at 18% 15%, rgba(93, 221, 200, 0.18), transparent 24%),
          radial-gradient(circle at 82% 12%, rgba(255, 179, 107, 0.14), transparent 20%),
          radial-gradient(circle at 50% 100%, rgba(141, 162, 186, 0.12), transparent 28%),
          var(--background);
        color: var(--text);
        font-family: "Segoe UI", sans-serif;
      }

      main {
        margin: 0 auto;
        max-width: 1180px;
        padding: 40px 20px 72px;
      }

      .login-layout .hero {
        padding: 16px 20px;
        margin-bottom: 16px;
        border-radius: 20px;
      }

      .login-layout h1 {
        font-size: 1.8rem;
      }

      .login-layout .hero-copy {
        margin-top: 6px;
        font-size: 0.9rem;
      }

      .login-layout .login-section {
        margin: 20px auto 0;
      }

      .hero {
        margin-bottom: 18px;
        border: 1px solid var(--line);
        border-radius: 24px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        backdrop-filter: blur(18px);
        padding: 20px 24px;
      }

      .hero-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .btn-home {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.04);
        padding: 8px 16px;
        color: var(--text);
        font-size: 0.84rem;
        font-weight: 600;
        text-decoration: none;
        transition: background-color 0.2s, border-color 0.2s;
        white-space: nowrap;
      }

      .btn-home:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--accent);
      }

      .eyebrow {
        margin: 0 0 8px;
        color: var(--accent);
        font-family: "Consolas", monospace;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.24em;
        text-transform: uppercase;
      }

      h1, h2, h3, p {
        margin: 0;
      }

      h1 {
        font-size: clamp(1.8rem, 4vw, 2.4rem);
        line-height: 1.1;
      }

      .hero-copy {
        margin-top: 10px;
        max-width: 760px;
        color: var(--muted);
        font-size: 0.92rem;
        line-height: 1.6;
      }

      .notice {
        margin-top: 14px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        border: 1px solid rgba(255, 179, 107, 0.22);
        border-radius: 999px;
        background: rgba(255, 179, 107, 0.08);
        padding: 8px 12px;
        color: #ffd7aa;
        font-size: 0.88rem;
      }

      @media (max-width: 520px) {
        .hero-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin: 22px 0 28px;
      }

      .stat-card,
      .section,
      .card,
      .empty-state {
        border: 1px solid var(--line);
        background: var(--surface);
        backdrop-filter: blur(18px);
      }

      .stat-card {
        border-radius: 22px;
        padding: 18px 20px;
      }

      .stat-label {
        color: var(--muted);
        font-size: 0.86rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }

      .stat-value {
        margin-top: 10px;
        font-size: 2rem;
        font-weight: 700;
      }

      .section {
        border-radius: 28px;
        margin-top: 22px;
        padding: 24px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 18px;
      }

      .section-copy {
        margin-top: 8px;
        color: var(--muted);
        line-height: 1.6;
      }

      .section-tag {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 8px 12px;
        color: var(--muted);
        font-family: "Consolas", monospace;
        font-size: 0.84rem;
        white-space: nowrap;
      }

      .grid {
        display: grid;
        gap: 16px;
      }

      .rooms-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 16px;
      }

      .card {
        border-radius: 16px;
        padding: 14px 16px;
        font-size: 0.85rem;
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        border-bottom: 1px solid var(--line);
        padding-bottom: 8px;
        margin-bottom: 10px;
      }

      .meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 12px;
        font-size: 0.82rem;
      }

      .meta-list {
        display: grid;
        gap: 8px;
      }

      .meta-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .meta-label {
        color: var(--muted);
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .meta-value {
        line-height: 1.4;
        word-break: break-all;
        color: var(--text);
      }

      .mono {
        font-family: "Consolas", "SFMono-Regular", monospace;
      }

      .badge-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }

      .badge {
        border-radius: 999px;
        padding: 6px 10px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .badge-public {
        background: rgba(93, 221, 200, 0.14);
        color: #9cf0e2;
      }

      .badge-private {
        background: rgba(255, 138, 120, 0.14);
        color: #ffb6aa;
      }

      .badge-neutral {
        background: rgba(255, 255, 255, 0.06);
        color: #dbe7f4;
      }

      details {
        margin-top: 18px;
        border-top: 1px solid var(--line);
        padding-top: 16px;
      }

      summary {
        cursor: pointer;
        font-weight: 600;
      }

      pre {
        overflow-x: auto;
        margin: 14px 0 0;
        border: 1px solid rgba(148, 180, 206, 0.16);
        border-radius: 16px;
        background: var(--surface-strong);
        padding: 14px;
        color: #d6e7fb;
        font-size: 0.88rem;
        line-height: 1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .empty-state {
        border-radius: 22px;
        padding: 20px;
        color: var(--muted);
      }

      .login-section {
        max-width: 480px;
        margin: 40px auto 0;
        border-radius: 24px;
      }

      .login-form {
        display: grid;
        gap: 20px;
      }

      .input-group {
        display: grid;
        gap: 8px;
      }

      .input-group label {
        color: var(--muted);
        font-size: 0.88rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .input-group input {
        border: 1px solid var(--line);
        border-radius: 12px;
        background: var(--surface-strong);
        padding: 12px 16px;
        color: var(--text);
        font-family: inherit;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s;
      }

      .input-group input:focus {
        border-color: var(--accent);
      }

      .error-banner {
        border: 1px solid rgba(255, 138, 120, 0.3);
        border-radius: 12px;
        background: rgba(255, 138, 120, 0.1);
        padding: 12px 16px;
        color: var(--danger);
        font-size: 0.92rem;
        font-weight: 500;
      }

      .btn-submit {
        border: none;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--accent), #7be4da);
        padding: 14px 24px;
        color: #05232a;
        font-family: inherit;
        font-size: 0.94rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .btn-submit:hover {
        opacity: 0.9;
      }

      @media (max-width: 720px) {
        main {
          padding: 24px 14px 56px;
        }

        .hero,
        .section {
          padding: 18px;
          border-radius: 22px;
        }

        .section-header,
        .card-top {
          flex-direction: column;
        }
      }
    </style>
  </head>
  <body>
    <main class="${isLogin ? 'login-layout' : ''}">
      <section class="hero">
        <div class="hero-header">
          <div>
            <p class="eyebrow">${escapeHtml(eyebrow)}</p>
            <h1>${escapeHtml(title)}</h1>
          </div>
          <a href="/" class="btn-home">Go to Home</a>
        </div>
        <p class="hero-copy">${escapeHtml(description)}</p>
        ${!isLogin ? `<p class="notice">Read-only surface. Credentials are required for access, and no database writes are exposed here.</p>` : ''}
      </section>
      ${body}
    </main>
  </body>
</html>`;
}

function renderLoginForm(error?: string) {
  const errorAlert = error
    ? `<div class="error-banner">${escapeHtml(error)}</div>`
    : "";

  return renderShell(
    "Secure Admin Login",
    "Access Control",
    "Please enter your administrator credentials to access the secure console.",
    `<section class="section login-section">
      <form method="POST" action="" class="login-form">
        ${errorAlert}
        <div class="input-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            autocomplete="off" 
            placeholder="Enter admin username"
          />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            autocomplete="new-password" 
            placeholder="Enter admin password"
          />
        </div>
        <button type="submit" class="btn-submit">Authenticate</button>
      </form>
    </section>`,
    true
  );
}

function renderMessageCard(message: AdminMessageSnapshot) {
  return `<article class="card">
    <div class="card-top">
      <div>
        <h3 style="font-size: 1.1rem; color: var(--accent);">${escapeHtml(message.subject)}</h3>
        <p class="section-copy" style="margin-top: 4px; font-size: 0.84rem;">${escapeHtml(message.name)} &middot; ${escapeHtml(message.email)}</p>
      </div>
      <span class="section-tag" style="font-size: 0.76rem; padding: 4px 10px;">${escapeHtml(formatDateLabel(message.createdAt))} IST</span>
    </div>
    
    <details style="margin-top: 10px; font-size: 0.82rem;">
      <summary style="color: var(--muted); cursor: pointer;">Preview Message</summary>
      <div style="max-height: 200px; overflow-y: auto; padding: 12px; background: var(--surface-strong); border: 1px solid var(--line); border-radius: 12px; margin-top: 8px; white-space: pre-wrap; font-family: inherit; line-height: 1.65; color: var(--text);">
${escapeHtml(message.message)}
      </div>
    </details>
  </article>`;
}

function renderRoomCard(room: AdminRoomSnapshot) {
  return `<article class="card">
    <div class="card-top">
      <div>
        <h3 class="mono" style="font-size: 1.05rem; color: var(--accent);">${escapeHtml(room.slug)}</h3>
      </div>
      <span class="badge ${room.visibility === "private" ? "badge-private" : "badge-public"}" style="font-size: 0.72rem; padding: 4px 8px;">${escapeHtml(room.visibility)}</span>
    </div>
    
    <div class="meta-grid">
      <div class="meta-item" style="grid-column: span 2;">
        <span class="meta-label">Password</span>
        <span class="meta-value">${room.passwordProtected ? "Yes" : "No"}</span>
      </div>
      <div class="meta-item" style="grid-column: span 2;">
        <span class="meta-label">Created</span>
        <span class="meta-value" style="font-size: 0.78rem;">${escapeHtml(formatDateLabel(room.createdAt))}</span>
      </div>
      <div class="meta-item" style="grid-column: span 2;">
        <span class="meta-label">Expires</span>
        <span class="meta-value" style="font-size: 0.78rem;">${escapeHtml(formatDateLabel(room.expiresAt))}</span>
      </div>
    </div>
    
    <details style="margin-top: 12px; font-size: 0.78rem;">
      <summary style="color: var(--muted); cursor: pointer;">Preview Code</summary>
      <pre style="max-height: 180px; padding: 8px; font-size: 0.76rem; margin-top: 6px;">${escapeHtml(room.codePreview || "// Empty room")}</pre>
    </details>
  </article>`;
}

function renderEmptyState(message: string) {
  return `<div class="empty-state">${escapeHtml(message)}</div>`;
}

function renderDashboardPage(snapshot: AdminDashboardSnapshot) {
  const rooms = snapshot.rooms.length > 0 ? snapshot.rooms.map(renderRoomCard).join("") : renderEmptyState("No rooms are stored right now.");
  const messages =
    snapshot.messages.length > 0
      ? snapshot.messages.map(renderMessageCard).join("")
      : renderEmptyState("No contact messages are stored right now.");

  return renderShell(
    "Secure Admin Console",
    "Backend Read Only",
    `Showing the current MongoDB-backed room and contact-message data. Generated at ${formatDateLabel(snapshot.generatedAt)} IST.`,
    `<section class="stats">
      <article class="stat-card">
        <div class="stat-label">Rooms</div>
        <div class="stat-value">${snapshot.roomCount.toLocaleString("en-US")}</div>
      </article>
      <article class="stat-card">
        <div class="stat-label">Public rooms</div>
        <div class="stat-value">${snapshot.publicRoomCount.toLocaleString("en-US")}</div>
      </article>
      <article class="stat-card">
        <div class="stat-label">Private rooms</div>
        <div class="stat-value">${snapshot.privateRoomCount.toLocaleString("en-US")}</div>
      </article>
      <article class="stat-card">
        <div class="stat-label">Messages</div>
        <div class="stat-value">${snapshot.messageCount.toLocaleString("en-US")}</div>
      </article>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <h2>Rooms</h2>
          <p class="section-copy">Sensitive hashes stay redacted, but room metadata, lifecycle fields, and code previews are visible for admin review.</p>
        </div>
        <span class="section-tag">${snapshot.roomCount.toLocaleString("en-US")} total</span>
      </div>
      <div class="rooms-grid">${rooms}</div>
    </section>

    <section class="section">
      <div class="section-header">
        <div>
          <h2>Contact Messages</h2>
          <p class="section-copy">Messages are rendered newest first and remain read-only inside this route.</p>
        </div>
        <span class="section-tag">${snapshot.messageCount.toLocaleString("en-US")} total</span>
      </div>
      <div class="grid">${messages}</div>
    </section>`
  );
}

export function createAdminRouter(adminService: AdminDashboardReader) {
  const router = Router();

  router.use(urlencoded({ extended: false }));

  router.use((_request, response, next) => {
    setAdminSecurityHeaders(response);
    next();
  });
  router.use(adminAccessLimiter);

  router.get("/", (_request: Request, response: Response) => {
    response.status(200).type("html").send(renderLoginForm());
  });

  router.post("/", asyncHandler(async (request: Request, response: Response) => {
    const { username, password } = request.body || {};

    if (!username || !password) {
      response.status(400).type("html").send(renderLoginForm("Username and password are required."));
      return;
    }

    const isUsernameValid = safeEqual(username, env.ADMIN_USERNAME);
    const isPasswordValid = safeEqual(password, env.ADMIN_PASSWORD);

    if (!isUsernameValid || !isPasswordValid) {
      response.status(401).type("html").send(renderLoginForm("Invalid administrator credentials."));
      return;
    }

    const snapshot = await adminService.getDashboardSnapshot();
    response.status(200).type("html").send(renderDashboardPage(snapshot));
  }));

  router.all("/", (_request: Request, response: Response) => {
    response.status(405).type("html").send(renderShell("Method Not Allowed", "Read Only", "This secure admin route only supports GET and POST requests.", ""));
  });

  router.use((_request: Request, response: Response) => {
    response.status(404).type("html").send(renderShell("Not Found", "Unknown Path", "Only the root admin path is available right now.", ""));
  });

  return router;
}
