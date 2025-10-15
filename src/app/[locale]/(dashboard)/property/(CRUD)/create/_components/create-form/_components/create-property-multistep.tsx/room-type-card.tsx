import { RoomType } from "@/interfaces/property.interface"
import { useDraggable } from "@dnd-kit/core"

type RoomTypeProps = {
    type: RoomType
}

export function RoomTypeCard({ type }: RoomTypeProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: type.id
    });

    const style = transform
        ? { transform: `translate(${transform.x}px, ${transform.y}px)`, transition: "0.2s" }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={style}
            className="cursor-grab flex items-center justify-center rounded-full bg-blue-200 pt-2 pb-2 pl-4 pr-4 shadow-sm hover:shadow-md"
        >
            <h3 className="font-medium text-sm text-center">
                {type.typeName}
            </h3>
        </div>
    )
}
