import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

type FileType =
  | "video"
  | "image"
  | "audio"
  | "document"
  | "archive"
  | "unknown";

/**
 * Extrait l'extension d'un fichier à partir de son URL ou chemin.
 */
export function getExtensionByUrl(path: string): string | null {
  if (typeof path !== "string") return null;

  const fileName = path.split("/").pop();
  if (!fileName || !fileName.includes(".")) return null;

  const knownDoubleExtensions = ["tar.gz", "tar.bz2", "tar.xz"];
  for (const ext of knownDoubleExtensions) {
    if (fileName.endsWith(`.${ext}`)) return ext;
  }

  return fileName.split(".").pop()!.toLowerCase();
}

/**
 * Détermine si l'extension correspond à un fichier vidéo.
 */
function isVideoExtension(extension: string): boolean {
  const videoExtensions = [
    "mp4",
    "webm",
    "avi",
    "mov",
    "mkv",
    "flv",
    "wmv",
    "mpeg",
  ];
  return videoExtensions.includes(extension.toLowerCase());
}

/**
 * Renvoie le type de fichier (image, vidéo, audio, document, archive, ou inconnu).
 */
export function getFileTypeByUrl(path: string): FileType {
  const ext = getExtensionByUrl(path);
  if (!ext) return "unknown";

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  const videoExtensions = [
    "mp4",
    "webm",
    "avi",
    "mov",
    "mkv",
    "flv",
    "wmv",
    "mpeg",
  ];
  const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac"];
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "md",
  ];
  const archiveExtensions = [
    "zip",
    "rar",
    "7z",
    "tar",
    "gz",
    "tar.gz",
    "bz2",
    "xz",
  ];

  if (imageExtensions.includes(ext)) return "image";
  if (videoExtensions.includes(ext)) return "video";
  if (audioExtensions.includes(ext)) return "audio";
  if (documentExtensions.includes(ext)) return "document";
  if (archiveExtensions.includes(ext)) return "archive";

  return "unknown";
}

export function formatDate (dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    if (diffHours > 0)
      return `il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
    if (diffMin > 0) return `il y a ${diffMin} minute${diffMin > 1 ? "s" : ""}`;
    return "à l'instant";
  }

  if (diffDays === 1) {
    return `Hier à ${date.getHours()}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )}`;
  }

  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function extractYouTubeId(url: string) {
  const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : '';
}

