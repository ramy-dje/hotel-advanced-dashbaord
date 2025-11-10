import React from "react";
import { useFormContext } from "react-hook-form";
import { UpdateRoomExtraServiceValidationSchemaType } from "../update-room-extra-service.schema";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

function DisplaySettings() {
  const {
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<UpdateRoomExtraServiceValidationSchemaType>();

  const handleSalesChannelsChange = (channel: string, checked: boolean) => {
    const current = watch("sales_channels") || [];
    const updated = checked
      ? Array.from(new Set([...current, channel]))
      : current.filter((val) => val !== channel);
    setValue("sales_channels", updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Service Status */}
      <div className="flex flex-row justify-between gap-2 lg:w-1/2 w-full">
        <Label>Service status</Label>
        <Switch
          autoFocus={true}
          checked={watch("service_status")}
          onCheckedChange={(v) => setValue("service_status", v)}
        />
      </div>

      {/* Featured Service */}
      <div className="flex flex-row justify-between gap-2 lg:w-1/2 w-full">
        <Label>Featured service</Label>
        <Switch
          checked={watch("featured_service")}
          onCheckedChange={(v) => setValue("featured_service", v)}
        />
      </div>

      {/* Sales Channels */}
      <div className="flex flex-col gap-2">
        <Label>Sales channels</Label>

        {/* Online Store */}
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            id="online_store"
            value="online_store"
            checked={(watch("sales_channels") || []).includes("online_store")}
            onCheckedChange={(checked) =>
              handleSalesChannelsChange("online_store", !!checked)
            }
          />
          <label className="text-sm" htmlFor="online_store">
            Online store
          </label>
        </div>

        {/* POS */}
        <div className="flex flex-row gap-2 items-center">
          <Checkbox
            id="pos"
            value="pos"
            checked={(watch("sales_channels") || []).includes("pos")}
            onCheckedChange={(checked) =>
              handleSalesChannelsChange("pos", !!checked)
            }
          />
          <label className="text-sm" htmlFor="pos">
            POS
          </label>
        </div>
      </div>
    </div>
  );
}

export default DisplaySettings;
