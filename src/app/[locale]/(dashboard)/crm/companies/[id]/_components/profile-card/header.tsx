import LimitedText from "@/components/limited-text";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/routing";
import CRMCompanyInterface from "@/interfaces/crm-company.interface";
import { DateTime } from "luxon";
import {
  HiDotsHorizontal,
  HiOutlinePencil,
  HiOutlineTrash,
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
import DeleteCompanyPopup from "../../../_components/delete-user-popup";
import { Badge } from "@/components/ui/badge";
import { FaBuilding } from "react-icons/fa6";

// The CRM Company Profile Header Component
interface Props {
  company: CRMCompanyInterface;
}

export default function CompanyProfileCardHeader({ company }: Props) {
  // router
  const { replace } = useRouter();
  // access hook
  const { has } = useAccess();
  // dialogs open states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // handle delete
  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <>
      {/* delete company dialog */}
      {has(["crm_company:delete"]) ? (
        <DeleteCompanyPopup
          id={company.id}
          open={deleteDialogOpen}
          setOpen={setDeleteDialogOpen}
          afterDone={() => {
            // function to run after the successful delete
            replace("/crm/companies");
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
            className="w-full object-cover object-bottom"
          />
          <div className="absolute left-0 top-0 w-full h-full bg-primary/20 backdrop-blur-sm z-[9]" />
        </div>
        {/* header content */}
        <div className="w-full flex gap-2 items-start justify-between">
          <div className="w-full flex flex-col lg:flex-row justify-center lg:justify-start gap-1 items-center lg:items-start px-3">
            <div className="relative -mt-12 mb-2">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-black/20 to-transparent blur-xl transform -translate-y-2 scale-90 opacity-50" />
              {company.info.logo ? (
                <img
                  alt={company.info.name}
                  width={100}
                  height={100}
                  src={company.info.logo}
                  className="size-[8em] rounded-full bg-muted border-4 border-card relative z-10 object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="relative size-[8em] z-[20] flex justify-center items-center bg-gray-100 text-gray-700 border-card rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                  <FaBuilding className="size-16" />
                </div>
              )}
            </div>
            {/* content */}
            <div className="flex flex-col items-center lg:items-start py-4 px-2 gap-4 lg:gap-1">
              {/* name */}
              <h2 className="text-3xl lg:text-2xl font-semibold leading-4 text-foreground">
                <LimitedText limit={40}>{company.info.name}</LimitedText>
              </h2>
              {/* mini info */}
              <div className="flex flex-col lg:flex-row items-center gap-3">
                {/* created date */}
                <span className="text-foreground/60 text-sm font-medium">
                  <span className="text-foreground/80">Created{"  "}</span>
                  {DateTime.fromISO(company.createdAt as string).toLocaleString(
                    DateTime.DATE_FULL
                  )}
                </span>
                {/* inserted by */}
                <Badge
                  variant="outline"
                  className="w-max px-3 py-0.5 gap-2 justify-center text-xs rounded-full text-green-600 bg-green-500/10 border-green-700/20"
                >
                  Dashboard
                </Badge>
              </div>
            </div>
          </div>
          {/* setting dropdown */}
          {/* to show the dropdown just when user have at least one permission  */}
          {has(["crm_company:update"]) || has(["crm_company:delete"]) ? (
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
                  {has(["crm_company:update"]) ? (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/crm/companies/update/${company.id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <HiOutlinePencil className="size-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  {has(["crm_company:delete"]) ? (
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
