import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import { ColumnDef } from "@tanstack/react-table";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash, HiOutlinePhotograph } from "react-icons/hi";
import PropertyInterface from "@/interfaces/property.interface";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Rating from "@/components/rating";

// New imports for Tooltip and Dropdown
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

// Function to get flag image URL
function getFlagImage(isoCode: string): string {
  // URL structure for flag images (for example, using flagcdn.com)
  const flagUrl = `https://flagcdn.com/w20/${isoCode.toLowerCase()}.png`; // Changed to w20 for tiny circle
  return flagUrl;
}

export const Properties_TableColumns: ColumnDef<PropertyInterface>[] = [
  // 1) Row-selection checkbox (remains first)
  {
    id: "select",
    header: ({ table }) =>
      !(table.options.meta as any).has(["property:delete"]) ? null : (
        <Checkbox
          className="size-5"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
          aria-label="Select all"
        />
      ),
    cell: ({ row, table: { options } }) =>
      !(options.meta as any).has(["property:delete"]) ? null : (
        <Checkbox
          className="size-5"
          checked={row.getIsSelected()}
          onCheckedChange={(val) => row.toggleSelected(!!val)}
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  },

  // 2) Main photo from imageGallery (NEW/REINTRODUCED COLUMN)
  {
    header: "PHOTO",
    accessorFn: (r) => r.imageGallery?.[0] ?? "", // Access nested image URL, default to empty string
    cell: ({ getValue, row: { original } }) => {
      const imageUrl = getValue() as string;
      const propertyName = original.propertyName || "Property Image"; // Fallback for alt text

      return (
        <div className="size-10 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 text-primary/50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={propertyName}
              loading="lazy"
              className="size-full object-cover object-center"
            />
          ) : (
            // Placeholder if no image URL
            <HiOutlinePhotograph className="size-6" />
          )}
        </div>
      );
    },
    footer: "PHOTO",
    enableSorting: false,
    enableHiding: false, // You might want to allow hiding this later
  },

  // 3) CODE (now third column)
  {
    header: "CODE",
    accessorFn: (r) => r.code ?? "N/A",
    footer: "CODE",
  },

  // 4) PROPERTY NAME
  {
    header: "PROPERTY NAME",
    accessorFn: (r) => r.propertyName ?? "N/A",
    footer: "PROPERTY NAME",
  },

  // 5) OWNER
  {
    header: "OWNER",
    accessorFn: (r) => r.propertyOwner ?? "N/A",
    cell: ({ getValue }) => {
      const ownerName = getValue() as string;
      return (
        <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"> {/* Adjusted for no wrapping and ellipsis */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{ownerName}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{ownerName}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    footer: "OWNER",
  },

  // 6) DIRECTORY
  {
    header: "DIRECTORY",
    accessorFn: (r) => r.directory?.type ?? "N/A",
    footer: "DIRECTORY",
  },

  // 7) RATING
  {
    header: "RATING",
    accessorFn: (r) => r.propertyRating ?? 0,
    cell: ( {getValue} ) => {
      const initialRating = getValue() as number || 0;
      console.log("Initial Rating:", initialRating);
      // const { handleUpdateRating, has }: any = options.meta;
      // const canUpdate = has(["room:update"]);

      return (
        <Rating
          className="w-6 h-6"
          initialRating={initialRating}
          onRatingChange={(newRating) => {}}
          // onRatingChange={(newRating) => {
          //   if (handleUpdateRating) {
          //     handleUpdateRating(row.original.id, newRating);
          //   } else {
          //     console.warn("handleUpdateRating function not provided in table meta.");
          //   }
          // }}
          maxStars={5}
          // disabled={!canUpdate}
        />
      );
    },
    footer: "RATING",
    enableSorting: true,
    enableHiding: true,
  },

  // 8) LOCATION (country/region + city)
  {
    header: "LOCATION",
    accessorFn: (r) => ({
      city: r.city ?? "N/A",
      countryCode: r.location_country ?? "",
    }),
    cell: ({ getValue }) => {
      const { city, countryCode } = getValue() as { city: string; countryCode: string };
      const flagUrl = countryCode ? getFlagImage(countryCode) : '';

      return (
        <div className="flex items-center gap-2 whitespace-nowrap"> {/* Added whitespace-nowrap */}
          {flagUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="size-5 rounded-full overflow-hidden flex items-center justify-center border border-gray-200 flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <img
                      src={flagUrl}
                      alt={countryCode}
                      className="size-full object-cover"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{countryCode}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="overflow-hidden text-ellipsis">{city}</span> {/* Added overflow-hidden and text-ellipsis for city name */}
        </div>
      );
    },
    footer: "LOCATION",
  },

  // 9) PHONE
  {
    header: "PHONE",
    accessorFn: (r) => r.contact?.phoneNumber ?? "N/A",
    footer: "PHONE",
  },

  // 10) TOTAL BLOCKS (with Tooltip)
  {
    header: "TOTAL BLOCKS",
    accessorFn: (r) => r.details?.totalBlocksWithRooms != null ? String(r.details.totalBlocksWithRooms) : "N/A",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{value}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total Blocks: {value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    footer: "TOTAL BLOCKS",
  },

  // 11) TOTAL ROOMS (with Tooltip)
  {
    header: "TOTAL ROOMS",
    accessorFn: (r) => r.details?.totalRooms != null ? String(r.details.totalRooms) : "N/A",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{value}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total Rooms: {value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    footer: "TOTAL ROOMS",
  },

  // 12) ROOM CLASSIFICATION
  {
    header: "ROOM CLASSIFICATION",
    accessorFn: (r) => r.roomClassification ?? "N/A",
    cell: ({ getValue }) => { // Added cell function
      const classification = getValue() as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] inline-block"> {/* Added styling for overflow */}
                {classification}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{classification}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    footer: "ROOM CLASSIFICATION",
  },

  // 13) STATUS (as Dropdown)
  {
    header: "STATUS",
    accessorFn: (r) => {
      const isOutOfOrder = (r as any).isOutOfOrder;
      const isOutOfService = (r as any).isOutOfService;
      if (isOutOfOrder && isOutOfService) return "Out of Order / Service";
      if (isOutOfOrder) return "Out of Order";
      if (isOutOfService) return "Out of Service";
      return "Operational";
    },
    cell: ({ row, getValue, table: { options } }) => {
      const currentStatus = getValue() as string;
      const { handleUpdatePropertyStatus, has }: any = options.meta;
      const canUpdate = has(["property:updateStatus"]);

      const statuses = [
        "Operational",
        "Out of Order",
        "Out of Service",
        "Out of Order / Service",
      ];

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled={!canUpdate}
            >
              {currentStatus}
              <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => {
                  if (canUpdate && handleUpdatePropertyStatus) {
                    handleUpdatePropertyStatus(row.original.id, status);
                  }
                }}
                disabled={status === currentStatus}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    footer: "STATUS",
  },

  // 14) Actions: view / update / delete
  {
    id: "actions",
    header: "",
    footer: "",
    enableSorting: false,
    enableHiding: false,
    accessorKey: "id",
    cell: (ctx) => {
      const { handleView, handleUpdate, handleDelete, has }: any =
        ctx.table.options.meta;
      const id = ctx.getValue() as string;

      return (
        <div className="flex items-center justify-end gap-3">
          {has(["room:read"]) && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleView(id)}
              className="size-7 text-foreground/80 transition hover:text-primary hover:border-primary"
            >
              <HiOutlineEye className="size-4" />
            </Button>
          )}
          {has(["room:update"]) && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleUpdate(id)}
              className="size-7 text-foreground/80 transition hover:text-primary hover:border-primary"
            >
              <HiOutlinePencil className="size-4" />
            </Button>
          )}
          {has(["room:delete"]) && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDelete(id)}
              className="size-7 text-foreground/80 transition hover:text-primary hover:border-primary"
            >
              <HiOutlineTrash className="size-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];