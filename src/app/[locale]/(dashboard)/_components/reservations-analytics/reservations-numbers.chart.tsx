import { ReservationsAnalyticsInterface } from "@/interfaces/analytics";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Charts config
const chartConfig = {
  reservations: {
    label: "Reservations",
  },
  pending: {
    label: "Pending",
    color: "#eab308",
  },
  approved: {
    label: "Approved",
    color: "#22c55e",
  },
  completed: {
    label: "Completed",
    color: "#3b82f6",
  },
  canceled: {
    label: "Canceled",
    color: "#6b7280",
  },
  archived: {
    label: "Archived",
    color: "#ef4444",
  },
} satisfies ChartConfig;

// The Reservations Numbers Analytics Chart Card

interface Props {
  reservations_analytics_data: ReservationsAnalyticsInterface;
}

export default function ReservationsNumberAnalyticsChartCard({
  reservations_analytics_data,
}: Props) {
  // total reservations data
  const total_reservations_data = useMemo(
    () => reservations_analytics_data.reservations_total_number,
    []
  );

  // data
  const chartData = useMemo(() => {
    return [
      {
        status: "approved",
        reservations: reservations_analytics_data.reservations_approved,
        fill: "#22c55e",
      },
      {
        status: "pending",
        reservations: reservations_analytics_data.reservations_pending,
        fill: "#eab308",
      },
      {
        status: "canceled",
        reservations: reservations_analytics_data.reservations_canceled,
        fill: "#6b7280",
      },
      {
        status: "archived",
        reservations: reservations_analytics_data.reservations_deleted,
        fill: "#ef4444",
      },
      {
        status: "completed",
        reservations: reservations_analytics_data.reservations_completed,
        fill: "#3b82f6",
      },
    ];
  }, []);

  return (
    <Card className="col-span-full 2xl:col-span-1 flex flex-col p-4 px-0">
      <CardHeader className="items-center p-0 px-4 space-y-0.5">
        <CardTitle className="w-full text-lg">
          Reservation Status Distribution
        </CardTitle>
        <CardDescription className="w-full text-xs font-medium text-foreground/60">
          Distribution of reservations by status
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend
              content={
                <ChartLegendContent
                  nameKey="status"
                  className="flex -translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              }
            />
            <Pie
              data={chartData}
              className="min-w-max"
              dataKey="reservations"
              nameKey="status"
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
                          {(total_reservations_data >= 99_999
                            ? "+99999"
                            : total_reservations_data
                          )
                            .toString()
                            .toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-foreground font-medium"
                        >
                          Total Reservations
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
