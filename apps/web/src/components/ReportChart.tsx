import { Line, Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface ReportChartProps {
  chartData: ChartData;
}

export default function ReportChart({ chartData }: ReportChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: chartData.data.datasets[0].label,
      },
    },
  };

  const renderChart = () => {
    switch (chartData.chartType) {
      case "line":
        return <Line options={options} data={chartData.data} />;
      case "bar":
        return <Bar options={options} data={chartData.data} />;
      case "scatter":
        return <Scatter options={options} data={chartData.data} />;
      default:
        return <Line options={options} data={chartData.data} />;
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Chart</h2>
      {renderChart()}
      <p className="mt-4 text-sm text-gray-500">{chartData.description}</p>
    </div>
  );
}
