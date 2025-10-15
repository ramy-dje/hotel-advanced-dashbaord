import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import {
    CreationFormSection,
    CreationFormSectionContent,
    CreationFormSectionInfo,
    CreationFormSectionInfoTitle,
    CreationFormSectionInfoDescription,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MapPinSelector from "@/components/map";
import { MdList, MdTextFields } from 'react-icons/md';

interface Props {
    id: string;
}

const CreateProperty_Features_Section: React.FC<Props> = ({ id }) => {
    const { control, register, setValue, getValues } = useFormContext();
    const [viewMode, setViewMode] = useState<"list" | "text">("text");

    // Reusable FieldArray
    const createFieldArray = (name: string) => useFieldArray({ control, name });
    const featureFields = createFieldArray("houseFeatures");
    const viewFields = createFieldArray("houseViewList");
    const nearbyFields = createFieldArray("nearbyLocations");

    // Generic renderer for field arrays
    const renderFields = (
        fields: any[],
        namePrefix: string,
        placeholders: string[],
        removeFn: (index: number) => void
    ) => (
        <div className="space-y-2">
            {fields.map((field, idx) => (
                <div key={field.id} className="flex gap-2 w-full">
                    {placeholders.map((placeholder, index) => (
                        <Input
                            key={index}
                            className="w-full"
                            placeholder={placeholder}
                            {...register(`${namePrefix}.${idx}.${index === 0 ? 'key' : 'value'}`)}
                        />
                    ))}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFn(idx)}
                    >
                        Remove
                    </Button>
                </div>
            ))}
        </div>
    );

    // Toggle button for view modes
    const ToggleButton = ({ mode, icon: Icon }: { mode: "list" | "text"; icon: React.ComponentType<any> }) => (
        <Button
            size="xs"
            variant={viewMode === mode ? "secondary" : "outline"}
            onClick={() => setViewMode(mode)}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    return (
        <CreationFormSection id={`${id}-features`}>
            <CreationFormSectionInfo>
                <CreationFormSectionInfoTitle>Property Features</CreationFormSectionInfoTitle>
                <CreationFormSectionInfoDescription>
                    Define key features, views, and nearby points of interest.
                </CreationFormSectionInfoDescription>
            </CreationFormSectionInfo>

            <CreationFormSectionContent>
                {/* House Features */}
                <div className="mb-6 col-span-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-lg">House Features</Label>
                        <Button size="sm" onClick={() => featureFields.append({ key: "", value: "" })}>
                            Add Feature
                        </Button>
                    </div>
                    {featureFields.fields.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground">
                            No features added yet.
                        </p>
                    ) : (
                        renderFields(
                            featureFields.fields,
                            "houseFeatures",
                            ["Feature (e.g. Bedrooms)", "Value (e.g. 3)"],
                            featureFields.remove
                        )
                    )}
                </div>

                {/* House Views */}
                <div className="mb-6 col-span-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-lg">House Views</Label>
                        <div className="flex space-x-1">
                            <ToggleButton mode="list" icon={MdList} />
                            <ToggleButton mode="text" icon={MdTextFields} />
                        </div>
                    </div>

                    {viewMode === "text" ? (
                        <Textarea
                            className="w-full"
                            placeholder="Describe views in free-form text..."
                            {...register("houseViewsText")}
                            rows={3}
                        />
                    ) : (
                        <>
                            {renderFields(
                                viewFields.fields,
                                "houseViewList",
                                ["View (e.g. Sea)", "Description (e.g. Panoramic sea view)"],
                                viewFields.remove
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => viewFields.append({ key: "", value: "" })}
                            >
                                Add View
                            </Button>
                        </>
                    )}
                </div>

                {/* Nearby Locations */}
                <div className="mb-6 col-span-2">
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-lg">Nearby Locations</Label>
                        <Button
                            size="sm"
                            onClick={() => nearbyFields.append({ label: "", distance: "", coordinates: null })}
                        >
                            Add Nearby
                        </Button>
                    </div>
                    {nearbyFields.fields.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground">
                            No nearby locations added yet.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {renderFields(
                                nearbyFields.fields,
                                "nearbyLocations",
                                ["Place (e.g. Grocery Store)", "Distance (e.g. 200m)"],
                                nearbyFields.remove
                            )}
                            {/* Map Selector */}
                            {/* <MapPinSelector
                                coordinatesList={
                                    getValues("nearbyLocations")
                                        ?.filter(loc => loc?.coordinates)
                                        ?.map(loc => loc.coordinates) || []
                                }
                                onMapClick={(coords) => {
                                    nearbyFields.append({ label: "", distance: "", coordinates: coords });
                                }}
                                height="300px"
                                zoom={14}
                            /> */}
                        </div>
                    )}

                    {/* <MapPinSelector
                        coordinatesList={
                            getValues("nearbyLocations")
                                ?.filter(loc => loc?.coordinates)
                                ?.map(loc => loc.coordinates) || []
                        }
                        onMapClick={(coords) => {
                            nearbyFields.append({ label: "", distance: "", coordinates: coords });
                        }}
                        height="300px"
                        zoom={14}
                    /> */}
                </div>
            </CreationFormSectionContent>
        </CreationFormSection>
    );
};

export default CreateProperty_Features_Section;
