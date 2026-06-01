import { existsSync, readdirSync } from "fs";
import { extname, join } from "path";

export interface PublicInfographicImage {
  src: string;
  alt: string;
  filename: string;
}

const infographicImageExtensions = new Set([
  ".webp",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
]);

export function getLectureInfographics(
  lectureId: string,
  title: string
): PublicInfographicImage[] {
  const folder = lectureId.toUpperCase();
  const publicFolder = join(
    process.cwd(),
    "public",
    "infographics",
    "lectures",
    folder
  );

  if (!existsSync(publicFolder)) return [];

  return readdirSync(publicFolder, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        infographicImageExtensions.has(extname(entry.name).toLowerCase())
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    )
    .map((entry, index) => ({
      src: `/infographics/lectures/${folder}/${entry.name}`,
      alt: `${title} infographic ${index + 1}`,
      filename: entry.name,
    }));
}
