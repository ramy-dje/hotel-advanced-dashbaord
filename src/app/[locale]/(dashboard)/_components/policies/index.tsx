import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2, Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";

type PolicyItem = {
  icon: "check" | "x";
  text: string;
};

type PolicySection = {
  title: string;
  items: PolicyItem[];
};

export default function PolicyManager({ setValue ,control }: { setValue: UseFormReturn<any>["setValue"] ,control: UseFormReturn<any>["control"]}) {
  const [sections, setSections] = useState<PolicySection[]>([
    { title: "", items: [] }
  ]);

  const addSection = () => {
    setSections((prev) => [...prev, { title: "", items: [] }]);
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSectionTitle = (index: number, title: string) => {
    const updated = [...sections];
    updated[index].title = title;
    setSections(updated);
    setValue("policies", sections);
  };

  const addItem = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].items.push({ icon: "check", text: "" });
    setSections(updated);
    setValue("policies", sections);
  };

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    item: PolicyItem,
  ) => {
    const updated = [...sections];
    updated[sectionIndex].items[itemIndex] = item;
    setSections(updated);
    setValue("policies", sections);
  };

  const deleteItem = (sectionIndex: number, itemIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].items.splice(itemIndex, 1);
    setSections(updated);
    setValue("policies", sections);
  };
  const oldPolicies = useWatch({
    control,
    name: "policies",
  }); 
  useEffect(() => {
    if (oldPolicies) {
      setSections(oldPolicies);
    }
  }, [oldPolicies]);
  return (
    <div className="w-full mx-auto border rounded-xl p-5 shadow-sm bg-white">
      {sections && sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className="space-y-4 border-b py-2"
        >
          {/* Section title input */}
          <div className="flex justify-between items-center">
            <input
              className="text-md font-medium px-2 py-1 w-full focus:outline-none"
              value={section.title}
              onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
              placeholder="policy title"
            />
            <button
              type="button"
              onClick={() => removeSection(sectionIndex)}
            >
              <Trash2 className="text-red-500 size-5" />
            </button>
          </div>

          {/* Item list */}
          <ul className="space-y-2">
            {section.items.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="flex items-start gap-2 text-sm bg-gray-50 p-2 rounded-md"
              >
                <div className="w-24">
                  <Select
                    value={item.icon}
                    onValueChange={(value) =>
                      updateItem(sectionIndex, itemIndex, {
                        ...item,
                        icon: value as "check" | "x",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="empty">Empty</SelectItem>
                      <SelectItem value="check">
                        <Check className="text-green-600 size-6" />
                      </SelectItem>
                      <SelectItem value="x">
                        <X className="text-red-600 size-6" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={item.text}
                  onChange={(e) =>
                    updateItem(sectionIndex, itemIndex, {
                      ...item,
                      text: e.target.value,
                    })
                  }
                  placeholder="policy description"
                ></Textarea>

                <button
                  type="button"
                  onClick={() => deleteItem(sectionIndex, itemIndex)}
                  className="text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>

          {/* Add item button */}
          <button
            type="button"
            onClick={() => addItem(sectionIndex)}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="size-4" />
            Add policy item
          </button>
        </div>
      ))}

      {/* Just a button to add a blank section */}
      <div className="text-center mt-4">
        <Button
          variant="default"
          type="button"
          onClick={addSection}
        >
          <Plus className="size-4" />
          Add policy section
        </Button>
      </div>
    </div>
  );
}
