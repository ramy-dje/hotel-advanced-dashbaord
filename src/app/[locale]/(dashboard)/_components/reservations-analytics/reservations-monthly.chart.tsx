import { ReservationsAnalyticsInterface } from "@/interfaces/analytics";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { eachDayOfInterval } from "date-fns";

// Charts config
const chartConfig = {
  numbers: {
    // Changed from 'number' to match the dataKey in Area component
    label: "Reservations",
    color: "#2563EB", // Match the color used in Area component
  },
} satisfies ChartConfig;

// The Reservations Monthly Analytics Chart Card

interface Props {
  reservations_analytics_data: ReservationsAnalyticsInterface;
}

export default function ReservationsMonthlyAnalyticsChartCard({
  reservations_analytics_data,
}: Props) {
  // data
  const chartData = useMemo(() => {
    // generating each data from today to a month ago using date-fns
    const dates = eachDayOfInterval({
      start: new Date(new Date().setDate(new Date().getDate() - 20)),
      end: new Date(),
    });

    return dates.map((date) => {
      const matchingReservation =
        reservations_analytics_data.reservations_by_days_number.find(
          (e) =>
            new Date(e.date).toDateString() == new Date(date).toDateString()
        );

      return {
        date: date,
        numbers: matchingReservation?.reservations || 0,
      };
    });
  }, []);

  return (
    <Card className="col-span-full lg:col-span-2 flex flex-col p-4 pb-0">
      <CardHeader className="items-center p-0 mb-3 space-y-0.5">
        <CardTitle className="w-full text-lg">
          Daily Reservation Trends
        </CardTitle>
        <CardDescription className="w-full text-xs font-medium text-foreground/60">
          Overview of booking patterns over recent 20 days
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[270px] w-full p-0"
        >
          <BarChart data={chartData} margin={{ right: 20 }}>
            <CartesianGrid vertical={true} strokeDasharray="5 5" />
            <YAxis
              minTickGap={10}
              tickMargin={8}
              tickLine={false}
              axisLine={false}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              className="text-foreground"
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, entry) => {
                    // entry contains the actual data point
                    const dataPoint = entry[0]?.payload;
                    if (!dataPoint?.date) return "";
                    return new Date(dataPoint.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="numbers"
              type="monotone"
              fill="#2563EB"
              stroke="#2563EB"
              // strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
