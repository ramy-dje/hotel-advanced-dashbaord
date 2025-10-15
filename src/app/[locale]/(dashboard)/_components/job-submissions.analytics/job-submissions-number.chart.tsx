import { JobsAnalyticsInterface } from "@/interfaces/analytics";
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
  free: {
    label: "Spontaneous",
  },
  job: {
    label: "Job",
  },
} satisfies ChartConfig;

// The Job submissions Numbers Analytics Chart Card

interface Props {
  job_analytics_data: JobsAnalyticsInterface;
}

export default function JobSubmissionsNumberAnalyticsChartCard({
  job_analytics_data,
}: Props) {
  // total rooms data
  const total_number = useMemo(
    () => job_analytics_data.submissions_total_number,
    []
  );

  // data
  const chartData = useMemo(() => {
    return [
      {
        status: "free",
        number: job_analytics_data.submissions_free_total_number,
        fill: "#a855f7",
      },
      {
        status: "job",
        number: job_analytics_data.submissions_job_total_number,
        fill: "#0284c7",
      },
    ];
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col p-4">
      <CardHeader className="items-center p-0 space-y-0.5">
        <CardTitle className="w-full text-lg">
          Job Submissions Type Distribution
        </CardTitle>
        <CardDescription className="w-full text-xs font-medium text-foreground/60">
          Distribution of job submissions by type
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
                          {(total_number >= 99_999 ? "+99999" : total_number)
                            .toString()
                            .toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-foreground font-medium"
                        >
                          Total Submissions
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
