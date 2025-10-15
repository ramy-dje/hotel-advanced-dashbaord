import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
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

interface Props {
  id: string;
}

export const CreateProperty_HousePolicies_Section: React.FC<Props> = ({ id }) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "housePolicies" });

  return (
    <CreationFormSection id={`${id}-house-policies`}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>House Policies</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Specify rules and guidelines for guests staying at the property.
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        <div className="col-span-2 space-y-4">
          {fields.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No policies added yet.
            </p>
          ) : (
            fields.map((field, index) => (
              <div key={field.id} className="space-y-4 border p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <Label className="text-lg">Policy {index + 1}</Label>
                  <Button variant="destructive" size="sm" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>

                <div>
                  <Label htmlFor={`housePolicies.${index}.title`}>Title</Label>
                  <Input
                    id={`housePolicies.${index}.title`}
                    placeholder="Policy Title"
                    {...register(`housePolicies.${index}.title` as const)}
                  />
                </div>

                <div>
                  <Label htmlFor={`housePolicies.${index}.description`}>Description</Label>
                  <Controller
                    control={control}
                    name={`housePolicies.${index}.description` as const}
                    render={({ field }) => (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="prose prose-sm max-w-full p-2 border rounded-md min-h-[100px] focus:outline-none"
                        onInput={(e) => field.onChange(e.currentTarget.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: field.value || "" }}
                      />
                    )}
                  />
                </div>
              </div>
            ))
          )}

          <Button type="button" variant="outline" onClick={() => append({ title: "", description: "" })}>
            Add Another House Policy
          </Button>
        </div>
      </CreationFormSectionContent>
    </CreationFormSection>
  );
};

export default CreateProperty_HousePolicies_Section;

// import React from "react";
// import { useFormContext, useFieldArray } from "react-hook-form";
// import {
//   CreationFormSection,
//   CreationFormSectionContent,
//   CreationFormSectionInfo,
//   CreationFormSectionInfoTitle,
//   CreationFormSectionInfoDescription,
// } from "@/components/creation-form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { MdRule } from 'react-icons/md';

// interface Props {
//   id: string;
// }

// const CreateProperty_HousePolicies_Section: React.FC<Props> = ({ id }) => {
//   const { control, register } = useFormContext();
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "housePolicies",
//   });

//   return (
//     <CreationFormSection id={`${id}-house-policies`}>
//       <CreationFormSectionInfo>
//         <CreationFormSectionInfoTitle>House Policies</CreationFormSectionInfoTitle>
//         <CreationFormSectionInfoDescription>
//           Specify rules and guidelines for guests staying at the property.
//         </CreationFormSectionInfoDescription>
//       </CreationFormSectionInfo>

//       <CreationFormSectionContent>
//         <div className="col-span-2 space-y-4">
//           {fields.length === 0 ? (
//             <p className="text-center text-sm text-muted-foreground">
//               No policies added yet.
//             </p>
//           ) : (
//             fields.map((field, index) => (
//               <div key={field.id} className="space-y-2 border p-4 rounded-lg">
//                 <div className="flex justify-between items-center mb-2">
//                   <Label className="text-lg">Policy {index + 1}</Label>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => remove(index)}
//                   >
//                     Remove
//                   </Button>
//                 </div>
//                 <div className="space-y-2">
//                   <div>
//                     <Label htmlFor={`housePolicies.${index}.title`}>Title</Label>
//                     <Input
//                       id={`housePolicies.${index}.title`}
//                       placeholder="Policy Title"
//                       {...register(`housePolicies.${index}.title` as const)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor={`housePolicies.${index}.description`}>Description</Label>
//                     <Textarea
//                       id={`housePolicies.${index}.description`}
//                       placeholder="Policy Description"
//                       rows={3}
//                       {...register(`housePolicies.${index}.description` as const)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}

//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => append({ title: "", description: "" })}
//           >
//             Add Another House Policy
//           </Button>
//         </div>
//       </CreationFormSectionContent>
//     </CreationFormSection>
//   );
// };

// export default CreateProperty_HousePolicies_Section;
