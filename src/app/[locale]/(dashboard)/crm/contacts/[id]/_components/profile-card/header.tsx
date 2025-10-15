import LimitedText from "@/components/limited-text";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link, useRouter } from "@/i18n/routing";
import CRMContactInterface from "@/interfaces/crm-contact.interface";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import {
  HiDotsHorizontal,
  HiOutlinePencil,
  HiOutlineTrash,
  HiUser,
} from "react-icons/hi";
import Image from "next/image";
import useAccess from "@/hooks/use-access";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import DeleteContactPopup from "../../../_components/delete-user-popup";
import { Badge } from "@/components/ui/badge";

// The CRM Contact Profile Header Component
interface Props {
  contact: CRMContactInterface;
}

export default function ContactProfileCardHeader({ contact }: Props) {
  // router
  const { replace } = useRouter();
  // access hook
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // handle delete
  // handle delete
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <>
      {/* delete contact dialog */}
      {has(["crm_contacts:delete"]) ? (
        <DeleteContactPopup
          id={contact.id}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          afterDone={() => {
            // function to run after the successful delete
            replace("/crm/contacts");
          }}
        />
      ) : null}
      {/* content */}
      <div className="w-full">
        {/* header badge */}
        <div className="relative w-full rounded-2xl h-[9em] overflow-hidden border border-input">
          <Image
            src="/36304133_8271520(2).jpg"
            width={800}
            alt="random-pattern-image"
            height={450}
            className="w-full object-cover object-top"
          />
          <div className="absolute left-0 top-0 w-full h-full bg-primary/20 backdrop-blur-sm z-[9]" />
        </div>
        {/* header content */}
        <div className="w-full flex gap-2 items-start justify-between">
          <div className="w-full flex flex-col lg:flex-row justify-center lg:justify-start gap-1 items-center lg:items-start px-3">
            <div className="relative -mt-12 mb-2">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/20 to-transparent blur-xl transform -translate-y-2 scale-90 opacity-50" />
              {contact.personalInfo.pic ? (
                <Image
                  alt={contact.personalInfo.firstName}
                  width={100}
                  height={100}
                  src={contact.personalInfo.pic}
                  className="size-[8em] rounded-full bg-muted border-4 border-card relative z-10 object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div
                  className={cn(
                    "relative size-[8em] z-[20] flex justify-center items-center border-card rounded-full shadow-lg transition-transform duration-300 hover:scale-105",
                    contact.personalInfo.gender == "male"
                      ? "bg-blue-500/100 text-blue-800/60"
                      : "bg-pink-400/100 text-pink-600/60"
                  )}
                >
                  <HiUser className="size-16" />
                </div>
              )}
            </div>
            {/* content */}
            <div className="flex flex-col items-center lg:items-start py-4 px-2 gap-4 lg:gap-1">
              {/* name */}
              <h2 className="text-3xl lg:text-2xl font-semibold leading-4 text-foreground">
                <LimitedText limit={40}>
                  {contact.personalInfo.firstName +
                    " " +
                    contact.personalInfo.lastName}
                </LimitedText>
              </h2>
              {/* mini info */}
              <div className="flex flex-col lg:flex-row items-center gap-3">
                {/* created date */}
                <span className="text-foreground/60 text-sm font-medium">
                  <span className="text-foreground/80">Created{"  "}</span>
                  {DateTime.fromISO(contact.createdAt as string).toLocaleString(
                    DateTime.DATE_FULL
                  )}
                </span>
                {/* access and role */}
                {contact.access?.id ? (
                  <>
                    <Popover>
                      <PopoverTrigger>
                        <span
                          style={{
                            backgroundColor: `rgb(from ${contact.access.access.role.color} r g b / 0.1)`,
                            borderColor: `rgb(from ${contact.access.access.role.color} r g b / 0.5)`,
                            color: `rgb(from ${contact.access.access.role.color} r g b / 1)`,
                          }}
                          className="w-max flex items-center px-3 py-0.5 gap-2 text-xs font-medium rounded-full border"
                        >
                          {contact.access.access.role.name}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="p-2">
                        <div className="w-full flex items-center justify-between gap-2">
                          {/* basic info */}
                          <div className="flex gap-2">
                            {contact.access.profileInfo.pic ? (
                              <img
                                src={contact.access.profileInfo.pic}
                                alt={contact.access.profileInfo.fullName}
                                className={cn(
                                  "size-[2.5em] object-cover rounded-full border border-input",
                                  contact.access.profileInfo.gender == "male"
                                    ? "bg-blue-500/30"
                                    : "bg-pink-500/30"
                                )}
                              />
                            ) : (
                              <div
                                className={cn(
                                  "size-[2.5em] flex justify-center items-center border-2 rounded-full",
                                  contact.access.profileInfo.gender == "male"
                                    ? "border-blue-500 bg-blue-500/30 text-blue-500"
                                    : "border-pink-500 bg-pink-500/30 text-pink-500"
                                )}
                              >
                                <HiUser className="size-4" />
                              </div>
                            )}
                            <div className="">
                              <h6 className="text-base leading-4 font-medium text-foreground">
                                <LimitedText limit={17}>
                                  {contact.access.profileInfo.username}
                                </LimitedText>
                              </h6>
                              <p className="text-sm text-foreground/70 mt-1">
                                <LimitedText limit={17}>
                                  {contact.access.profileInfo.email}
                                </LimitedText>
                              </p>
                            </div>
                          </div>
                          {/* edit button */}
                          {!contact.access.access.isAdmin &&
                          has(["user:update"]) ? (
                            <Button
                              className="border"
                              asChild
                              variant="secondary"
                              size="icon"
                            >
                              <Link href={`/users/update/${contact.access.id}`}>
                                <HiOutlinePencil className="size-4" />
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </>
                ) : null}
                {/* inserted by */}
                <Badge
                  variant="outline"
                  className={cn(
                    "w-max px-3 py-0.5 gap-2 justify-center text-xs rounded-full bg-background",
                    contact.insertedBy != "dashboard"
                      ? "text-green-600 bg-green-500/10 border-green-700/20"
                      : "text-purple-600 bg-purple-500/10 border-purple-700/20"
                  )}
                >
                  {contact.insertedBy == "dashboard" ? "Dashboard" : "Website"}
                </Badge>
              </div>
            </div>
          </div>
          {/* setting dropdown */}
          {/* to show the dropdown just when user have at least one permission  */}
          {has(["crm_contacts:update"]) || has(["crm_contacts:delete"]) ? (
            <div className="py-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8 active:translate-y-0"
                  >
                    <HiDotsHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Setting</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {has(["crm_contacts:update"]) ? (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/crm/contacts/update/${contact.id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <HiOutlinePencil className="size-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  {has(["crm_contacts:delete"]) ? (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="flex items-center gap-2 bg-red-500/10 cursor-pointer text-red-500 hover:bg-red-500/60 mt-1"
                    >
                      <HiOutlineTrash className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
