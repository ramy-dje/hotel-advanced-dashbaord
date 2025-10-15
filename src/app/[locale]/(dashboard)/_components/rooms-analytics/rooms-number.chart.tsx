import { RoomAnalyticsInterface } from "@/interfaces/analytics";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  ChartLegend,
} from "@/components/ui/chart";

// Charts config
const chartConfig = {
  valid: {
    label: "Valid Rooms",
  },
  deleted: {
    label: "Deleted Rooms",
  },
} satisfies ChartConfig;

// The Reserved Numbers Analytics Chart Card

interface Props {
  rooms_analytics_data: RoomAnalyticsInterface;
}

export default function RoomsNumberAnalyticsChartCard({
  rooms_analytics_data,
}: Props) {
  // total rooms data
  const total_rooms_number = useMemo(
    () => rooms_analytics_data.rooms_number,
    []
  );

  // data
  const chartData = useMemo(() => {
    return [
      {
        status: "valid",
        number:
          rooms_analytics_data.rooms_number -
          rooms_analytics_data.rooms_deleted_number,
        fill: "#3b82f6",
      },
      {
        status: "deleted",
        number: rooms_analytics_data.rooms_deleted_number,
        fill: "#ef4444",
      },
    ];
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col p-4">
      <CardHeader className="items-center p-0 space-y-0.5">
        <CardTitle className="w-full text-lg">
          Rooms Status Distribution
        </CardTitle>
        <CardDescription className="w-full text-xs font-medium text-foreground/60">
          Distribution of rooms by status
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              dataKey="number"
              nameKey="status"
              data={chartData}
              innerRadius={70}
              strokeWidth={5}
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
                          className="fill-foreground text-4xl font-bold font-mono"
                        >
                          {(total_rooms_number >= 99_999
                            ? "+99999"
                            : total_rooms_number
                          )
                            .toString()
                            .toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-foreground font-medium"
                        >
                          Total Rooms
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
