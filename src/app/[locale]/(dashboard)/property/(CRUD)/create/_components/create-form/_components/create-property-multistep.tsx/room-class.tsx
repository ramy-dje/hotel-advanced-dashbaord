import { RoomType, RoomRating } from "@/interfaces/property.interface";
import { RoomTypeCard } from "./room-type-card";
import { useDroppable } from "@dnd-kit/core";
import { FaTrophy } from "react-icons/fa6";
import { TrophySVGIcon } from "@/components/app-icon/icons";

type RoomClassProps = {
    cls: RoomRating;
    roomTypes: RoomType[]
    color?: string;
    secondary?: string;
}

export function RoomClass({ cls, roomTypes, color, secondary }: RoomClassProps) {
    const { setNodeRef } = useDroppable({
        id: cls.id,
    })

    return (
        <div className="border-b flex justify-between mr-2">
            <div
                className="flex items-center justify-center rounded-full w-16 h-16 mr-4 shrink-0"
                style={{ backgroundColor: secondary }}
            >
                <TrophySVGIcon size={36} color={color} />
            </div>



            <div ref={setNodeRef} className="flex items-center gap-2 h-20 w-full">
                {roomTypes.map((roomType) => (
                    <RoomTypeCard key={roomType.id} type={roomType} />
                ))}
            </div>
            <h2 className="whitespace-nowrap">{cls.title}</h2>
        </div>
    )
};
