import { FileType } from "../file-upload/file-preview";

import { z } from "zod";

export type FileTypeCategory = Exclude<FileType, "other">;

type FileTypeMap = Record<FileTypeCategory, Record<string, string[]>>;

type AcceptProp = Record<string, string[]>;

// === FILE TYPE MAP ===
const FILE_TYPE_MAP: FileTypeMap = {
  image: {
    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"],
  },
  audio: {
    "audio/*": [".mp3", ".wav", ".ogg", ".flac", ".m4a"],
  },
  video: {
    "video/*": [".mp4", ".mkv", ".flv", ".avi", ".mov", ".wmv"],
  },
  pdf: {
    "application/pdf": [".pdf"],
  },
  document: {
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
  },
  presentation: {
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
  },
  spreadsheet: {
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
  text: {
    "text/plain": [".txt"],
  },
  archive: {
    "application/zip": [".zip"],
    "application/x-rar-compressed": [".rar"],
    "application/x-tar": [".tar"],
    "application/gzip": [".gz"],
  },
};

// === HELPER FUNCTION ===
export function getAcceptProps(
  allowedFileTypes: FileTypeCategory[] = []
): AcceptProp {
  return allowedFileTypes.reduce<AcceptProp>((accept, fileType) => {
    const typeMapping = FILE_TYPE_MAP[fileType];
    if (!typeMapping) return accept;

    Object.entries(typeMapping).forEach(([mimeType, extensions]) => {
      if (!accept[mimeType]) {
        accept[mimeType] = [...extensions];
      } else {
        const merged = Array.from(
          new Set([...accept[mimeType], ...extensions])
        );
        accept[mimeType] = merged;
      }
    });

    return accept;
  }, {});
}

export const DEFAULT_FILE_TYPES: FileTypeCategory[] = [
  "archive",
  "audio",
  "document",
  "image",
  "video",
  "pdf",
  "presentation",
  "spreadsheet",
  "text",
];

export enum FOLDERS_NAME {
  ROOMS = "Rooms",
  ARTICLES = "Articles",
}

const FileTypeSchema = z.enum([
  "archive",
  "audio",
  "document",
  "image",
  "video",
  "pdf",
  "presentation",
  "spreadsheet",
  "text",
  "other",
]);

export const FileSchema = z.object({
  id: z.string(),
  originalname: z.string().optional(),
  mimetype: z.string().optional(),
  size: z.number().optional(),
  type: FileTypeSchema,
  presignedUrl: z.string().url(), // Validates URLs
  alt: z.string().optional(),
});

export type FileSchemaType = z.infer<typeof FileSchema>;

// handle remove image
export const handelRemoveImage = ({
  id,
  files,
  setFiles,
  primaryImage,
  setPrimaryImage,
}: {
  id: string;
  files: FileSchemaType[];
  setFiles: (files: FileSchemaType[]) => void;
} & (
  | {
      primaryImage?: undefined;
      setPrimaryImage?: undefined;
    }
  | { primaryImage: string; setPrimaryImage: (fileId?: string) => void }
)) => {
  const updatedFiles = files.filter((f) => f.id !== id);
  setFiles(updatedFiles);
  if (id === primaryImage) {
    setPrimaryImage(updatedFiles.length > 0 ? updatedFiles[0].id : undefined);
  }
};
