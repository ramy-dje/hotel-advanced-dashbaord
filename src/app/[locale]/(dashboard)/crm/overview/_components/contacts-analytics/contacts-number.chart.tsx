import { CRMContactAnalyticsInterface } from "@/interfaces/analytics";
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
  dashboard: {
    label: "Dashboard",
  },
  website: {
    label: "Website",
  },
} satisfies ChartConfig;

// The CRM Contacts Numbers Analytics Chart Card

interface Props {
  crm_contacts_analytics_data: CRMContactAnalyticsInterface;
}

export default function CRMContactsNumberAnalyticsChartCard({
  crm_contacts_analytics_data,
}: Props) {
  // total data
  const total_number_data = useMemo(
    () => crm_contacts_analytics_data.contacts_total_number,
    []
  );

  // data
  const chartData = useMemo(() => {
    return [
      {
        status: "dashboard",
        number: crm_contacts_analytics_data.contacts_inserted_numbers.dashboard,
        fill: "#22c55e",
      },
      {
        status: "website",
        number: crm_contacts_analytics_data.contacts_inserted_numbers.website,
        fill: "#a855f7",
      },
    ];
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col p-4">
      <CardHeader className="items-center p-0 space-y-0.5">
        <CardTitle className="w-full text-lg">
          Contacts Distribution
        </CardTitle>
        <CardDescription className="w-full text-xs font-medium text-foreground/60">
          Breakdown of CRM contacts by source (website or dashboard)
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
                          {(total_number_data >= 99_999
                            ? "+99999"
                            : total_number_data
                          )
                            .toString()
                            .toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-foreground font-medium"
                        >
                          Total Contacts
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
