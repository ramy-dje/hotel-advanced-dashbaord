// src/app/path-to-your-form/_components/bedroom-bed-configuration.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming shared Button component from shadcn/ui
import { Label } from "@/components/ui/label"; // Assuming shared Label component
import AddBedsPopup from "./beds-details.popup.tsx"; // Ensured .tsx extension is present for explicit resolution

// Re-define interfaces for clarity or import them if they are in a shared types file
interface Bed { id: string; name: string; iconPath: string; }
interface SelectedBed extends Bed { quantity: number; }

interface BedroomBedConfigurationProps {
    bedroomIndex: number; // The index of the bedroom (e.g., 0 for Bedroom 1, 1 for Bedroom 2)
    initialBeds: SelectedBed[]; // The beds currently configured for this bedroom
    onSave: (beds: SelectedBed[]) => void; // Callback to save beds for this specific bedroom
    disabled?: boolean; // Whether the configuration should be disabled (e.g., when submitting form)
}

const BedroomBedConfiguration = ({
    bedroomIndex,
    initialBeds,
    onSave,
    disabled
}: BedroomBedConfigurationProps) => {
    // Calculate the total number of beds in this specific bedroom
    const totalBedsInBedroom = initialBeds.reduce((sum, b) => sum + b.quantity, 0);
    // Determine the number of distinct bed types selected
    const distinctBedTypesCount = initialBeds.length;
    // Calculate how many more distinct bed types there are beyond the first 3 to show "+N more"
    const moreBedTypes = distinctBedTypesCount > 3 ? distinctBedTypesCount - 3 : 0;


    return (
        <div className="flex flex-col gap-2">
            {/* The AddBedsPopup component is now controlled by this component,
                which passes a custom trigger element (the "card" itself) */}
            <AddBedsPopup
                onSave={onSave} // Pass the onSave callback to update this bedroom's beds
                initialSelectedBeds={initialBeds} // Pass the current beds for this bedroom
                // Custom trigger element for the dialog, acting as a mini-preview card
                trigger={
                    <div
                        // Card styling: Centered content, border, background, shadow, and hover effects
                        // Removed hover:bg-gray-100 as requested
                        className={`w-full flex flex-col items-center p-4 rounded-lg border border-gray-200 bg-white shadow-sm
                            transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        role="button" // Indicate it's a clickable element for accessibility
                        tabIndex={disabled ? -1 : 0} // Make it focusable if not disabled
                    >
                        {/* Bedroom Name / Number */}
                        <h4 className="text-lg font-semibold mb-3 select-none" style={{ pointerEvents: 'none' }}>
                            Bedroom {bedroomIndex + 1}
                        </h4>

                        {/* This div ensures a consistent height for the icon/message area */}
                        <div className="flex flex-col items-center justify-center w-full min-h-[80px] mb-3">
                            {initialBeds.length > 0 ? (
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                                    {/* Display first 3 icons with names below */}
                                    {initialBeds.slice(0, 3).map((b) => (
                                        <div key={b.id} className="flex flex-col items-center">
                                            <img
                                                src={b.iconPath}
                                                alt={b.name}
                                                className="inline-block h-10 w-10 select-none"
                                                onError={e => e.currentTarget.src = 'https://placehold.co/40x40/E0E0E0/333333?text=🚫'}
                                                style={{ pointerEvents: 'none' }}
                                            />
                                            <span className="text-xs text-center mt-1 select-none" style={{ pointerEvents: 'none' }}>
                                                {b.name}
                                            </span>
                                        </div>
                                    ))}
                                    {/* Show "+N more" if there are more than 3 distinct bed types */}
                                    {moreBedTypes > 0 && (
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="inline-block h-10 w-10 bg-gray-200 text-gray-700 text-sm flex items-center justify-center font-bold select-none" style={{ pointerEvents: 'none' }}>
                                                +{moreBedTypes}
                                            </span>
                                            <span className="text-xs text-center mt-1 select-none" style={{ pointerEvents: 'none' }}>
                                                more
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Message when no beds are configured for this bedroom
                                <p className="text-gray-500 italic text-center select-none" style={{ pointerEvents: 'none' }}>No beds configured for this bedroom.</p>
                            )}
                        </div>

                        {/* Edit Beds Button */}
                        <Button
                            type="button"
                            variant="ghost" // Changed variant from outline to ghost to remove border
                            size="sm"
                            className="w-full mt-auto"
                            disabled={disabled}
                        >
                            Edit Beds ({totalBedsInBedroom})
                        </Button>
                    </div>
                }
            />
        </div>
    );
};

export default BedroomBedConfiguration;
