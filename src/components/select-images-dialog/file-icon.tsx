import { FileType } from "@/components/file-upload/file-preview";
import { cn } from "@/lib/utils";
import Image from "next/image";
export const LIMIT = 40;
export const getFileIcon = (type: FileType | "folder", className?: string) => {
  switch (type) {
    case "text":
    case "document":
      return (
        <Image
          src="/file-manager-icons/docs.svg"
          alt="doc"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    case "spreadsheet":
      return (
        <Image
          src="/file-manager-icons/sheet.svg"
          alt="sheet"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    case "image":
      return (
        <Image
          src="/file-manager-icons/image.svg"
          alt="image"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    case "folder":
      return (
        <Image
          src="/file-manager-icons/folder.svg"
          alt="folder"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    case "audio":
      return (
        <Image
          src="/file-manager-icons/audio.svg"
          alt="audio"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    case "video":
      return (
        <Image
          src="/file-manager-icons/movie.svg"
          alt="movie"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    case "pdf":
      return (
        <Image
          src="/file-manager-icons/pdf.svg"
          alt="pdf"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    case "presentation":
      return (
        <Image
          src="/file-manager-icons/presentation.png"
          alt="presentation"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    case "archive":
      return (
        <Image
          src="/file-manager-icons/zip.svg"
          alt="zip"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
    default:
      return (
        <Image
          src="/file-manager-icons/docs.svg"
          alt="doc"
          width={26}
          height={26}
          loading="lazy"
          className={cn("aspect-square", className)}
          decoding="async"
        />
      );
  }
};
