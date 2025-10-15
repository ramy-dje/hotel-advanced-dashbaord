import { JobsAnalyticsInterface } from "@/interfaces/analytics";
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
  free: {
    label: "Spontaneous",
  },
  job: {
    label: "Job",
  },
} satisfies ChartConfig;

// The job submissions period Analytics Chart Card

interface Props {
  job_analytics_data: JobsAnalyticsInterface;
}

export default function JobSubmissionsPeriodAnalyticsChartCard({
  job_analytics_data,
}: Props) {
  // total number data
  const total_number = useMemo(
    () => job_analytics_data.submissions_total_number,
    []
  );
  // data
  const chartData = useMemo(() => {
    return [
      {
        status: "Today",
        free: job_analytics_data.submissions_free_by_period_number.today_number,
        job: job_analytics_data.submissions_job_by_period_number.today_number,
      },
      {
        status: "Yesterday",
        free: job_analytics_data.submissions_free_by_period_number
          .yesterday_number,
        job: job_analytics_data.submissions_job_by_period_number
          .yesterday_number,
      },
      {
        status: "Last Week",
        free: job_analytics_data.submissions_free_by_period_number.week_number,
        job: job_analytics_data.submissions_job_by_period_number.week_number,
      },
      {
        status: "Last Month",
        free: job_analytics_data.submissions_free_by_period_number.month_number,
        job: job_analytics_data.submissions_job_by_period_number.month_number,
      },
    ];
  }, []);

  return (
    <Card className="col-span-full lg:col-span-1 flex flex-col p-4">
      <CardHeader className="flex flex-row justify-between items-start p-0 space-y-0">
        <div className="space-y-0.5">
          <CardTitle className="w-full text-lg">
            Job Submissions Over Time
          </CardTitle>
          <CardDescription className="w-full text-xs font-medium text-foreground/60">
            Submissions of jobs across various time periods
          </CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <h2 className="text-foreground text-2xl font-bold leading-none sm:text-4xl">
            {(total_number >= 99_999 ? "+99999" : total_number)
              .toString()
              .toLocaleString()}
          </h2>
          <p className="text-foreground/60 text-xs">Submission(s)</p>
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

            <Bar dataKey="free" fill="#a855f7" layout="vertical" radius={4}>
              <LabelList
                dataKey="status"
                position="insideLeft"
                offset={10}
                fontSize={12}
                className="fill-white"
              />
              <LabelList
                dataKey="free"
                position="right"
                offset={8}
                className="fill-foreground/90"
                fontSize={12}
              />
            </Bar>

            <Bar dataKey="job" fill="#0284c7" layout="vertical" radius={4}>
              <LabelList
                dataKey="status"
                position="insideLeft"
                offset={10}
                fontSize={12}
                className="fill-white"
              />
              <LabelList
                dataKey="job"
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
