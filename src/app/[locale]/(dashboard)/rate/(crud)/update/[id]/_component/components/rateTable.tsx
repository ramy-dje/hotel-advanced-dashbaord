import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { UpdateRateValidationSchemaType } from "../updateRateDetailsValidation.schema";

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

export default function DynamicRateTable({
  methods,
}: {
  methods: UseFormReturn<UpdateRateValidationSchemaType>;
}) {
  const maxStay = methods.watch("maxStay");
  const oldRate = useWatch({
    control: methods.control,
    name: "tiersTable",
  });

  const [rateState, setRateState] = useState<TiersTable>({
    tiers: [],
    extraOccupants: [],
  });
  const [hoveredTierId, setHoveredTierId] = useState<number | null>(null);
  const showChild = methods.watch("ageRestriction") === "adults_children";

  useEffect(() => {
    if (oldRate) {
      setRateState(oldRate);
    }
  }, [oldRate]);

  useEffect(() => {
    if (maxStay && rateState.tiers.length) {
      setRateState((prev) => {
        const updatedTiers = [...prev.tiers];
        updatedTiers[updatedTiers.length - 1].to = Number(maxStay);
        const newState = { ...prev, tiers: updatedTiers };
        methods.setValue("tiersTable", newState as UpdateRateValidationSchemaType["tiersTable"]);
        return newState;
      });
    }
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
      methods.setValue("tiersTable", newState as UpdateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const handleNestedChange = (
    tierId: number,
    key: "baseOccupants" | "baseRates" ,
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
      methods.setValue("tiersTable", newState as UpdateRateValidationSchemaType["tiersTable"]);
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
            baseOccupants: { adult: 0, child: 0 },
            baseRates: { adult: 0, child: 0 },
          },
        ],
      };
      methods.setValue("tiersTable", newState as UpdateRateValidationSchemaType["tiersTable"]);
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
          const updatedRates = eo.rates.filter((_ : any, i:number) => i !== indexToRemove);
          return { ...eo, rates: updatedRates };
        }),
      };
      methods.setValue("tiersTable", newState as UpdateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const addExtraOccupant = () => {
    setRateState((prev) => {
      const newState = {
        ...prev,
        extraOccupants: [...prev.extraOccupants, 0],
      };
      methods.setValue("tiersTable", newState as UpdateRateValidationSchemaType["tiersTable"]);
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
      methods.setValue("tiersTable", newState as UpdateRateValidationSchemaType["tiersTable"]);
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
      methods.setValue("tiersTable", newState as UpdateRateValidationSchemaType["tiersTable"]);
      return newState;
    });
  };

  const renderNumberInput = (
    value: number,
    onChange: (value: number) => void,
    className = "w-12 text-center border rounded",
    disabled = false,
  ) => (
    <input
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={className}
      disabled={disabled}
    />
  );

  // Render logic remains unchanged (can be added back if needed)/ End of component

  return (
    <div className="overflow-auto border rounded-md mb-4">
      <table className="min-w-full table-auto border-collapse text-center text-sm font-normal">
        <thead>
          <tr>
            <th className="border p-2 w-[200px]">Length of stay</th>
            {rateState?.tiers?.map((tier) => (
              <th
                key={tier.id}
                colSpan={2}
                className="relative border p-2 group"
                onMouseEnter={() => setHoveredTierId(tier.id)}
                onMouseLeave={() => setHoveredTierId(null)}
              >
                from{" "}
                {renderNumberInput(tier.from, (val) =>
                  updateTier(tier.id, { from: val }),
                )}
                to{" "}
                {tier.id === rateState.tiers[rateState.tiers.length - 1].id ? (
                  tier.to ? (
                    renderNumberInput(tier.to, (val) =>
                      updateTier(tier.id, { to: val }),
                    )
                  ) : (
                    <span>and more</span>
                  )
                ) : (
                  renderNumberInput(tier.to as number, (val) =>
                    updateTier(tier.id, { to: val }),
                  )
                )}
                {hoveredTierId === tier.id && (
                  <button
                    onClick={() => removeTier(tier.id)}
                    className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                )}
              </th>
            ))}
            <th className="border p-2 flex gap-2 justify-center">
              <Plus className="size-4 text-primary" />
              <button
                onClick={addNewTier}
                className="text-primary font-semibold"
                type="button"
              >
                Add new tier
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">Base occupants</td>
            {rateState?.tiers?.map((tier) => (
              <React.Fragment key={tier.id}>
                {showChild ? (
                  <>
                    <td className="border p-2">
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
                    <td className="border p-2">
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
                    className="border p-2"
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
            <td className="border p-2" />
          </tr>
          <tr>
            <td className="border p-2">Base occupancy rate</td>
            {rateState?.tiers?.map((tier) => (
              <React.Fragment key={tier.id}>
                {showChild ? (
                  <>
                    <td className="border p-2">
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
                    <td className="border p-2">
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
                    className="border p-2"
                  >
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
            <td className="border p-2" />
          </tr>
          {rateState?.extraOccupants?.map((rate, index) => (
            <tr key={index}>
              <td className="border p-2 relative">
                Extra occupant {index + 1} rate
                {index === rateState?.extraOccupants?.length - 1 && (
                  <Trash2
                    onClick={removeLastExtraOccupant}
                    className="text-red-500 cursor-pointer size-4 absolute top-1 right-1"
                  />
                )}
              </td>
              {rateState?.tiers?.map((tier) => (
                <td
                  key={tier.id}
                  colSpan={2}
                  className="border p-2"
                >
                  {renderNumberInput(
                    rate,
                    (val) => updateExtraRate(index, val),
                    "w-16 text-center border rounded",
                  )}
                </td>
              ))}
              <td className="border p-2" />
            </tr>
          ))}

          <tr className="bg-gray-300">
            <td className="border p-2 bg-primary text-white">
              <button
                type="button"
                onClick={addExtraOccupant}
              >
                Add extra 1 occupant
              </button>
            </td>
            {rateState?.tiers?.map((tier) => (
              <td
                key={tier.id}
                className="border p-2"
                colSpan={2}
              />
            ))}
            <td className="border p-2" />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
