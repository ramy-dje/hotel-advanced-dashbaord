import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function ImagePreview({
  name,
  url,
  alt = "image preview",
  width = 800,
  height = 800,
  className,
}: {
  name: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return name.toLowerCase().endsWith(".svg") ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={cn("size-full object-cover", className)}
      loading="lazy"
    />
  ) : (
    <Image
      width={width}
      height={height}
      src={url}
      className={cn("size-full object-cover", className)}
      alt={alt}
      loading="lazy"
    />
  );
}
