"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
  HiOutlineBell,
  HiOutlineChatAlt2,
  HiOutlineCog,
  HiOutlineMenuAlt1,
} from "react-icons/hi";
import { AiOutlineDashboard } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { Sheet, SheetSidebarContent, SheetTrigger } from "../ui/sheet";
import DashboardSidebar from "../sidebar";
import HeaderUserOptionsCard from "./components/user-options";
import HeaderSearchBar from "./components/search-bar";
import { useRouter } from "@/i18n/routing";
import { BsFolder } from "react-icons/bs";
import useAccess from "@/hooks/use-access";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// The Header Component
export default function DashboardHeader() {
  const [over, setOver] = useState(false);
  const router = useRouter();
  const { has } = useAccess();

  const header_ref = useRef<HTMLElement>(null);

  useEffect(() => {
    // setting the over state to true if the scrollY is more then 10 and setting to false if scrollY is less then 10
    if (window && header_ref.current) {
      window.onscroll = () => {
        if (window.scrollY > 10) {
          setOver(true);
        } else {
          setOver(false);
        }
      };
    }
  }, []);

  return (
    <header
      ref={header_ref}
      className={cn(
        "w-full flex items-center justify-between top-0 z-[999] sticky p-4 md:p-5 lg:p-6 2xl:py-5 bg-background/80 backdrop-blur-xl transition-shadow",
        over ? "card-shadow" : "shadow-none"
      )}
    >
      <div className="flex items-center gap-2">
        {/* mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="flex xl:hidden" variant="outline" size="icon">
              <HiOutlineMenuAlt1 className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetSidebarContent className="px-0 bg-muted" side="left">
            <DashboardSidebar />
          </SheetSidebarContent>
        </Sheet>

        {/* Searchbar will be here  */}
        <HeaderSearchBar />
      </div>
      {/* quick actions */}

      <div className="flex items-center gap-3">
        {/* fake test button */}

        <Button size="icon" variant="outline" className="size-9">
          <HiOutlineBell className="size-5" />
        </Button>

        <Button size="icon" variant="outline" className="size-9">
          <HiOutlineChatAlt2 className="size-5" />
        </Button>

        {has(["file_manager:read"]) ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="size-9">
                <BsFolder className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[10em] mt-1 shadow-md"
            >
              {has(["file_manager_analytics:read"]) ? (
                <DropdownMenuItem
                  onClick={() => router.push("/file-manager/analytics")}
                  className="flex items-center gap-2"
                >
                  <AiOutlineDashboard className="size-5 text-popover-foreground/90" />
                  Overview
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                onClick={() => router.push("/file-manager")}
                className="flex items-center gap-2"
              >
                <BsFolder className="size-5 text-popover-foreground/90" />
                File manager
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        <Button
          onClick={() => router.push("/setting")}
          size="icon"
          variant="outline"
          className="size-9"
        >
          <HiOutlineCog className="size-5" />
        </Button>

        {/* User */}
        <HeaderUserOptionsCard />
      </div>
    </header>
  );
}
