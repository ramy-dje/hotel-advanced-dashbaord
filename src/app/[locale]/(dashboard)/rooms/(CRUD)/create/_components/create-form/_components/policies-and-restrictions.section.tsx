"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleInput } from "@/app/[locale]/(dashboard)/property/(CRUD)/create/_components/create-form/_components/toggle_button"; // Adjust this path if your ToggleInput is elsewhere
import MultipleSelector from "@/components/ui/mutli-select";
import TermsSection from "./_components/terms.section";

// Import the SetPricingPopup component and PropertyInterface
import SetPricingPopup from "./_components/pricing-popup"; // Adjust path as needed
import PropertyInterface from "@/interfaces/property.interface";

// Assuming these interfaces are defined globally or locally as needed
interface Option {
  label: string;
  value: string;
}

interface FeeOption {
  id: string; // Or number, depending on your actual ID type
  name: string; // The display name of the fee
  value: number; // The actual numerical value of the fee
}

// Props for the new component
interface Props {
  id: string;
  damage_fee_options: FeeOption[]; // New prop for damage fee options
  deposit_fee_options: FeeOption[]; // New prop for deposit fee options
  selectedPropertyDetails: PropertyInterface | null; // Add this prop
}

const CreateRoom_PoliciesAndRestrictions_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, damage_fee_options = [], deposit_fee_options = [], selectedPropertyDetails }, ref) => {
    const {
      formState: { errors, disabled },
      control,
      setValue, // We need setValue to update the form field
    } = useFormContext<CreateRoomValidationSchemaType>();

    // 1. Authorized Smoking Area (Yes/No)
    // Handled by ToggleInput internally via its `name` prop

    // 2. Pet Friendly (Yes/No)
    // Handled by ToggleInput internally via its `name` prop

    // 3. Damage Fees (Now a search-enabled select)
    const damage_fees_controller = useController({
      control,
      name: "policies.damageFees",
      defaultValue: [],
    });

    // 4. Deposit Fees (Now a search-enabled select)
    const deposit_fees_controller = useController({
      control,
      name: "policies.dipositFees",
      defaultValue: [],
    });

    // 5. Booking Restrictions (Minimum Nights)
    const minimum_nights_controller = useController({
      control,
      name: "policies.minimumNightStay",
      defaultValue: 1,
    });

    // 6. Room Pricing Controller
    const roomPricing_controller = useController({
      control,
      name: "roomPricing",
      defaultValue: [], // Initialize with an empty array
    });

    // Callback function to receive data from SetPricingPopup
    // This function will update the 'roomPricing' field in the form context
    const handleSaveRoomPricing = (data: typeof roomPricing_controller.field.value) => {
      // The 'data' received from SetPricingPopup should match the RoomPricingSchemaType[]
      roomPricing_controller.field.onChange(data);
    };

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Policies & Restrictions</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Define the booking policies, fees, and specific restrictions for this room.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* 1. Authorized Smoking Area (Yes/No) */}
          <ToggleInput
            name="policies.smokingArea" // Ensure this matches your schema field name
            label="Authorized Smoking Area"
            disabled={disabled}
          />

          {/* 2. Pet Friendly (Yes/No) */}
          <ToggleInput
            name="policies.petsAllowed" // Ensure this matches your schema field name
            label="Pet Friendly"
            disabled={disabled}
          />

          {/* 3. Damage Fees (Now a search-enabled select using MultipleSelector) */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="damage-fees">Damage Fees</Label>
            <MultipleSelector
              id="damage-fees"
              defaultOptions={damage_fee_options.map((fee) => ({
                label: `${fee.name} ($${fee.value})`, // Display name and value
                value: fee.id, // Store the ID in the form data
              }))}
              disabled={disabled}
              className="w-full"
              onChange={(values) => {
                // Assuming damageFees is an array of strings (IDs) in your schema
                damage_fees_controller.field.onChange(values.map(v => v.value));
              }}
              value={
                // Map the current form value (array of IDs) back to MultipleSelector's expected format
                damage_fees_controller.field.value?.map(id => ({
                  label: damage_fee_options.find(opt => opt.id === id)?.name || "",
                  value: id
                })) || []
              }
              placeholder="Search or select damage fee..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  No results found.
                </p>
              }
              // Removed maxSelected={1} as damageFees is defined as z.array(z.string()).optional()
              // If it should be single select, you need to adjust your Zod schema for damageFees to z.string().optional()
            />
            {errors?.policies?.damageFees ? (
              <InlineAlert type="error">{errors.policies.damageFees.message}</InlineAlert>
            ) : null}
          </div>

          {/* 4. Deposit Fees (Now a search-enabled select using MultipleSelector) */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="deposit-fees">Deposit Fees</Label>
            <MultipleSelector
              id="deposit-fees"
              defaultOptions={deposit_fee_options.map((fee) => ({
                label: `${fee.name} ($${fee.value})`, // Display name and value
                value: fee.id, // Store the ID in the form data
              }))}
              disabled={disabled}
              className="w-full"
              onChange={(values) => {
                // Assuming dipositFees is an array of strings (IDs) in your schema
                deposit_fees_controller.field.onChange(values.map(v => v.value));
              }}
              value={
                // Map the current form value (array of IDs) back to MultipleSelector's expected format
                deposit_fees_controller.field.value?.map(id => ({
                  label: deposit_fee_options.find(opt => opt.id === id)?.name || "",
                  value: id
                })) || []
              }
              placeholder="Search or select deposit fee..."
              emptyIndicator={
                <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
                  No results found.
                </p>
              }
              // Removed maxSelected={1} as dipositFees is defined as z.array(z.string()).optional()
              // If it should be single select, you need to adjust your Zod schema for dipositFees to z.string().optional()
            />
            {errors?.policies?.dipositFees ? (
              <InlineAlert type="error">{errors.policies.dipositFees.message}</InlineAlert>
            ) : null}
          </div>

          {/* 5. Booking Restrictions (Minimum Nights) - Remains as number input */}
          <div className="flex flex-col gap-2 col-span-2">
            <Label htmlFor="minimum-nights">Minimum Nights</Label>
            <Input
              id="minimum-nights"
              type="number"
              placeholder="e.g., 2"
              min="1"
              {...minimum_nights_controller.field}
              onChange={(e) => {
                minimum_nights_controller.field.onChange(e.target.value === '' ? '' : Number(e.target.value));
              }}
              disabled={disabled}
            />
            {errors?.policies?.minimumNightStay ? (
              <InlineAlert type="error">{errors.policies.minimumNightStay.message}</InlineAlert>
            ) : null}
          </div>

          {/* 6. Policies: Terms: Restriction ++++ (Textarea/Editor) - Remains as textarea */}
          <div className="flex flex-col gap-2 col-span-2">
            <TermsSection />
          </div>
        </CreationFormSectionContent>

        {/* New Section for Room Pricing */}
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Room Pricing Configurations
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Define various pricing options for this room type, including views, smoking policies, pet-friendliness, and specific rate codes.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <div className="col-span-2">
            <SetPricingPopup
              selectedPropertyDetails={selectedPropertyDetails}
              initialPricingData={roomPricing_controller.field.value || []} // Pass current form value
              onSavePricing={handleSaveRoomPricing} // Pass callback to update form
            />
            {errors?.roomPricing ? (
              <InlineAlert type="error" className="mt-2">
                {errors.roomPricing.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_PoliciesAndRestrictions_Section;

// "use client";
// import {
//   CreationFormSection,
//   CreationFormSectionContent,
//   CreationFormSectionInfo,
//   CreationFormSectionInfoDescription,
//   CreationFormSectionInfoTitle,
// } from "@/components/creation-form";
// import { Label } from "@/components/ui/label";
// import { forwardRef } from "react";
// import { useController, useFormContext } from "react-hook-form";
// import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
// import InlineAlert from "@/components/ui/inline-alert";
// import { Input } from "@/components/ui/input"; // Re-added this import!
// import { Textarea } from "@/components/ui/textarea";
// import { ToggleInput } from "@/app/[locale]/(dashboard)/property/(CRUD)/create/_components/create-form/_components/toggle_button"; // Adjust this path if your ToggleInput is elsewhere
// import MultipleSelector from "@/components/ui/mutli-select";
// import TermsSection from "./_components/terms.section";

// // Assuming these interfaces are defined globally or locally as needed
// interface Option {
//   label: string;
//   value: string;
// }

// interface FeeOption {
//   id: string; // Or number, depending on your actual ID type
//   name: string; // The display name of the fee
//   value: number; // The actual numerical value of the fee
// }

// // Props for the new component
// interface Props {
//   id: string;
//   damage_fee_options: FeeOption[]; // New prop for damage fee options
//   deposit_fee_options: FeeOption[]; // New prop for deposit fee options
// }

// const CreateRoom_PoliciesAndRestrictions_Section = forwardRef<HTMLDivElement, Props>(
//   ({ id, damage_fee_options = [], deposit_fee_options = [] }, ref) => {
//     const {
//       formState: { errors, disabled },
//       control,
//     } = useFormContext<CreateRoomValidationSchemaType>();

//     // 1. Authorized Smoking Area (Yes/No)
//     // Handled by ToggleInput internally via its `name` prop

//     // 2. Pet Friendly (Yes/No)
//     // Handled by ToggleInput internally via its `name` prop

//     // 3. Damage Fees (Now a search-enabled select)
//     const damage_fees_controller = useController({
//       control,
//       name: "policies.damageFees", // This field will now store the 'id' of the selected fee
//       defaultValue: [], // Default to empty string as it's a select field
//     });

//     // 4. Deposit Fees (Now a search-enabled select)
//     const deposit_fees_controller = useController({
//       control,
//       name: "policies.dipositFees", // This field will now store the 'id' of the selected fee
//       defaultValue: [], // Default to empty string as it's a select field
//     });

//     // 5. Booking Restrictions (Minimum Nights)
//     const minimum_nights_controller = useController({
//       control,
//       name: "policies.minimumNightStay",
//       defaultValue: 1,
//     });

  

//     return (
//       <CreationFormSection ref={ref} id={id}>
//         <CreationFormSectionInfo>
//           <CreationFormSectionInfoTitle>Policies & Restrictions</CreationFormSectionInfoTitle>
//           <CreationFormSectionInfoDescription>
//             Define the booking policies, fees, and specific restrictions for this room.
//           </CreationFormSectionInfoDescription>
//         </CreationFormSectionInfo>
//         <CreationFormSectionContent>
//           {/* 1. Authorized Smoking Area (Yes/No) */}
//           <ToggleInput
//             name="policies.smokingArea" // Ensure this matches your schema field name
//             label="Authorized Smoking Area"
//             disabled={disabled}
//           />

//           {/* 2. Pet Friendly (Yes/No) */}
//           <ToggleInput
//             name="policies.petsAllowed" // Ensure this matches your schema field name
//             label="Pet Friendly"
//             disabled={disabled}
//           />

//           {/* 3. Damage Fees (Now a search-enabled select using MultipleSelector) */}
//           <div className="flex flex-col gap-2 col-span-2">
//             <Label htmlFor="damage-fees">Damage Fees</Label>
//             <MultipleSelector
//               id="damage-fees"
//               defaultOptions={damage_fee_options.map((fee) => ({
//                 label: `${fee.name} ($${fee.value})`, // Display name and value
//                 value: fee.id, // Store the ID in the form data
//               }))}
//               disabled={disabled}
//               className="w-full"
//               onChange={(values) => {
//                 damage_fees_controller.field.onChange(values.length > 0 ? values[0].value : "");
//               }}
//               value={
//                 damage_fees_controller.field.value
//                   ? [{
//                       label: damage_fee_options.find(opt => opt.id === damage_fees_controller.field.value)?.name || "",
//                       value: damage_fees_controller.field.value
//                     }]
//                   : []
//               }
//               placeholder="Search or select damage fee..."
//               emptyIndicator={
//                 <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
//                   No results found.
//                 </p>
//               }
//               maxSelected={1} // Restrict to single selection
//             />
//             {errors?.policies?.damageFees ? (
//               <InlineAlert type="error">{errors.policies.damageFees.message}</InlineAlert>
//             ) : null}
//           </div>

//           {/* 4. Deposit Fees (Now a search-enabled select using MultipleSelector) */}
//           <div className="flex flex-col gap-2 col-span-2">
//             <Label htmlFor="deposit-fees">Deposit Fees</Label>
//             <MultipleSelector
//               id="deposit-fees"
//               defaultOptions={deposit_fee_options.map((fee) => ({
//                 label: `${fee.name} ($${fee.value})`, // Display name and value
//                 value: fee.id, // Store the ID in the form data
//               }))}
//               disabled={disabled}
//               className="w-full"
//               onChange={(values) => {
//                 deposit_fees_controller.field.onChange(values.length > 0 ? values[0].value : "");
//               }}
//               value={
//                 deposit_fees_controller.field.value
//                   ? [{
//                       label: deposit_fee_options.find(opt => opt.id === deposit_fees_controller.field.value)?.name || "",
//                       value: deposit_fees_controller.field.value
//                     }]
//                   : []
//               }
//               placeholder="Search or select deposit fee..."
//               emptyIndicator={
//                 <p className="text-center text-sm leading-3 text-gray-600 dark:text-gray-400">
//                   No results found.
//                 </p>
//               }
//               maxSelected={1} // Restrict to single selection
//             />
//             {errors?.policies?.dipositFees ? (
//               <InlineAlert type="error">{errors.policies.dipositFees.message}</InlineAlert>
//             ) : null}
//           </div>

//           {/* 5. Booking Restrictions (Minimum Nights) - Remains as number input */}
//           <div className="flex flex-col gap-2 col-span-2">
//             <Label htmlFor="minimum-nights">Minimum Nights</Label>
//             <Input // This is the component that was causing the ReferenceError
//               id="minimum-nights"
//               type="number"
//               placeholder="e.g., 2"
//               min="1"
//               {...minimum_nights_controller.field}
//               onChange={(e) => {
//                 minimum_nights_controller.field.onChange(e.target.value === '' ? '' : Number(e.target.value));
//               }}
//               disabled={disabled}
//             />
//             {errors?.policies?.minimumNightStay ? (
//               <InlineAlert type="error">{errors.policies.minimumNightStay.message}</InlineAlert>
//             ) : null}
//           </div>

//           {/* 6. Policies: Terms: Restriction ++++ (Textarea/Editor) - Remains as textarea */}
//           <div className="flex flex-col gap-2 col-span-2">
//             <TermsSection />
//           </div>
//         </CreationFormSectionContent>
//       </CreationFormSection>
//     );
//   }
// );

// export default CreateRoom_PoliciesAndRestrictions_Section;