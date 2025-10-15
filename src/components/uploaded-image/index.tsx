// Uploaded image items

import formatFileSize from "@/utils/file-size";
import { Button } from "../ui/button";
import { HiOutlineTrash } from "react-icons/hi";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import ImagePreview from "../select-images-dialog/image-preview";

interface Props {
  url: string;
  alt: string;
  className?: string;
  onRemove?: () => void;
  onClick?: () => void;
  tag?: null | string;
  meta?: { name: string; size: number };
}

export default function UploadedImageItem({
  alt,
  meta,
  className,
  url,
  tag,
  onClick,
  onRemove,
}: Props) {
  return (
    <div className="relative">
      <figure
        onClick={onClick}
        className={cn(
          "group relative h-40 rounded-md bg-muted py-4",
          className
        )}
      >
        <ImagePreview
          width={1000}
          height={1000}
          name={meta?.name || "image"}
          alt={alt}
          url={url}
          className="absolute h-full w-full inset-0 transform rounded-md object-contain"
        />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) onRemove();
          }}
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full absolute top-1 right-1 size-7"
        >
          <HiOutlineTrash className="size-4" />
        </Button>
        <div className="absolute bottom-1 right-1">
          {tag ? (
            <Badge className="text-xs rounded-full px-2 py-0.5">{tag}</Badge>
          ) : null}
        </div>
      </figure>
      {meta ? (
        <div className="text-xs mt-1">
          <p className="break-words line-clamp-1 font-medium text-accent-foreground mb-1">
            {meta.name}
          </p>
          <p className="break-words font-medium text-accent-foreground/80">
            {formatFileSize(meta.size)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
