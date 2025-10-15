import { DestinationsAnalyticsInterface } from "@/interfaces/analytics";
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
  status: {
    label: "Period",
  },
  destinations: {
    label: "Destinations",
    color: "#F59E0B", // #F59E0B
  },
} satisfies ChartConfig;

// The Destinations period Analytics Chart Card

interface Props {
  destinations_analytics_data: DestinationsAnalyticsInterface;
}

export default function DestinationsPeriodAnalyticsChartCard({
  destinations_analytics_data,
}: Props) {
  // total destinations data
  const total_destinations_data = useMemo(
    () => destinations_analytics_data.destinations_number,
    []
  );
  // data
  const chartData = useMemo(() => {
    return [
      {
        status: "Today",
        destinations:
          destinations_analytics_data.destinations_by_period_number
            .today_number,
        fill: "#F59E0B",
      },
      {
        status: "Yesterday",
        destinations:
          destinations_analytics_data.destinations_by_period_number
            .yesterday_number,
        fill: "#F59E0B",
      },
      {
        status: "Last Week",
        destinations:
          destinations_analytics_data.destinations_by_period_number.week_number,
        fill: "#F59E0B",
      },
      {
        status: "Last Month",
        destinations:
          destinations_analytics_data.destinations_by_period_number
            .month_number,
        fill: "#F59E0B",
      },
    ];
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col p-4">
      <CardHeader className="flex flex-row justify-between items-start p-0 space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="w-full text-lg">
            Destinations Activity Over Time
          </CardTitle>
          <CardDescription className="w-full text-xs font-medium text-foreground/60">
            Analysis of destinations activity across various time periods
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-foreground text-2xl font-bold leading-none sm:text-4xl">
            {(total_destinations_data >= 99_999
              ? "+99999"
              : total_destinations_data
            )
              .toString()
              .toLocaleString()}
          </h2>
          <p className="text-foreground/60 text-xs">Destination(s)</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="max-h-[250px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="destinations"
              fill="#F59E0B"
              layout="vertical"
              radius={5}
            >
              <LabelList
                dataKey="status"
                position="insideLeft"
                offset={10}
                fontSize={12}
                className="fill-white"
              />
              <LabelList
                dataKey="destinations"
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
