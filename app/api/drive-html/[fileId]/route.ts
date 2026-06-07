import { NextRequest, NextResponse } from "next/server";
import { request as httpRequest } from "http";
import { request as httpsRequest } from "https";
import type { IncomingHttpHeaders } from "http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DRIVE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=";
const MAX_REDIRECTS = 5;

interface FetchTextResult {
  body: string;
  headers: IncomingHttpHeaders;
}

function decodeAttribute(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
}

function getConfirmUrl(body: string): string | null {
  const hrefMatch =
    body.match(/href="([^"]*(?:confirm=|uc-download-link|export=download)[^"]*)"/i) ??
    body.match(/href='([^']*(?:confirm=|uc-download-link|export=download)[^']*)'/i);

  if (!hrefMatch) return null;

  const href = decodeAttribute(hrefMatch[1]).replaceAll("\\u003d", "=").replaceAll("\\u0026", "&");
  return href.startsWith("http")
    ? href
    : `https://drive.google.com${href.startsWith("/") ? "" : "/"}${href}`;
}

function isDriveIntermediary(body: string): boolean {
  const lower = body.slice(0, 12000).toLowerCase();
  return (
    lower.includes("google drive") &&
    (lower.includes("virus scan") ||
      lower.includes("download anyway") ||
      lower.includes("uc-download-link") ||
      lower.includes("confirm="))
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function safeDriveUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    return url.hostname === "drive.google.com" ? url.toString() : null;
  } catch {
    return null;
  }
}

function fallbackResponse(request: NextRequest, fileId: string, message: string) {
  const fallback = request.nextUrl.searchParams.get("fallback");
  if (fallback?.startsWith("/")) {
    return NextResponse.redirect(new URL(fallback, request.url));
  }

  const sourceUrl =
    safeDriveUrl(request.nextUrl.searchParams.get("source")) ??
    `https://drive.google.com/file/d/${fileId}/view`;

  return new NextResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Notebook HTML unavailable</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f6f8fa;
        color: #1f2328;
      }
      main {
        max-width: 560px;
        padding: 32px;
        text-align: center;
      }
      p {
        line-height: 1.6;
        color: #636c76;
      }
      a {
        display: inline-flex;
        margin-top: 12px;
        border-radius: 8px;
        background: #2563eb;
        color: #fff;
        padding: 10px 14px;
        text-decoration: none;
        font-weight: 700;
        font-size: 14px;
      }
      @media (prefers-color-scheme: dark) {
        body { background: #0d1117; color: #e6edf3; }
        p { color: #8b949e; }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Notebook preview unavailable</h1>
      <p>${escapeHtml(message)} You can still open the HTML file directly in Google Drive.</p>
      <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">Open HTML in Google Drive</a>
    </main>
  </body>
</html>`, {
    status: 502,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function shouldRelaxTls(hostname: string): boolean {
  return hostname === "drive.google.com" || hostname.endsWith(".google.com") || hostname.endsWith(".googleusercontent.com");
}

function mergeCookies(existing: string[], headers: IncomingHttpHeaders): string[] {
  const setCookie = headers["set-cookie"] ?? [];
  const values = Array.isArray(setCookie) ? setCookie : [setCookie];
  const next = new Map(existing.map((cookie) => [cookie.split("=")[0], cookie]));

  for (const cookie of values) {
    const firstPart = cookie.split(";")[0];
    if (firstPart) next.set(firstPart.split("=")[0], firstPart);
  }

  return [...next.values()];
}

function fetchTextWithNode(
  url: string,
  headers: Record<string, string>,
  redirectCount = 0,
  cookies: string[] = []
): Promise<FetchTextResult> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const requestHeaders = cookies.length ? { ...headers, Cookie: cookies.join("; ") } : headers;
    const options = {
      headers: requestHeaders,
      ...(parsed.protocol === "https:" && shouldRelaxTls(parsed.hostname) ? { rejectUnauthorized: false } : {}),
    };
    const requestFn = parsed.protocol === "https:" ? httpsRequest : httpRequest;

    const req = requestFn(parsed, options, (res) => {
      const location = res.headers.location;
      const nextCookies = mergeCookies(cookies, res.headers);

      if (location && res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && redirectCount < MAX_REDIRECTS) {
        resolve(fetchTextWithNode(new URL(location, url).toString(), headers, redirectCount + 1, nextCookies));
        return;
      }

      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      res.on("end", () => {
        resolve({
          body: Buffer.concat(chunks).toString("utf-8"),
          headers: res.headers,
        });
      });
    });

    req.setTimeout(30000, () => {
      req.destroy(new Error("Timed out while fetching Google Drive HTML."));
    });
    req.on("error", reject);
    req.end();
  });
}

async function fetchDriveHtml(fileId: string): Promise<string> {
  const headers: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 CSE445 notebook viewer",
  };

  let { body } = await fetchTextWithNode(`${DRIVE_DOWNLOAD_URL}${fileId}`, headers);
  if (!isDriveIntermediary(body)) return body;

  const confirmUrl = getConfirmUrl(body);
  if (!confirmUrl) return body;

  ({ body } = await fetchTextWithNode(confirmUrl, headers));

  return body;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await context.params;

  if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return new NextResponse("Invalid Google Drive file ID.", { status: 400 });
  }

  try {
    const body = await fetchDriveHtml(fileId);

    if (isDriveIntermediary(body)) {
      return fallbackResponse(request, fileId, "Google Drive did not return the HTML file content.");
    }

    return new NextResponse(body, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch {
    return fallbackResponse(request, fileId, "Could not fetch the Google Drive HTML file.");
  }
}
