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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ReportContent from "./components/ReportContent";
import ReportChart from "./components/ReportChart";
import LoadingModal from "./components/LoadingModel";

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

const questions = [
  {
    topic: "Regression vs. Correlation",
    question:
      "A company is interested in predicting its annual revenue based on various factors like advertising spend, product pricing, and market trends. Explain the difference between regression and correlation, and why regression would be more appropriate for this prediction task than correlation. Give me a chart data for this and Formulas for Regression and Correlation",
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
  {
    topic: "Regression Analysis in Time Series",
    question:
      "You are analyzing monthly sales data for the past 5 years to forecast future sales. How would you approach this using regression analysis? What specific challenges might you encounter when applying regression to time series data, and how would you address them?",
  },
  {
    topic: "Bias-Variance Tradeoff",
    question:
      "In a machine learning model designed to predict customer churn, you notice that the model performs well on training data but poorly on validation data. Discuss how the bias-variance tradeoff explains this issue and suggest ways to resolve it.",
  },
  {
    topic: "Overfitting and Underfitting",
    question:
      "You are building a predictive model for housing prices based on various features (e.g., square footage, number of bedrooms, neighborhood). After tuning the model, you notice that it fits the training data perfectly but struggles to generalize to new data. What is happening in terms of overfitting, and how can you address it?",
  },
  {
    topic: "Regression Techniques - Linear Regression",
    question:
      "A startup company wants to predict monthly revenue based on advertising spend using a linear regression model. What are the steps involved in building and evaluating this model, and how would you interpret the model's coefficients?",
  },
  {
    topic: "Polynomial Regression",
    question:
      "You notice that the relationship between advertising spend and revenue is not linear but follows a curvilinear pattern. How would you apply polynomial regression to model this relationship, and what challenges might arise when using this technique?",
  },
  {
    topic: "Evaluation Metrics: MSE, MAE, RMSE, R-squared",
    question:
      "You've applied a random forest regression model to predict customer lifetime value (CLV). After training the model, you evaluate it using metrics such as MSE, MAE, RMSE, and R-squared. Which metric would you prioritize for model evaluation, and why? How do these metrics help in assessing model performance?",
  },
  {
    topic:
      "Advanced Regression Techniques: Random Forest and Support Vector Regression",
    question:
      "In an attempt to predict energy consumption for a manufacturing plant, you are choosing between random forest regression and support vector regression. What factors would influence your choice between these two techniques, and how would you assess their respective advantages and limitations for this particular application?",
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
        "http://localhost:9000/generate-report",
        {
          topic: selectedQuestion.topic,
          question: selectedQuestion.question,
        }
      );
      const { report, chartData } = response.data;
      setReport(report);
      setChartData(chartData);
      console.log("Report generated:", report);
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
                  setSelectedQuestion(questions[Number.parseInt(value)])
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

        {loading && <LoadingModal />}

        {report && chartData && !loading && (
          <div id="report-content" className="mt-8 space-y-8 border-accent">
            <ReportContent report={report} />
            <ReportChart chartData={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}
