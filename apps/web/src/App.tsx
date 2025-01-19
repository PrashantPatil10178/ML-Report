import { useState } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Skeleton } from "./components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ReportContent from "./components/ReportContent";
import ReportChart from "./components/ReportChart";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const questions = [
  {
    topic: "Regression vs. Correlation",
    question:
      "A company is interested in predicting its annual revenue based on various factors like advertising spend, product pricing, and market trends. Explain the difference between regression and correlation, and why regression would be more appropriate for this prediction task than correlation.Give me a chart data for this and Formulas for Regression and Correlation",
  },
  {
    topic: "Types of Regression (Univariate vs. Multivariate)",
    question:
      "A company wants to predict its sales based on just advertising expenditure. Should it use a univariate regression model or a multivariate regression model? What would be the impact on the model's prediction accuracy if multiple factors such as store location and competitor pricing were included in the analysis?",
  },
  {
    topic: "Linear vs. Nonlinear Regression",
    question:
      "A retail store manager is analyzing how sales are affected by advertising spend. The relationship appears to be nonlinear (e.g., sales increase at first but taper off as the budget increases). How would nonlinear regression techniques be applied here, and what are the advantages of using them over linear regression?",
  },
  {
    topic: "Simple Linear vs. Multiple Linear Regression",
    question:
      "A company is trying to analyze its total employee performance based on their years of experience and training hours. Would a simple linear regression or multiple linear regression be more suitable for this task? Justify your choice.",
  },
];

export default function App() {
  const [name, setName] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [report, setReport] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateReport = async () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/generate-report",
        {
          topic: selectedQuestion.topic,
          question: selectedQuestion.question,
        }
      );
      const reportData = response.data.data;
      setReport(reportData);
      setChartData({
        labels: ["Advertising Spend", "Product Pricing", "Market Trends"],
        datasets: [
          {
            label: "Annual Revenue",
            data: [200000, 250000, 300000],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // const downloadPDF = async () => {
  //   const element = document.getElementById("report-content");
  //   if (!element) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to download PDF. Please try again.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   const canvas = await html2canvas(element);
  //   const data = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF();
  //   const imgProperties = pdf.getImageProperties(data);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  //   pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save("ml_report.pdf");
  // };

  return (
    <div className="dark min-h-screen text-primary bg-background p-4">
      <div className="container mx-auto max-w-4xl mb">
        <Card className="w-full bg-background shadow-lg rounded-md border-accent">
          <CardHeader className="text-center py-6">
            <CardTitle className="text-2xl font-semibold text-white-800">
              ML Report Generator
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Generate a detailed report on machine learning concepts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-accent text-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question">Select a Question</Label>
              <Select
                onValueChange={(value) =>
                  setSelectedQuestion(questions[parseInt(value)])
                }
              >
                <SelectTrigger className="bg-accent text-white border border-gray-300 focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent className="bg-accent">
                  {questions.map((q, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {q.topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center py-4">
            <Button
              onClick={generateReport}
              disabled={loading}
              className="bg-primary hover:bg-background hover:border hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-md"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Report
            </Button>
          </CardFooter>
        </Card>

        {loading && (
          <Card className="mt-8 border-accent shadow-lg rounded-md">
            <CardHeader>
              <Skeleton className="h-4 w-1/2 bg-gray-300" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2 bg-gray-300" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-300" />
              <Skeleton className="h-4 w-2/3 bg-gray-300" />
            </CardContent>
          </Card>
        )}

        {report && chartData && !loading && (
          <div id="report-content" className="mt-8 space-y-8 border-accent">
            <ReportContent report={report} />
            <ReportChart chartData={chartData} />
            <div className="flex justify-center">
              {/* <Button
                onClick={downloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
              >
                Download as PDF
              </Button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
