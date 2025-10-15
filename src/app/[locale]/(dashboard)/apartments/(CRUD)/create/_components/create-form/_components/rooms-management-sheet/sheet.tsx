"use client";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { RiSparkling2Fill } from "react-icons/ri";
import ManageRooms from "./components/manage-rooms-form";
import PropertyInterface from "@/interfaces/property.interface";
import ManageRoomsTableForm from "./components/manage-rooms-table-form";
import { LucideTable } from "lucide-react";
import { BiCollection } from "react-icons/bi";
// Create reservation sheet
type CreateReservationSheetProps = {
    blockIndex: number;
    hasRooms?: boolean;
    hasFacilities?: boolean;
    selectedPropertyDetails: PropertyInterface | undefined;
}

const ManageRoomsSheet: React.FC<CreateReservationSheetProps> = ({ blockIndex, hasRooms, hasFacilities, selectedPropertyDetails }) => {

    const [createReservationOpen, setCreateReservationOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formVariation, setFormVariation] = useState<"bulk" | "table">("bulk");

    console.log("selectedPropertyDetails", selectedPropertyDetails);

    return (
        <Sheet open={createReservationOpen} onOpenChange={setCreateReservationOpen}>
            <SheetTrigger asChild>
                <Button className="gap-2 font-normal w-1/2 md:w-auto" variant={"outline"}>
                    {/* <HiOutlinePlus className="size-4" /> New Floors */}
                    <RiSparkling2Fill /> Manage Rooms For {selectedPropertyDetails?.propertyName || "Property"}
                    {isLoading && <span className="ml-2">Loading...</span>}
                </Button>
            </SheetTrigger>
            <SheetContent
                preventOutsideClose
                closeButtonDisabled={isLoading}
                side="right_big"
                className="!w-[82vw]"
                bigCloseSizes
            >
                <SheetHeader className="flex items-center justify-between w-full flex-row pt-6 px-4 pb-2">
                    <SheetTitle className="text-2xl font-bold text-gray-900 mb-2">
                        Manage Apartmets For {selectedPropertyDetails?.propertyName || "Property"}{" "}
                        {selectedPropertyDetails?.code && `(${selectedPropertyDetails?.code})`}</SheetTitle>
                    {/* <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                            setFormVariation(formVariation === "bulk" ? "table" : "bulk");
                        }}
                    >
                        {formVariation === "bulk" ? <LucideTable className="w-4 h-4" /> : <BiCollection className="w-4 h-4" />}
                    </Button> */}

                </SheetHeader>
                {/* <ManageRooms selectedPropertyDetails={selectedPropertyDetails}
                        />  */}
                <div className="overflow-scroll h-[100%]">

                    {formVariation == "bulk" ?
                        <ManageRooms selectedPropertyDetails={selectedPropertyDetails}
                        /> :
                        <ManageRoomsTableForm />}
                </div>
            </SheetContent>

        </Sheet >
    );
}
export default ManageRoomsSheet;