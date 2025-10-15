"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const data = [
  {
    month: "Jan",
    documents: 10,
    images: 15,
    videos: 5,
    other: 2,
  },
  {
    month: "Feb",
    documents: 12,
    images: 18,
    videos: 8,
    other: 3,
  },
  {
    month: "Mar",
    documents: 5,
    images: 20,
    videos: 12,
    other: 4,
  },
  {
    month: "Apr",
    documents: 18,
    images: 22,
    videos: 16,
    other: 5,
  },
  {
    month: "May",
    documents: 20,
    images: 25,
    videos: 18,
    other: 6,
  },
  {
    month: "Jun",
    documents: 22,
    images: 28,
    videos: 22,
    other: 7,
  },
  {
    month: "Jul",
    documents: 25,
    images: 30,
    videos: 25,
    other: 8,
  },
  {
    month: "Aug",
    documents: 28,
    images: 32,
    videos: 30,
    other: 9,
  },
  {
    month: "Sep",
    documents: 30,
    images: 35,
    videos: 32,
    other: 10,
  },
  {
    month: "Oct",
    documents: 32,
    images: 38,
    videos: 35,
    other: 11,
  },
  {
    month: "Nov",
    documents: 35,
    images: 40,
    videos: 38,
    other: 12,
  },
  {
    month: "Dec",
    documents: 38,
    images: 42,
    videos: 40,
    other: 14,
  },
];

const chartConfig = {
  documents: {
    label: "Documents",
    color: "hsl(var(--chart-1))",
  },
  images: {
    label: "Images",
    color: "hsl(var(--chart-2))",
  },
  videos: {
    label: "Videos",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function StorageOverview() {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 0,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickMargin={10}
        />
        <YAxis
          tickFormatter={(value) => `${value} GB`}
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickMargin={10}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, name, item, index) => (
                <>
                  <div
                    className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                    style={
                      {
                        "--color-bg": `var(--color-${name})`,
                      } as React.CSSProperties
                    }
                  />
                  {chartConfig[name as keyof typeof chartConfig]?.label || name}
                  <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {value}
                    <span className="font-normal text-muted-foreground">
                      GB
                    </span>
                  </div>
                  {/* Add this after the last item */}
                  {index === 3 && (
                    <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                      Total
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {Object.keys(item.payload)
                          .filter((item) => item !== "month")
                          .reduce(
                            (sum, value) =>
                              sum + (item.payload[value] as number),
                            0
                          )
                          .toFixed(1)}
                        <span className="font-normal text-muted-foreground">
                          GB
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            />
          }
          cursor={false}
        />
        <Area
          dataKey="documents"
          type="natural"
          fill="var(--color-documents)"
          fillOpacity={0.4}
          stroke="var(--color-documents)"
          stackId="a"
        />
        <Area
          dataKey="images"
          type="natural"
          fill="var(--color-images)"
          fillOpacity={0.4}
          stroke="var(--color-images)"
          stackId="a"
        />
        <Area
          dataKey="videos"
          type="natural"
          fill="var(--color-videos)"
          fillOpacity={0.4}
          stroke="var(--color-videos)"
          stackId="a"
        />
        <Area
          dataKey="other"
          type="natural"
          fill="var(--color-other)"
          fillOpacity={0.4}
          stroke="var(--color-other)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
