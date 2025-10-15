import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RoomRating, RoomType } from "@/interfaces/property.interface";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { TrophySVGIcon } from "@/components/app-icon/icons";

// Rating configuration
const ratings: RoomRating[] = [
  {
    id: "class3",
    title: "High End",
    color: "#ff9800",
    secondary: "#ffe082",
  },
  {
    id: "class2",
    title: "Mid Range",
    color: "#4caf50",
    secondary: "#c8e6c9",
  },
  {
    id: "class1",
    title: "Entry Level",
    color: "#2196f3",
    secondary: "#bbdefb",
  }
];

// Card Component
function RoomTypeCard({ type }: { type: RoomType }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: type.id
  });

  const style = transform ? {
    transform: `translate(${transform.x}px, ${transform.y}px)`,
    transition: "0.2s"
  } : undefined;

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
  );
}

// Rating Column Component
function RoomClass({ cls, roomTypes }: { cls: RoomRating; roomTypes: RoomType[] }) {
  const { setNodeRef } = useDroppable({
    id: cls.id,
  });

  return (
    <div className="border-b flex justify-between mr-2">
      <div
        className="flex items-center justify-center rounded-full w-16 h-16 mr-4 shrink-0"
        style={{ backgroundColor: cls.secondary }}
      >
        <TrophySVGIcon size={36} color={cls.color} />
      </div>

      <div 
        ref={setNodeRef} 
        className="flex items-center gap-2 h-20 w-full min-h-[5rem] border border-dashed rounded-lg p-2"
        style={{ backgroundColor: `${cls.secondary}20` }}
      >
        {roomTypes.map((roomType) => (
          <RoomTypeCard key={roomType.id} type={roomType} />
        ))}
      </div>
      <h2 className="whitespace-nowrap">{cls.title}</h2>
    </div>
  );
}

// Main Component
interface Props {
  roomTypes: RoomType[];
  onSave: (updatedTypes: RoomType[]) => void;
}

export default function EditPropertyTypesPopup({ roomTypes, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [types, setTypes] = useState<RoomType[]>([]);

  // Initialize with current data when dialog opens
  useEffect(() => {
    if (open) {
      // Create a new array to ensure we don't mutate original data
      setTypes([...roomTypes]);
    }
  }, [open, roomTypes]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    
    const typeId = active.id as string;
    const newStatus = over.id as RoomType['status'];

    setTypes(prev => 
      prev.map(type => 
        type.id === typeId ? { ...type, status: newStatus } : type
      )
    );
  };

  const handleSave = () => {
    setIsSubmitting(true);
    try {
      // Save updated types to parent component
      onSave(types);
      setOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 font-normal w-1/2 md:w-auto">
          Update Types
        </Button>
      </DialogTrigger>
      
      <DialogContent
        className="max-h-[90vh] max-w-xl overflow-auto"
        onEscapeKeyDown={isSubmitting ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle>Adjust Levels</DialogTitle>
        </DialogHeader>

        <div className="py-4 grid gap-4">
          <DndContext onDragEnd={handleDragEnd}>
            {ratings.map((rating) => (
              <RoomClass
                key={rating.id}
                cls={rating}
                roomTypes={types.filter(t => t.status === rating.id)}
              />
            ))}
          </DndContext>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="yes_no"
            onClick={handleSave}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}