"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef, useEffect, useState, useTransition } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import RoomCategoryInterface from "@/interfaces/room-category.interface";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextEditor from "@/components/text-editor";
import { DebouncedInput } from "@/components/debounced-input";
import PropertyInterface from "@/interfaces/property.interface"; // Make sure this import is correct
import { Loader2 } from "lucide-react";
import useServerTable from "@/hooks/use-server-table";

interface Props {
  id: string;
  categories: RoomCategoryInterface[];
  // --- NEW PROP: Callback function to send selected property details to parent ---
  onPropertySelect: (property: PropertyInterface | null) => void;
}

const CreateRoom_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, categories, onPropertySelect }, ref) => {
    const {
      control,
      formState: { errors, disabled },
      setValue,
      register,
    } = useFormContext<CreateRoomValidationSchemaType>();

    const [isPending, startTransition] = useTransition(); 
    const [propertySearchQuery, setPropertySearchQuery] = useState(""); 

    const [localFetchedProperties, setLocalFetchedProperties] = useState<PropertyInterface[]>([]);
    const [localTotalProperties, setLocalTotalProperties] = useState(0);

    const propertyCode_controller = useController({
      control,
      name: "propertyCode", 
    });

    const property_controller = useController({
      control,
      name: "property", 
    });

    const description_controller = useController({
      control,
      name: "description",
    });

    const category_controller = useController({
      control,
      name: "category",
    });

    useEffect(() => {
      if (category_controller.field.value) {
        const selectedCategory = categories.find(
          (cate) => cate.id == category_controller.field.value
        )!;
        setValue("name", selectedCategory.name);
      }
    }, [category_controller.field.value, categories, setValue]);


    const { isFetching: isPropertySearching } = useServerTable<PropertyInterface>({
      api: {
        url: "property",
      },
      data: localFetchedProperties,
      setData: setLocalFetchedProperties,
      totalData: localTotalProperties,
      setTotalData: setLocalTotalProperties,
      column: [], 
      sorting: {}, 
      initialTable: {}, 
      defaultRowsPerPage: "25", 
      initialPage: 2, 
      search: {
        query: "q", 
        state: propertySearchQuery, 
      },
      onError: (err) => {
        console.error("Error fetching properties for search:", err);
        setLocalFetchedProperties([]);
        onPropertySelect(null); // Clear selected property on search error
      }
    });

    // Effect to automatically select property if only one result is found
    // and to inform parent about selection changes (including clearing)
    useEffect(() => {
      if (localFetchedProperties.length === 1 && propertySearchQuery.trim()) {
        const selectedProp = localFetchedProperties[0];
        setValue("property", selectedProp.id);
        onPropertySelect(selectedProp); // <-- Inform parent about the auto-selected property
      } else {
        const currentSelectionId = property_controller.field.value;
        const isCurrentSelectionValid = localFetchedProperties.some(p => p.id === currentSelectionId);
        
        if (!currentSelectionId || !isCurrentSelectionValid) {
            setValue("property", ""); // Clear the react-hook-form value
            onPropertySelect(null); // <-- Inform parent that no property is selected
        } else {
            // If there's a current selection and it's still valid in the new results,
            // make sure the parent still has its details. This handles cases where
            // the user previously selected something, then searched for something else
            // but the original selection is still in the list.
            const currentlySelectedProp = localFetchedProperties.find(p => p.id === currentSelectionId);
            onPropertySelect(currentlySelectedProp || null);
        }
      }
    }, [localFetchedProperties, propertySearchQuery, setValue, property_controller.field.value, onPropertySelect]);


    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Main Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Write your room name, description and main information from here
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2 relative">
            <Label htmlFor="propertyCode">Search Property (Code or Name)</Label>
            <DebouncedInput
              id="propertyCode"
              type="text"
              disabled={disabled}
              placeholder="Enter property code or name..."
              value={propertyCode_controller.field.value}
              onChange={(e) => {
                propertyCode_controller.field.onChange(e);
                setPropertySearchQuery(e.target.value);
              }}
              debounceTimeout={500} 
            />
            {isPropertySearching && (
              <Loader2 className="animate-spin h-5 w-5 text-blue-500 absolute right-2 top-2 mt-2 mr-2" />
            )}
            {errors?.propertyCode ? (
              <InlineAlert type="error">
                {errors.propertyCode.message}
              </InlineAlert>
            ) : null}
          </div>

          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="property">Select Property</Label>
            <Select
              onValueChange={(selectedId) => {
                property_controller.field.onChange(selectedId); // Update react-hook-form
                
                // --- NEW LOGIC: Find the full property object and send to parent ---
                const selectedProp = localFetchedProperties.find(p => p.id === selectedId);
                onPropertySelect(selectedProp || null); // Pass the full object or null
              }}
              value={property_controller.field.value}
              disabled={disabled || isPropertySearching || localFetchedProperties.length === 0}
            >
              <SelectTrigger id="property" className="w-auto">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {localFetchedProperties.length > 0 ? (
                  localFetchedProperties.map((prop) => (
                    <SelectItem key={prop.id} value={prop.id as string}>
                      {prop.propertyName} ({prop.code})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__no_results__" disabled>
                    No properties found. Search above.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors?.property ? (
              <InlineAlert type="error">{errors.property.message}</InlineAlert>
            ) : null}
          </div>

          {/* Room Name Input (auto-filled by category selection, but still editable) */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="name">Apartment Name</Label>
            <Input
              id="name"
              type="text"
              disabled={disabled}
              placeholder="e.g. Master Suite 1"
              {...register("name")}
            />
            {errors?.name ? (
              <InlineAlert type="error">{errors.name.message}</InlineAlert>
            ) : null}
          </div>

          {/* Category Select */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={category_controller.field.onChange}
              value={category_controller.field.value}
              disabled={disabled}
            >
              <SelectTrigger id="category" className="w-auto">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.category ? (
              <InlineAlert type="error">{errors.category.message}</InlineAlert>
            ) : null}
          </div>


          {/* Type Select */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="type">Type</Label>
            <Select {...register("type")}>
              <SelectTrigger id="type" className="w-auto" disabled={disabled}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
            {errors?.type ? (
              <InlineAlert type="error">{errors.type.message}</InlineAlert>
            ) : null}
          </div>

          {/* Room Code with generate button */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="code">Room Code</Label>{" "}
            <div className="flex gap-2">
              <Input
                id="code"
                type="text"
                disabled={disabled}
                placeholder="Unique Code"
                {...register("code", { required: true })}
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  setValue(
                    "code",
                    Math.random().toString(36).substring(2, 10).toUpperCase()
                  )
                }
                className="px-4 py-2 text-sm bg-gray-200 rounded-md"
              >
                Generate
              </button>
            </div>
            {errors?.code ? (
              <InlineAlert type="error">{errors.code.message}</InlineAlert>
            ) : null}
          </div>

          {/* Room Description */}
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="description">Description</Label>
            <TextEditor
              content={description_controller.field.value}
              setContent={(n) => {
                description_controller.field.onChange(n);
              }}
              disabled={disabled}
              className="col-span-2 h-[7em] mb-[3em]"
              placeholder="Description Of The Room"
            />
            {errors?.description ? (
              <InlineAlert type="error">
                {errors.description.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_MainInformation_Section;