"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { getFileIcon } from "@/components/select-images-dialog/file-icon";
import { FileType } from "@/components/file-upload/file-preview";

interface QuickAccessItem {
  id: string;
  name: string;
  type: "file" | "folder";
  fileType?: FileType;
  accessedAt: string;
  path: string;
}

const quickAccessItems: QuickAccessItem[] = [
  {
    id: "1",
    name: "Project Proposal.docx",
    type: "file",
    fileType: "document",
    accessedAt: "2023-11-15T10:30:00",
    path: "/files/documents/Project Proposal.docx",
  },
  {
    id: "2",
    name: "Team Photos",
    type: "folder",
    accessedAt: "2023-11-14T14:45:00",
    path: "/files/images/Team Photos",
  },
  {
    id: "3",
    name: "Marketing Video.mp4",
    type: "file",
    fileType: "video",
    accessedAt: "2023-11-13T09:15:00",
    path: "/files/videos/Marketing Video.mp4",
  },
  {
    id: "4",
    name: "Company Logo.png",
    type: "file",
    fileType: "image",
    accessedAt: "2023-11-12T16:20:00",
    path: "/files/images/Company Logo.png",
  },
  {
    id: "5",
    name: "Project Documents",
    type: "folder",
    accessedAt: "2023-11-11T11:10:00",
    path: "/files/documents/Project Documents",
  },
];

export default function QuickAccess() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-1">
      {quickAccessItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
        >
          <Link href="#" className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon(item.fileType || "folder")}
            <span className="text-sm font-medium truncate">{item.name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(item.accessedAt)}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Open</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuItem>Remove from quick access</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
