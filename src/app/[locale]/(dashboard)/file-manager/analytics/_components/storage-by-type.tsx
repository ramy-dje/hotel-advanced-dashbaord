"use client";

import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";

const data = [
  { name: "available", value: 16, fill: "var(--color-available)" },
  { name: "used", value: 134, fill: "var(--color-used)" },
];
const chartConfig = {
  used: {
    label: "Total used storage",
    color: "hsl(var(--chart-1))",
  },
  available: {
    label: "Available storage",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function StorageByType() {
  const totalStorage = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, []);
  return (
    <div className="flex flex-col items-center">
      <div className="flex-1 w-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              strokeWidth={5}
              cornerRadius={10}
              paddingAngle={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data.filter((item) => item.name === "used")[0].value}{" "}
                          GB
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Used of {totalStorage}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
      <div className="flex flex-col mt-4 divide-y divide-accent w-full ">
        {data.map(({ name, value }) => (
          <div
            key={name}
            className="flex items-center gap-2 justify-between py-2"
          >
            <div
              className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
              style={
                {
                  "--color-bg":
                    chartConfig[name as keyof typeof chartConfig].color,
                } as React.CSSProperties
              }
            />
            {chartConfig[name as keyof typeof chartConfig]?.label || name}
            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
              {((value * 100) / totalStorage).toFixed(0)}
              <span className="font-normal text-muted-foreground">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
