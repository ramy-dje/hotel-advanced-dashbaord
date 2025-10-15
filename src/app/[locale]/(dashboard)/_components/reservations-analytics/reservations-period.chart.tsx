import { ReservationsAnalyticsInterface } from "@/interfaces/analytics";
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
  reservations: {
    label: "Reservations",
    color: "#3B82F6", // #3B82F6
  },
} satisfies ChartConfig;

// The Reservations period Analytics Chart Card

interface Props {
  reservations_analytics_data: ReservationsAnalyticsInterface;
}

// helpful label component
const renderCustomLabel = (props: any) => {
  const { x, y, width, height, value, position } = props;

  // If value is 0, adjust positioning to prevent overlap
  const xOffset = value === 0 ? 40 : 8;

  return position === "right" ? (
    <text
      x={x + width + xOffset}
      y={y + height / 2}
      fill="#888"
      textAnchor="start"
      dominantBaseline="central"
      fontSize={12}
    >
      {value}
    </text>
  ) : (
    <text
      x={x + 8}
      y={y + height / 2}
      fill="#888"
      textAnchor="start"
      dominantBaseline="central"
      fontSize={12}
    >
      {props.dataKey === "status" ? value : ""}
    </text>
  );
};

// chart logic
export default function ReservationsPeriodAnalyticsChartCard({
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
        status: "Today",
        reservations:
          reservations_analytics_data.reservations_by_period_number
            .today_number,
        fill: "#3B82F6",
      },
      {
        status: "Yesterday",
        reservations:
          reservations_analytics_data.reservations_by_period_number
            .yesterday_number,
        fill: "#3B82F6",
      },
      {
        status: "Last Week",
        reservations:
          reservations_analytics_data.reservations_by_period_number.week_number,
        fill: "#3B82F6",
      },
      {
        status: "Last Month",
        reservations:
          reservations_analytics_data.reservations_by_period_number
            .month_number,
        fill: "#3B82F6",
      },
    ];
  }, []);

  return (
    <Card className="col-span-full lg:col-span-2 flex flex-col p-4">
      <CardHeader className="flex flex-row justify-between items-start p-0 space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="w-full text-lg">
            {" "}
            Reservations Activity Over Time
          </CardTitle>
          <CardDescription className="w-full text-xs font-medium text-foreground/60">
            Analysis of reservation activity across various time periods
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-foreground text-2xl font-bold leading-none sm:text-4xl">
            {(total_reservations_data >= 99_999
              ? "+99999"
              : total_reservations_data
            )
              .toString()
              .toLocaleString()}
          </h2>
          <p className="text-foreground/60 text-xs">Reservation(s)</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig} className="max-h-[270px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
              left: 16,
              top: 16,
              bottom: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis type="number" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="reservations" fill="#3B82F6" radius={[0, 5, 5, 0]}>
              <LabelList
                dataKey="status"
                position="insideLeft"
                content={renderCustomLabel}
                className="fill-[--color-label]"
              />
              <LabelList
                dataKey="reservations"
                position="right"
                content={renderCustomLabel}
                className="fill-foreground"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
