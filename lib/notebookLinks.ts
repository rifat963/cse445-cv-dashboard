import { existsSync, readFileSync } from "fs";
import { join } from "path";

export interface NotebookLinks {
  kaggle?: string;
  ipynb?: string;
  html?: string;
}

function readLinkFile(filename: string): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const raw = readFileSync(join(process.cwd(), `data/${filename}`), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const space = trimmed.indexOf(" ");
      if (space === -1) continue;
      const key = trimmed.slice(0, space).toUpperCase();
      const url = trimmed.slice(space + 1).trim();
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

let _labMap: Map<string, string> | null = null;
function labMap() { return (_labMap ??= readLinkFile("lab-notebooks.txt")); }

export function getLabLinks(id: string): NotebookLinks {
  const upper = id.toUpperCase();
  const map = labMap();
  const match = id.match(/\d+$/);
  const folder = match ? `lab${match[0]}` : "";

  return {
    kaggle: map.get(upper),
    ipynb:  map.get(`${upper}_IPYNB`) ?? getLocalPublicFile(`notebooks/labs/${folder}/notebook.ipynb`),
    html:   map.get(`${upper}_HTML`)  ?? getLocalPublicFile(`notebooks/labs/${folder}/notebook.html`),
  };
}
