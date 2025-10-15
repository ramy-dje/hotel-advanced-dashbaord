import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

// Removed react-icons due to resolution resolution error, using inline SVGs instead
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

// Basic InlineAlert implementation
function InlineAlert({ type, children }: { type: 'error' | 'info' | 'success'; children: React.ReactNode }) {
    let bgColor = 'bg-red-100';
    let textColor = 'text-red-700';
    if (type === 'info') {
        bgColor = 'bg-blue-100'; textColor = 'text-blue-700';
    } else if (type === 'success') {
        bgColor = 'bg-green-100'; textColor = 'text-green-700';
    }
    return (
        <div className={`p-3 rounded-md text-sm ${bgColor} ${textColor}`}>
            {children}
        </div>
    );
}

// Bed interfaces
interface Bed { id: string; name: string; iconPath: string; }
interface SelectedBed extends Bed { quantity: number; }
interface AddBedsPopupProps {
    onSave: (beds: SelectedBed[]) => void;
    initialSelectedBeds?: SelectedBed[];
    trigger: React.ReactNode; // New prop for custom trigger element
}

// --- Bed Icon Paths (Provided by User) ---
// These paths are assumed to be accessible from the root of the application
const BED_ICONS_PATHS = [
    "/beds-icons/Baby crib.svg",
    "/beds-icons/bunk bed.svg",
    "/beds-icons/Double bed.svg",
    "/beds-icons/floor mattress.svg",
    "/beds-icons/hammock.svg",
    "/beds-icons/king bed.svg",
    "/beds-icons/queen bed.svg",
    "/beds-icons/single bed.svg",
    "/beds-icons/sofa.svg",
    "/beds-icons/sofa bed.svg",
    "/beds-icons/toddler bed.svg",
    "/beds-icons/Twin bed.svg",
];

// Helper function to create available bed objects from paths
const createAvailableBeds = (): Bed[] => BED_ICONS_PATHS.map(path => {
    // Extract file name from path
    const fileName = path.split('/').pop() || '';
    // Clean up file name to create a human-readable name (e.g., "Baby crib" from "Baby crib.svg")
    const name = fileName.replace(/\.svg$/, '').replace(/-/g, ' ');
    // Create a unique ID for the bed type
    const id = name.toLowerCase().replace(/\s/g, '-');
    return { id, name, iconPath: path };
});

const availableBeds: Bed[] = createAvailableBeds();

// BedItem component for displaying individual bed types and managing quantity
interface BedItemProps {
    bed: Bed;
    quantity: number;
    onQuantityChange: (id: string, qty: number) => void;
    disabled?: boolean;
}
function BedItem({ bed, quantity, onQuantityChange, disabled }: BedItemProps) {
    // Decrements bed quantity, ensuring it doesn't go below 0
    const handleDecrement = () => quantity > 0 && onQuantityChange(bed.id, quantity - 1);
    // Increments bed quantity
    const handleIncrement = () => onQuantityChange(bed.id, quantity + 1);
    // Handles direct input change for quantity
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = parseInt(e.target.value, 10);
        // Ensure value is a valid non-negative number
        value = isNaN(value) || value < 0 ? 0 : value;
        onQuantityChange(bed.id, value);
    };

    return (
        <div className="flex flex-col items-center p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-all">
            {/* Adjusted icon size to w-10 h-10 for smaller icons */}
            <img
                src={bed.iconPath}
                alt={bed.name}
                className="w-10 h-10 mb-2 select-none" // Added select-none here
                // Fallback for broken image paths
                onError={e => e.currentTarget.src = 'https://placehold.co/64x64/E0E0E0/333333?text=🚫'}
                style={{ pointerEvents: 'none' }} // Prevent image dragging/selection
            />
            <span className="text-sm font-medium text-center mb-3 select-none">{bed.name}</span>
            <div className="flex items-center gap-2 w-full max-w-[120px]">
                <Button type="button" onClick={handleDecrement} disabled={disabled || quantity === 0} variant="outline" size="icon" className="w-8 h-8 rounded-full">
                    {/* SVG for minus icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 select-none" style={{ pointerEvents: 'none' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                </Button>
                <Input
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                    // Added a custom Tailwind class to hide spinner arrows for number input
                    className="w-12 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    disabled={disabled}
                    min={0}
                />
                <Button type="button" onClick={handleIncrement} disabled={disabled} variant="outline" size="icon" className="w-8 h-8 rounded-full">
                    {/* SVG for plus icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 select-none" style={{ pointerEvents: 'none' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </Button>
            </div>
        </div>
    );
}

// Main AddBedsPopup component
export default function AddBedsPopup({ onSave, initialSelectedBeds = [], trigger }: AddBedsPopupProps) {
    const [open, setOpen] = useState(false);
    const [currentPopupBeds, setCurrentPopupBeds] = useState<SelectedBed[]>([]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Effect to initialize currentPopupBeds when the dialog opens or initialSelectedBeds change
    useEffect(() => {
        if (!open) return; // Only re-initialize if the dialog is open

        const initMap = new Map<string, SelectedBed>();
        initialSelectedBeds.forEach(b =>
            initMap.set(b.id, { ...b, quantity: Number(b.quantity) || 0 })
        );
        const prepopulated = availableBeds
            .filter(b => initMap.has(b.id))
            .map(b => ({ ...b, quantity: initMap.get(b.id)!.quantity }));
        setCurrentPopupBeds(prepopulated);
        setError(""); // Clear any previous errors
    }, [open, initialSelectedBeds]); // Depend on 'open' and 'initialSelectedBeds'


    // Callback to handle quantity changes for beds
    const handleQuantityChange = useCallback((id: string, qty: number) => {
        setCurrentPopupBeds(prev => {
            const bedDetail = availableBeds.find(b => b.id === id);
            if (!bedDetail) return prev; // If bed not found, return previous state

            const existsIndex = prev.findIndex(b => b.id === id);

            if (qty <= 0) {
                // If quantity is 0 or less, remove the bed from selected beds
                return existsIndex === -1 ? prev : prev.filter(b => b.id !== id);
            }

            const updated = [...prev]; // Create a mutable copy
            if (existsIndex !== -1) {
                // If bed already exists in selected, update its quantity
                updated[existsIndex].quantity = qty;
            } else {
                // If new bed, add it to selected beds
                updated.push({ ...bedDetail, quantity: qty });
            }
            return updated;
        });
    }, []);

    // Handle double-click to remove a bed from the preview
    const handleRemoveBedFromPreview = useCallback((bedId: string, bedName: string) => {
        handleQuantityChange(bedId, 0); // Set quantity to 0 to remove it
        toast.success(`${bedName} removed from selection.`); // Show a success message
    }, [handleQuantityChange]);


    // Handles the save action
    const handleSave = () => {
        setIsSubmitting(true);
        // Validate if at least one bed type is selected
        if (currentPopupBeds.length === 0) {
            setError("Please select at least one bed type.");
            setIsSubmitting(false);
            return;
        }
        try {
            onSave(currentPopupBeds); // Call the onSave prop with the selected beds
            toast.success("Bed types updated successfully!"); // Show success notification
            setOpen(false); // Close the dialog
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
                // When dialog opens, initialize currentPopupBeds from initialSelectedBeds
                // When dialog closes, no need to reset here, as the parent will control state via initialSelectedBeds
            }}
        >
            {/* The trigger for the dialog is now passed as a prop */}
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            {/* Dialog content with scrollability and adjusted max-width */}
            <DialogContent
                preventOutsideClose={isSubmitting}
                closeButtonDisabled={isSubmitting}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto" // Added overflow-y-auto for scrollability
            >
                <DialogHeader><DialogTitle>Add/Configure Beds</DialogTitle></DialogHeader>

                {/* Preview Section */}
                <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold flex items-center gap-2 mb-2 select-none">
                        {/* Display total number of beds */}
                        Selected Beds ({currentPopupBeds.reduce((s, b) => s + b.quantity, 0)})
                        {currentPopupBeds[0] && <img src={currentPopupBeds[0].iconPath} alt="" className="w-5 h-5 opacity-70 select-none" style={{ pointerEvents: 'none' }} />}
                    </h3>
                    {currentPopupBeds.length === 0 ? (
                        <p className="italic text-center select-none">No beds selected.</p>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500 text-center mb-2 select-none">Double-click any selected bed to remove it.</p>
                            <div className="flex flex-wrap gap-4 justify-start">
                                {currentPopupBeds.map(b => (
                                    <div
                                        key={b.id}
                                        className="flex flex-col items-center p-2 border rounded-md bg-gray-100 shadow-sm min-w-[80px] cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all" /* Changed bg-white to bg-gray-100 */
                                        onDoubleClick={() => handleRemoveBedFromPreview(b.id, b.name)}
                                    >
                                        <img src={b.iconPath} alt={b.name} className="w-8 h-8 mb-2 select-none" style={{ pointerEvents: 'none' }} />
                                        <span className="text-xs font-medium text-center select-none">{b.name}</span>
                                        <span className="text-sm font-bold select-none">{b.quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Horizontal line to separate preview and grid */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Grid of available beds */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {availableBeds.map(b => (
                        <BedItem
                            key={b.id}
                            bed={b}
                            quantity={currentPopupBeds.find(x => x.id === b.id)?.quantity || 0}
                            onQuantityChange={handleQuantityChange}
                            disabled={isSubmitting}
                        />
                    ))}
                </div>

                {/* Error alert */}
                {error && <InlineAlert type="error">{error}</InlineAlert>}

                {/* Dialog Footer with action buttons */}
                <DialogFooter className="justify-end">
                    <DialogClose asChild><Button variant="outline" disabled={isSubmitting}>Cancel</Button></DialogClose>
                    {/* The 'isLoading' prop is not standard for shadcn/ui Button, assuming a custom implementation */}
                    <Button onClick={handleSave} disabled={isSubmitting}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
