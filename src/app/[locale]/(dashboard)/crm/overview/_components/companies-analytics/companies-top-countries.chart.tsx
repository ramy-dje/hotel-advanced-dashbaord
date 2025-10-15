import { CRMCompanyAnalyticsInterface } from "@/interfaces/analytics";
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
  },
  total: {
    label: "Companies",
    color: "#50C878", // #50C878
  },
} satisfies ChartConfig;

// The top crm companies countries Analytics Chart Card

interface Props {
  crm_companies_analytics_data: CRMCompanyAnalyticsInterface;
}

export default function TopCRMCompaniesCountriesAnalyticsChartCard({
  crm_companies_analytics_data,
}: Props) {
  // Transform data for the chart
  const chartData = useMemo(
    () =>
      crm_companies_analytics_data.companies_top_countries
        .map((country) => ({
          name: country.country,
          total: country.companies,
        }))
        .filter((e) => e.total !== 0 && e.name !== null && e.name.trim()),
    []
  );

  // total
  const total_number = useMemo(() => {
    return chartData.length;
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col p-4">
      <CardHeader className="flex flex-row justify-between items-start p-0 mb-3 space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="w-full text-lg">
            Companies Countries
          </CardTitle>
          <CardDescription className="w-full text-xs font-medium text-foreground/60">
            Overview of the top CRM companies countries
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-foreground text-2xl font-bold leading-none sm:text-4xl">
            {(total_number >= 99_999 ? "+99999" : total_number)
              .toString()
              .toLocaleString()}
          </h2>
          <p className="text-foreground/60 text-xs">Country(s)</p>
        </div>
      </CardHeader>

      <CardContent className="w-full flex-1 p-0">
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
            <Bar dataKey="total" layout="vertical" fill="#50C878" radius={4}>
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
