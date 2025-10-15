import { RoomAnalyticsInterface } from "@/interfaces/analytics";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
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
} from "@/components/ui/chart";

// Charts config
const chartConfig = {
  name: {
    label: "Name",
    color: "blue", // #ef4444
  },
  total: {
    label: "Reservations",
    color: "#ef4444", // #ef4444
  },
} satisfies ChartConfig;

// The most reserved rooms Analytics Chart Card

interface Props {
  rooms_analytics_data: RoomAnalyticsInterface;
}

export default function RoomsReservedAnalyticsChartCard({
  rooms_analytics_data,
}: Props) {
  // Transform data for the chart
  const chartData = useMemo(
    () =>
      rooms_analytics_data.rooms_reserved_number
        .map((room) => ({
          name: room.title,
          total: room.reservations,
        }))
        .filter((e) => e.total !== 0),
    []
  );

  // total
  const total_numbers = useMemo(() => {
    return chartData.reduce((a, b) => a + b.total, 0);
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col p-4">
      <CardHeader className="flex flex-row justify-between items-start p-0 mb-3 space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="w-full text-lg">
            Top {chartData.length} Most Reserved Rooms
          </CardTitle>
          <CardDescription className="w-full text-xs font-medium text-foreground/60">
            Overview of the most reserved rooms in the hotel
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-foreground text-2xl font-bold leading-none sm:text-4xl">
            {(total_numbers >= 99_999 ? "+99999" : total_numbers)
              .toString()
              .toLocaleString()}
          </h2>
          <p className="text-foreground/60 text-xs">Reservation(s)</p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="max-h-[250px]">
          <BarChart
            data={chartData}
            accessibilityLayer
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis type="number" hide />
            <CartesianGrid horizontal={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="total" layout="vertical" fill="#ef4444" radius={4}>
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={10}
                className="fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="total"
                position="right"
                offset={8}
                className="fill-foreground/90"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
