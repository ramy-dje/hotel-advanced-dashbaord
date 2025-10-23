import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { CreateRateValidationSchemaType } from "../createRateDetailsValidation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { IoPeopleOutline } from "react-icons/io5";
import { TbCoin, TbCoins } from "react-icons/tb";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";

export interface TiersTable {
  tiers: {
    id: number;
    label: string;
    from: number;
    to?: number;
    baseOccupants: {
      adult: number;
      child: number;
    };
    baseRates: {
      adult: number;
      child: number;
    };
  }[];
  extraOccupants: any[];
}

export default function DynamicRateTable() {
  const {
    formState: { errors, disabled, isSubmitSuccessful },
    register,
    control,
    watch,
    setValue,
  } = useFormContext<CreateRateValidationSchemaType>();
  const maxStay = watch("maxStay");
  const [rateState, setRateState] = useState<TiersTable>(() => ({
    tiers: [
      {
        id: 1,
        label: "From 1 to 4 nights",
        from: 1,
        to: undefined,
        baseOccupants: { adult: 0, child: 0 },
        baseRates: { adult: 0, child: 0 },
      },
    ],
    extraOccupants: [],
  }));

  const [hoveredTierId, setHoveredTierId] = useState<number | null>(null);
  const showChild = watch("ageRestriction") === "adults_children";

  useEffect(() => {
    setRateState((prev) => {
      const updatedTiers = [...prev.tiers];
      updatedTiers[updatedTiers.length - 1].to = Number(maxStay);
      const newState = { ...prev, tiers: updatedTiers };
      setValue("tiersTable", newState as CreateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  }, [maxStay]);

  const updateTier = (tierId: number, updatedTier: any) => {
    setRateState((prev) => {
      const updatedTiers = prev.tiers.map((tier, index) => {
        const isLast = index === prev.tiers.length - 1;
        if (tier.id === tierId) {
          const newTier = { ...tier, ...updatedTier };
          if (isLast && updatedTier.to !== undefined) {
            newTier.to = Number(maxStay);
          }
          return newTier;
        }
        return tier;
      });
      const newState = { ...prev, tiers: updatedTiers };
      setValue("tiersTable", newState  as CreateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const handleNestedChange = (
    tierId: number,
    key: "baseOccupants" | "baseRates",
    field: "adult" | "child",
    value: number,
  ) => {
    setRateState((prev) => {
      const updatedTiers = prev.tiers.map((tier) =>
        tier.id === tierId
          ? { ...tier, [key]: { ...tier[key], [field]: value } }
          : tier,
      );
      const newState = { ...prev, tiers: updatedTiers };
      setValue("tiersTable", newState as CreateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const addNewTier = () => {
    setRateState((prev) => {
      const updatedTiers = prev.tiers.map((tier, index) =>
        index === prev.tiers.length - 1
          ? { ...tier, to: Number(maxStay) - 1 }
          : tier,
      );

      const newState = {
        ...prev,
        tiers: [
          ...updatedTiers,
          {
            id: prev.tiers.length + 1,
            label: "New Tier",
            from: 0,
            to: Number(maxStay),
            baseOccupants: {
              adult: prev.tiers[prev.tiers.length - 1].baseOccupants.adult,
              child: prev.tiers[prev.tiers.length - 1].baseOccupants.child,
            },
            baseRates: {
              adult: prev.tiers[prev.tiers.length - 1].baseRates.adult,
              child: prev.tiers[prev.tiers.length - 1].baseRates.child,
            },
          },
        ],
      };
      setValue("tiersTable", newState as CreateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const removeTier = (id: number) => {
    setRateState((prev) => {
      const filteredTiers = prev.tiers.filter((t) => t.id !== id);
      const updatedTiers = filteredTiers.map((tier, index) =>
        index === filteredTiers.length - 1
          ? { ...tier, to: Number(maxStay) }
          : tier,
      );
      const newState = {
        ...prev,
        tiers: updatedTiers,
        extraOccupants: prev.extraOccupants.map((eo) => {
          const indexToRemove = prev.tiers.findIndex((t) => t.id === id);
          if (indexToRemove === -1) return eo;
          const updatedRates = eo.rates.filter((_:any, i:number) => i !== indexToRemove);
          return { ...eo, rates: updatedRates };
        }),
      };
      setValue("tiersTable", newState as CreateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const addExtraOccupant = () => {
    setRateState((prev) => {
      const newState = {
        ...prev,
        extraOccupants: [...prev.extraOccupants, 0],
      };
      setValue("tiersTable", newState as CreateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const updateExtraRate = (index: number, value: number) => {
    setRateState((prev) => {
      const updated = [...prev.extraOccupants];
      updated[index] = value;
      const newState = {
        ...prev,
        extraOccupants: updated,
      };
      setValue("tiersTable", newState as CreateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const removeLastExtraOccupant = () => {
    setRateState((prev) => {
      const updated = prev.extraOccupants.slice(0, -1);
      const newState = {
        ...prev,
        extraOccupants: updated,
      };
      setValue("tiersTable", newState as CreateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const renderNumberInput = (
    value: number,
    onChange: (value: number) => void,
    className = "",
    disabled = false,
  ) => (
    <input
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`
        w-[70px] px-2 py-1 text-center border border-gray-300 rounded-md bg-white text-black text-sm shadow-sm focus:outline-none
        focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 appearance-none 
        [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        } ${className}`}
      disabled={disabled}
    />
  );

  return (
    <div className="overflow-auto mb-4">
      {errors.tiersTable && (
        <InlineAlert type="error">{errors.tiersTable.message}</InlineAlert>
      )}
      <table className="min-w-full border-separate border-spacing-0 text-sm shadow-md rounded-lg overflow-hidden bg-white text-center">
        <thead className="bg-gradient-to-r from-primary to-indigo-600 text-white uppercase text-xs tracking-wider">
          <tr className="hover:bg-gray-100 transition-colors duration-150">
            <th className="border p-2 w-[200px] bg-primary text-white font-semibold">
              Length of stay
            </th>
            {rateState.tiers.map((tier) => (
              <th
                key={tier.id}
                colSpan={2}
                className="border p-2 w-[200px] bg-primary font-semibold relative"
                onMouseEnter={() => setHoveredTierId(tier.id)}
                onMouseLeave={() => setHoveredTierId(null)}
              >
                <span className="text-white">from </span>
                {renderNumberInput(tier.from, (val) =>
                  updateTier(tier.id, { from: val }),
                )}{" "}
                {tier.id === rateState.tiers[rateState.tiers.length - 1].id ? (
                  tier.to ? (
                    renderNumberInput(tier.to, (val) =>
                      updateTier(tier.id, { to: val }),
                    )
                  ) : (
                    <span className="text-white">and more</span>
                  )
                ) : (
                  <>
                    <span className="text-white">to </span>
                    {renderNumberInput(tier.to as number, (val) =>
                      updateTier(tier.id, { to: val }),
                    )}
                  </>
                )}
                {hoveredTierId === tier.id && (
                  <button
                    onClick={() => removeTier(tier.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <X
                      size={16}
                      color="white"
                    />
                  </button>
                )}
              </th>
            ))}
            <th className="border p-2 w-[200px] bg-primary text-white font-semibold">
              <button
                onClick={addNewTier}
                className="flex items-center gap-1 px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 transition"
                type="button"
              >
                <Plus className="w-4 h-4" />
                ADD TIER
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100 transition-colors duration-150">
            <td className="border p-2 bg-gray-50 h-[50px] hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
              <IoPeopleOutline size={20} />
              <span>Base occupants</span>
            </td>
            {rateState.tiers.map((tier) => (
              <React.Fragment key={tier.id}>
                {showChild ? (
                  <>
                    <td className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      Adult:{" "}
                      {renderNumberInput(tier.baseOccupants.adult, (val) =>
                        handleNestedChange(
                          tier.id,
                          "baseOccupants",
                          "adult",
                          val,
                        ),
                      )}
                    </td>
                    <td className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      Child:{" "}
                      {renderNumberInput(tier.baseOccupants.child, (val) =>
                        handleNestedChange(
                          tier.id,
                          "baseOccupants",
                          "child",
                          val,
                        ),
                      )}
                    </td>
                  </>
                ) : (
                  <td
                    colSpan={2}
                    className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Adult:{" "}
                    {renderNumberInput(tier.baseOccupants.adult, (val) =>
                      handleNestedChange(
                        tier.id,
                        "baseOccupants",
                        "adult",
                        val,
                      ),
                    )}
                  </td>
                )}
              </React.Fragment>
            ))}
            <td className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200" />
          </tr>
          <tr className="hover:bg-gray-100 transition-colors duration-150">
            <td className="border p-2 bg-gray-50 h-[50px] hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
              <TbCoins
                className="stroke-[1.5]"
                size={20}
              />
              <span>Base occupancy rate</span>
            </td>
            {rateState.tiers.map((tier) => (
              <React.Fragment key={tier.id}>
                {showChild ? (
                  <>
                    <td className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      Adult:{" "}
                      {renderNumberInput(
                        tier.baseRates.adult,
                        (val) =>
                          handleNestedChange(
                            tier.id,
                            "baseRates",
                            "adult",
                            val,
                          ),
                        "w-16 text-center border rounded",
                      )}
                    </td>
                    <td className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                      Child:{" "}
                      {renderNumberInput(
                        tier.baseRates.child,
                        (val) =>
                          handleNestedChange(
                            tier.id,
                            "baseRates",
                            "child",
                            val,
                          ),
                        "w-16 text-center border rounded",
                      )}
                    </td>
                  </>
                ) : (
                  <td
                    colSpan={2}
                    className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Adult:{" "}
                    {renderNumberInput(
                      tier.baseRates.adult,
                      (val) =>
                        handleNestedChange(tier.id, "baseRates", "adult", val),
                      "w-16 text-center border rounded",
                    )}
                  </td>
                )}
              </React.Fragment>
            ))}
            <td className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200" />
          </tr>
          {rateState.extraOccupants.map((rate, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100 transition-colors duration-150"
            >
              <td className="border p-2 h-[50px] relative bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                <AiOutlineUserAdd size={20} />
                <span>Extra occupant {index + 1}</span>
                {index === rateState.extraOccupants.length - 1 && (
                  <Trash2
                    onClick={removeLastExtraOccupant}
                    className="text-red-500 cursor-pointer size-4 absolute top-1 right-1"
                  />
                )}
              </td>
              {rateState.tiers.map((tier) => (
                <td
                  key={tier.id}
                  colSpan={2}
                  className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  {renderNumberInput(
                    rate,
                    (val) => updateExtraRate(index, val),
                    "w-16 text-center border rounded",
                  )}
                </td>
              ))}
              <td className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200" />
            </tr>
          ))}

          <tr className="bg-gray-300 hover:bg-gray-100 transition-colors duration-150">
            <td className="border p-2 bg-primary text-white hover:bg-primary/80 transition-colors duration-200">
              <button
                type="button"
                onClick={addExtraOccupant}
              >
                Add extra occupant
              </button>
            </td>
            {rateState.tiers.map((tier) => (
              <td
                key={tier.id}
                className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                colSpan={2}
              />
            ))}
            <td className="border p-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
