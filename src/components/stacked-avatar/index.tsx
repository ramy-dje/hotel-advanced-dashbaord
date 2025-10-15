import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getAvatarName } from "@/lib/utils";
import { TooltipCard } from "../tooltip-card";

export interface User {
  id?: string;
  fullName: string;
  pic?: string;
}

interface StackedAvatarProps {
  users: User[];
  limit?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StackedAvatar({
  users,
  limit = 3,
  size = "md",
  className,
}: StackedAvatarProps) {
  // Calculate visible users and remaining count
  const visibleUsers = users.slice(0, limit);
  const remainingCount = Math.max(0, users.length - limit);
  const hasMoreUsers = remainingCount > 0;

  // Size classes for different avatar sizes
  const sizeClasses = {
    sm: "size-6 text-xs",
    md: "size-8 text-sm",
    lg: "size-10 text-base",
  };

  const avatarSize = sizeClasses[size];
  const overlapOffset = size === "sm" ? -8 : size === "md" ? -12 : -16;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex">
        {/* Visible avatars */}
        {visibleUsers.map((user, index) => (
          <TooltipCard
            key={user.id || `user-${index}`}
            description={user.fullName}
          >
            <Avatar
              className={cn(
                "cursor-default hover:!z-50",
                avatarSize,
                "border border-background"
              )}
              style={{
                marginLeft: index !== 0 ? `${overlapOffset}px` : undefined,
                zIndex: visibleUsers.length + index,
              }}
            >
              <AvatarImage src={user.pic} alt={user.fullName} />
              <AvatarFallback>{getAvatarName(user.fullName)}</AvatarFallback>
            </Avatar>
          </TooltipCard>
        ))}

        {/* "+X" indicator for remaining users */}
        {hasMoreUsers && (
          <div
            className={cn(
              avatarSize,
              "border border-background rounded-full flex items-center justify-center bg-muted text-muted-foreground font-medium z-30"
            )}
            style={{
              marginLeft: `${overlapOffset}px`,
            }}
            aria-label={`${remainingCount} more users`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}
