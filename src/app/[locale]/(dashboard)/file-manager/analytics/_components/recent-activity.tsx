"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarName } from "@/lib/utils";

export default function RecentActivity() {
  const lastUploadedFiles = [
    {
      id: "file1",
      name: "Product Mockup Final.png",
      type: "file",
      fileType: "image",
      size: "4.2 MB",
      uploadedAt: "2025-03-29T14:30:00",
      uploadedBy: {
        name: "Alex Johnson",
        avatar: "/placeholder-user.jpg",
        email: "alex@example.com",
      },
    },
    {
      id: "file2",
      name: "Q3 Report.docx",
      type: "file",
      fileType: "document",
      size: "1.8 MB",
      uploadedAt: "2025-03-29T10:30:00",
      uploadedBy: {
        name: "Sarah Miller",
        avatar: "/placeholder-user.jpg",
        email: "sarah@example.com",
      },
    },
    {
      id: "file3",
      name: "Budget Forecast.xlsx",
      type: "file",
      fileType: "excel",
      size: "1.8 MB",
      uploadedAt: "2025-03-29T09:30:00",
      uploadedBy: {
        name: "Michael Chen",
        avatar: "/placeholder-user.jpg",
        email: "michael@example.com",
      },
    },
  ];

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    // Check if the date is today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // Check if the date was yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // For older dates, show the full date
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      ` at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  };

  return lastUploadedFiles.map((item) => (
    <div className="flex" key={item?.id}>
      <div className="flex flex-col items-center mr-4">
        <Avatar className="size-8 text-xs">
          <AvatarImage
            src={item?.uploadedBy.avatar}
            alt={item?.uploadedBy.name}
          />
          <AvatarFallback>
            {getAvatarName(item!.uploadedBy.name)}
          </AvatarFallback>
        </Avatar>
        <div className="w-px h-full bg-muted mt-2" />
      </div>
      <div className="pb-8">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item?.name}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {item?.size}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Uploaded by {item?.uploadedBy.name}
        </p>
        <time className="text-xs text-muted-foreground mt-1 block">
          {formatTimeAgo(item!.uploadedAt)}
        </time>
      </div>
    </div>
  ));
}
