import { CRMContactAnalyticsInterface } from "@/interfaces/analytics";
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
  contacts: {
    label: "Contacts",
    color: "#4A90E2", // #4A90E2
  },
} satisfies ChartConfig;

// The CRM contacts period Analytics Chart Card

interface Props {
  crm_contacts_analytics_data: CRMContactAnalyticsInterface;
}

export default function CRMContactsPeriodAnalyticsChartCard({
  crm_contacts_analytics_data,
}: Props) {
  // total contacts data
  const total_contacts_data = useMemo(
    () => crm_contacts_analytics_data.contacts_total_number,
    []
  );
  // data
  const chartData = useMemo(() => {
    return [
      {
        status: "Today",
        contacts:
          crm_contacts_analytics_data.contacts_by_period_number.today_number,
        fill: "#4A90E2",
      },
      {
        status: "Yesterday",
        contacts:
          crm_contacts_analytics_data.contacts_by_period_number
            .yesterday_number,
        fill: "#4A90E2",
      },
      {
        status: "Last Week",
        contacts:
          crm_contacts_analytics_data.contacts_by_period_number.week_number,
        fill: "#4A90E2",
      },
      {
        status: "Last Month",
        contacts:
          crm_contacts_analytics_data.contacts_by_period_number.month_number,
        fill: "#4A90E2",
      },
    ];
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col p-4">
      <CardHeader className="flex flex-row justify-between items-start p-0 space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="w-full text-lg">
            Contacts Activity
          </CardTitle>
          <CardDescription className="w-full text-xs font-medium text-foreground/60">
            Analysis of crm contacts activity across various time periods
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-foreground text-2xl font-bold leading-none sm:text-4xl">
            {(total_contacts_data >= 99_999 ? "+99999" : total_contacts_data)
              .toString()
              .toLocaleString()}
          </h2>
          <p className="text-foreground/60 text-xs">Contact(s)</p>
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
            <Bar dataKey="contacts" fill="#4A90E2" layout="vertical" radius={4}>
              <LabelList
                dataKey="status"
                position="insideLeft"
                offset={10}
                fontSize={12}
                className="fill-white"
              />
              <LabelList
                dataKey="contacts"
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
