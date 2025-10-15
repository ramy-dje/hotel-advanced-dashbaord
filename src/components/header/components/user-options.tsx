"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import useAccess from "@/hooks/use-access";
import useAuth from "@/hooks/use-auth";
import { useRouter } from "@/i18n/routing";
import { cn, getAvatarName } from "@/lib/utils";
import { useTheme } from "next-themes";
import { HiOutlineCog, HiOutlineLogout, HiOutlineMoon } from "react-icons/hi";

// Header user options card
export default function HeaderUserOptionsCard() {
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const { role } = useAccess();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="empty"
            size="avatar"
            className="right-0 focus:translate-y-0 active:translate-y-0"
          >
            <Avatar className="w-full ">
              <AvatarFallback>
                {getAvatarName(user?.username ?? "")}
              </AvatarFallback>
              <AvatarImage src={user?.pic} />
              <span className="sr-only">Toggle user menu</span>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[17em] mt-1 shadow-md">
          <div
            style={{
              backgroundColor: role?.color
                ? `rgb(from ${role.color} r g b / 0.2)`
                : "transparent",
              borderColor: role?.color
                ? `rgb(from ${role.color} r g b / 0.4)`
                : "transparent",
            }}
            className="relative px-3 py-3 w-full flex items-center gap-3 rounded-md border"
          >
            <Avatar
              style={{
                borderColor: role?.color || "transparent",
              }}
              className={cn(
                "relative size-10 rounded-full right-0",
                `border-[2px] border-transparent`
              )}
            >
              <AvatarFallback>
                {getAvatarName(user?.username ?? "")}
              </AvatarFallback>
              <AvatarImage src={user?.pic} />
            </Avatar>

            <div className="relative w-full flex flex-col">
              <h4
                title={user?.username}
                className="text-foreground line-clamp-1 text-base font-semibold leading-5"
              >
                {user?.username && user?.email.length > 25
                  ? user?.username.slice(0, 25) + "..."
                  : user?.username}
              </h4>

              {role ? (
                <span
                  title={role.name}
                  style={{
                    backgroundColor: role?.color || "transparent",
                  }}
                  className="absolute top-0.5 right-0 z-20 px-2 rounded-full text-xs text-[10px] text-white"
                >
                  {role.name.slice(0, 10).toLocaleUpperCase()}
                </span>
              ) : null}

              <p
                title={user?.email}
                className="w-full text-wrap text-foreground/70 text-sm leading-4"
              >
                {user?.email && user?.email.length > 20
                  ? user?.email.slice(0, 20) + "..."
                  : user?.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push("/setting")}
            className="flex items-center gap-2"
          >
            <HiOutlineCog className="size-5 text-popover-foreground/90" />
            Setting
          </DropdownMenuItem>

          <DropdownMenuItem
            // disabled
            onClick={() => setTheme(theme == "light" ? "dark" : "light")}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <HiOutlineMoon className="size-5 text-popover-foreground/90" />
              Dark mode
            </div>
            <Switch checked={theme ? theme === "dark" : false} />
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex text-red-900 items-center gap-2"
          >
            <HiOutlineLogout className="size-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
