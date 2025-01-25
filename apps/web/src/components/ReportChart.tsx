import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ChartData {
  chartType: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      tension: number;
    }[];
  };
  description: string;
}

export default function ReportChart({ chartData }: { chartData: ChartData }) {
  const formattedData = chartData.data.labels.map((label, index) => ({
    name: label,
    ...chartData.data.datasets.reduce(
      (acc, dataset) => {
        acc[dataset.label] = dataset.data[index];
        return acc;
      },
      {} as Record<string, number>
    ),
  }));

  return (
    <Card className="w-full shadow-xl overflow-hidden">
      <CardHeader>
        <CardTitle>{chartData.chartType} Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ...chartData.data.datasets.reduce(
              (acc, dataset) => {
                acc[dataset.label] = {
                  label: dataset.label,
                  color: dataset.borderColor,
                };
                return acc;
              },
              {} as Record<string, { label: string; color: string }>
            ),
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              {chartData.data.datasets.map((dataset, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.borderColor}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="text-sm text-muted-foreground mt-2">
          {chartData.description}
        </p>
      </CardContent>
    </Card>
  );
}
