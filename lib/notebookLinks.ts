import { existsSync, readFileSync } from "fs";
import { join } from "path";

export interface NotebookLinks {
  kaggle?: string;
  ipynb?: string;
  html?: string;
  htmlFallback?: string;
}

function readLinkFile(filename: string): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const raw = readFileSync(join(process.cwd(), `data/${filename}`), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([^=\s]+)\s*(?:=|\s+)\s*(\S.*)$/);
      if (!match) continue;
      const key = match[1].toUpperCase();
      const url = match[2].trim();
      if (key && url) map.set(key, url);
    }
  } catch {
    // file missing during client-side bundling — safe to ignore
  }
  return map;
}

function getLocalPublicFile(path: string): string | undefined {
  return existsSync(join(process.cwd(), "public", path)) ? `/${path}` : undefined;
}

function validLink(url: string | undefined): string | undefined {
  if (!url || url.includes("/.../") || url.includes("FILE_ID") || url.endsWith("id=") || url.includes("/d//")) {
    return undefined;
  }
  return url;
}

let _labMap: Map<string, string> | null = null;
function labMap() { return (_labMap ??= readLinkFile("lab-notebooks.txt")); }

export function getLabLinks(id: string): NotebookLinks {
  const upper = id.toUpperCase();
  const map = labMap();
  const match = id.match(/\d+$/);
  const folder = match ? `lab${match[0]}` : "";

  return {
    kaggle: validLink(map.get(upper)),
    ipynb:  validLink(map.get(`${upper}_IPYNB`)) ?? getLocalPublicFile(`notebooks/labs/${folder}/notebook.ipynb`),
    html:   validLink(map.get(`${upper}_HTML`))  ?? getLocalPublicFile(`notebooks/labs/${folder}/notebook.html`),
    htmlFallback: getLocalPublicFile(`notebooks/labs/${folder}/notebook.html`),
  };
}

// ── Tutorial notebooks ────────────────────────────────────────────────────────
// tutorial-notebooks.txt keys follow the pattern:
//   OD01 / SSL01 / TR01          → Kaggle link
//   OD01_IPYNB / SSL01_IPYNB … → Google Drive .ipynb download
//   OD01_HTML  / SSL01_HTML  … → Google Drive HTML preview
//
// tutorialId values come from data/tutorials.ts (e.g. "od-01", "ssl-02", "tr-03")

let _tutorialMap: Map<string, string> | null = null;
function tutorialMap() { return (_tutorialMap ??= readLinkFile("tutorial-notebooks.txt")); }

function tutorialIdToKey(tutorialId: string): string {
  // "od-01" → "OD01",  "ssl-02" → "SSL02",  "tr-03" → "TR03"
  return tutorialId.replace("-", "").toUpperCase();
}

export function getTutorialLinks(tutorialId: string): NotebookLinks {
  const key = tutorialIdToKey(tutorialId);
  const map = tutorialMap();
  const folder = tutorialId; // e.g. "od-01" used as public folder name if needed

  return {
    kaggle: validLink(map.get(key)),
    ipynb:  validLink(map.get(`${key}_IPYNB`)) ?? getLocalPublicFile(`notebooks/tutorials/${folder}/notebook.ipynb`),
    html:   validLink(map.get(`${key}_HTML`))  ?? getLocalPublicFile(`notebooks/tutorials/${folder}/notebook.html`),
    htmlFallback: getLocalPublicFile(`notebooks/tutorials/${folder}/notebook.html`),
  };
}

// ── Lecture slides ────────────────────────────────────────────────────────────
// lecture-slides.txt keys: L01 / L01_PDF

export interface LectureLinks {
  slides?: string;
  pdf?: string;
}

function lectureMap() { return readLinkFile("lecture-slides.txt"); }

function getGoogleDriveFileId(url?: string): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    return parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
      ?? parsed.searchParams.get("id")
      ?? undefined;
  } catch {
    return undefined;
  }
}

export function getDriveFileId(url: string): string | null {
  return getGoogleDriveFileId(url) ?? null;
}

export function getDriveDownloadUrl(fileUrl: string): string {
  return getGoogleDriveDownloadUrl(fileUrl) ?? fileUrl;
}

export function getDriveHtmlViewerPath(htmlUrl: string, htmlFallback?: string): string {
  const fileId = getGoogleDriveFileId(htmlUrl);
  if (!fileId) return htmlUrl;

  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getGoogleDrivePreviewUrl(url?: string): string | undefined {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
}

function getGoogleDriveDownloadUrl(url?: string): string | undefined {
  const fileId = getGoogleDriveFileId(url);
  return fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : url;
}

export function getLectureLinks(lectureId: string): LectureLinks {
  const key = lectureId.toUpperCase();
  const map = lectureMap();
  return {
    slides: getGoogleDrivePreviewUrl(map.get(key)),
    pdf:    getGoogleDriveDownloadUrl(map.get(`${key}_PDF`)),
  };
}

// ── Lab infographics ──────────────────────────────────────────────────────────
// Drop public/infographics/labs/LAB01.{png,jpg,jpeg,webp,svg}

export function getLabInfographic(labId: string): string | undefined {
  for (const ext of ["png", "jpg", "jpeg", "webp", "svg"]) {
    const result = getLocalPublicFile(`infographics/labs/${labId}.${ext}`);
    if (result) return result;
  }
  return undefined;
}

// ── Tutorial infographics ─────────────────────────────────────────────────────
// Drop public/infographics/tutorials/od-01.{png,jpg,jpeg,webp,svg}

export function getTutorialInfographic(tutorialId: string): string | undefined {
  const candidates = [tutorialId];
  const baseId = tutorialId.match(/^(.*\d{2})[a-z]$/i)?.[1];
  if (baseId) candidates.push(baseId);

  for (const id of candidates) {
    for (const ext of ["png", "jpg", "jpeg", "webp", "svg"]) {
      const result = getLocalPublicFile(`infographics/tutorials/${id}.${ext}`);
      if (result) return result;
    }
  }
  return undefined;
}
