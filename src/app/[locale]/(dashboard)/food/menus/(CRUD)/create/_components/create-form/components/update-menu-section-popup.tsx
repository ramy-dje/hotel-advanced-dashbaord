"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useController, useForm } from "react-hook-form";
import { HiOutlineX, HiStar } from "react-icons/hi";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { z } from "zod";
import FoodDishInterface from "@/interfaces/food-dish.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn, generateSimpleId } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export const UpdateMenuSectionSchema = z
  .object({
    title: z.string().min(1, "The section title should is required"),
    sub_title: z.string(),
    description: z.string(),
    featuredDish: z.string(),
  })
  .strict();

export type UpdateMenuSectionSchemaType = z.infer<
  typeof UpdateMenuSectionSchema
>;

interface Props {
  // dishes
  dishes: FoodDishInterface[];
  // model open state
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // old section
  oldSection: {
    title: string;
    id: string;
    des: string;
    sub_title: string;
    notes: { name: string; id: string }[];
    dishes: { name: string; id: string }[];
    featuredDish: string;
  } | null;
  updateSection: (
    id: string,
    s: {
      title: string;
      id: string;
      des: string;
      sub_title: string;
      notes: { name: string; id: string }[];
      dishes: { name: string; id: string }[];
      featuredDish: string;
    }
  ) => void;
}

export default function UpdateMenuSectionPopup({
  dishes,
  oldSection,
  updateSection,
  open,
  setOpen,
}: Props) {
  // form hook
  const {
    register,
    trigger,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<UpdateMenuSectionSchemaType>({
    resolver: zodResolver(UpdateMenuSectionSchema),
    defaultValues: {
      description: "",
    },
  });
  // chosen dishes
  const [dishesList, setDishesList] = useState<{ id: string; name: string }[]>(
    []
  );

  // notes
  const [notesList, setNotesList] = useState<{ id: string; name: string }[]>(
    []
  );

  // note input ref
  const note_input_ref = useRef<HTMLInputElement>(null);

  // selected dish
  const [selectedDish, setSelectedDish] = useState("");
  // featured dish
  const featuredDish_controller = useController({
    control,
    defaultValue: "",
    name: "featuredDish",
  });

  const handleUpdate = async () => {
    if (!oldSection) return;
    // trigger the form validation
    const result = await trigger();
    if (!result) return;

    // getting the data
    const data: UpdateMenuSectionSchemaType = getValues();
    // handle update section
    updateSection(oldSection.id, {
      des: data.description,
      dishes: dishesList,
      featuredDish: data.featuredDish,
      id: oldSection.id,
      notes: notesList,
      sub_title: data.sub_title,
      title: data.title,
    });
    // close the model
    setOpen(false);
  };

  // set the old section data to the form
  useEffect(() => {
    if (oldSection) {
      setDishesList(oldSection.dishes);
      setNotesList(oldSection.notes);
      setValue("description", oldSection.des);
      setValue("title", oldSection.title);
      setValue("sub_title", oldSection.sub_title);
      setValue("featuredDish", oldSection.featuredDish);
    }
  }, [oldSection]);

  // methods

  // add key
  const handleAddDish = () => {
    if (selectedDish) {
      const selected_dish = dishes.find((e) => e.id == selectedDish)!;

      setDishesList((keys) => [
        ...keys,
        {
          id: selected_dish.id,
          name: selected_dish.name,
        },
      ]);

      setSelectedDish("");
    }
  };

  // remove dish
  const handelRemoveDish = (id: string) => {
    // check if it the featured dish id
    if (featuredDish_controller.field.value == id) {
      featuredDish_controller.field.onChange("");
    }
    setDishesList((dishes) => dishes.filter((dish) => dish.id !== id));
  };

  // add note
  const handleAddNote = () => {
    if (
      note_input_ref.current?.value &&
      note_input_ref.current?.value.trim() &&
      note_input_ref.current?.value.trim().length >= 2
    ) {
      const name = note_input_ref.current.value.trim();
      setNotesList((notes) => [
        ...notes,
        {
          id: generateSimpleId(),
          name: name as string,
        },
      ]);

      note_input_ref.current.value = "";
    }
  };

  // remove note
  const handelRemoveNote = (id: string) => {
    setNotesList((notes) => notes.filter((note) => note.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[40em] overflow-y-auto max-h-[33em] ">
        {" "}
        <div className="w-full h-full flex flex-col gap-6 justify-between">
          <DialogHeader>
            <DialogTitle>Edit Menu Section</DialogTitle>
          </DialogHeader>
          <div className="h-full flex flex-col gap-4">
            {/* main info */}
            <div className="w-full flex flex-col gap-3">
              {/* title and subtitle */}
              <div className="flex flex-col lg:flex-row items-start gap-3">
                <div className="w-full lg:w-1/2 grid gap-2">
                  <Label htmlFor="title">Section Title</Label>
                  <Input
                    id="title"
                    placeholder="Name"
                    {...register("title", { required: true })}
                  />
                  {errors?.title ? (
                    <InlineAlert type="error">
                      {errors.title.message}
                    </InlineAlert>
                  ) : null}
                </div>
                {/* subtitle */}
                <div className="w-full lg:w-1/2 grid gap-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subittle"
                    placeholder="Subtitle"
                    {...register("sub_title", { required: true })}
                  />
                  {errors?.sub_title ? (
                    <InlineAlert type="error">
                      {errors.sub_title.message}
                    </InlineAlert>
                  ) : null}
                </div>
              </div>
              {/* descriptions */}
              <div className="w-full grid gap-2">
                <Label htmlFor="name">Description</Label>
                <Textarea
                  spellCheck="false"
                  id="description"
                  className="resize-none h-[4em]"
                  placeholder="Description"
                  {...register("description", { required: true })}
                />
                {errors?.description ? (
                  <InlineAlert type="error">
                    {errors.description.message}
                  </InlineAlert>
                ) : null}
              </div>
            </div>
            {/* menu notes */}
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="notes">Notes</Label>
              <div className="w-full flex items-center gap-3 mb-1">
                <Input
                  id="notes"
                  placeholder="Note"
                  className="w-full"
                  ref={note_input_ref}
                />
                <Button type="button" onClick={handleAddNote}>
                  Add Note
                </Button>
              </div>
              {/* notes */}
              <div className="w-full flex items-center flex-wrap gap-3">
                {notesList.map((note) => (
                  <Badge
                    key={note.id}
                    variant="outline"
                    className="rounded-full gap-2 text-sm font-normal"
                  >
                    {note.name}
                    <button
                      onClick={() => handelRemoveNote(note.id)}
                      type="button"
                      className="text-foreground/60 hover:text-foreground/100"
                    >
                      <HiOutlineX className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            {/* menu dishes */}
            <div className="w-full flex flex-col gap-2">
              <Label htmlFor="dishes">Dishes</Label>
              <div className="w-full flex items-center gap-3">
                <Select
                  value={selectedDish}
                  onValueChange={(e) => setSelectedDish(e)}
                >
                  <SelectTrigger id="dishes" className="w-full">
                    <SelectValue placeholder="Choose dish" />
                  </SelectTrigger>
                  <SelectContent>
                    {dishes
                      ? dishes.map((dish) => (
                          <SelectItem
                            disabled={(() => {
                              return dishesList
                                .map((e) => e.id)
                                .includes(dish.id);
                            })()}
                            key={dish.id}
                            value={dish.id}
                          >
                            {dish.name}
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
                {/* add dish */}
                <Button type="button" onClick={handleAddDish}>
                  Add Dish
                </Button>
              </div>
              {/* dish */}
              <div className="w-full flex items-center flex-wrap gap-3 mt-1">
                {dishesList.map((dish) => (
                  <Badge
                    key={dish.id}
                    variant="outline"
                    className="group rounded-full gap-2 text-sm font-normal"
                  >
                    <HiStar
                      onClick={() =>
                        !(featuredDish_controller.field.value == dish.id) &&
                        featuredDish_controller.field.onChange(dish.id)
                      }
                      className={cn(
                        "size-[1.2rem] cursor-pointer hover:scale-110  text-gray-300 dark:text-gray-800 group-hover:text-gray-400 group-hover:dark:text-gray-700 transition-colors",
                        featuredDish_controller.field.value == dish.id &&
                          "text-yellow-500 group-hover:text-yellow-500"
                      )}
                    />
                    {dish.name}
                    <button
                      onClick={() => handelRemoveDish(dish.id)}
                      type="button"
                      className="text-foreground/60 hover:text-foreground/100"
                    >
                      <HiOutlineX className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
              {/* featured dish error */}
              {errors?.featuredDish ? (
                <InlineAlert type="error">
                  {errors.featuredDish.message}
                </InlineAlert>
              ) : null}
            </div>
          </div>

          {/* the footer */}
          <DialogFooter className="justify-end gap-1">
            <DialogClose asChild>
              <Button className="lg:w-[6em]" type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleUpdate} className="lg:w-[6em]" type="button">
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
