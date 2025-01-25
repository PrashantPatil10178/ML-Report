import { useState } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
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
    number: 1,
    topic: "Regression vs. Correlation",
    question:
      "A company is interested in predicting its annual revenue based on various factors like advertising spend, product pricing, and market trends. Explain the difference between regression and correlation, and why regression would be more appropriate for this prediction task than correlation. Give me a chart data for this and Formulas for Regression and Correlation",
  },
  {
    number: 2,
    topic: "Types of Regression (Univariate vs. Multivariate)",
    question:
      "A company wants to predict its sales based on just advertising expenditure. Should it use a univariate regression model or a multivariate regression model? What would be the impact on the model's prediction accuracy if multiple factors such as store location and competitor pricing were included in the analysis?",
  },
  {
    number: 3,
    topic: "Linear vs. Nonlinear Regression",
    question:
      "A retail store manager is analyzing how sales are affected by advertising spend. The relationship appears to be nonlinear (e.g., sales increase at first but taper off as the budget increases). How would nonlinear regression techniques be applied here, and what are the advantages of using them over linear regression?",
  },
  {
    number: 4,
    topic: "Simple Linear vs. Multiple Linear Regression",
    question:
      "A company is trying to analyze its total employee performance based on their years of experience and training hours. Would a simple linear regression or multiple linear regression be more suitable for this task? Justify your choice.",
  },

  {
    number: 5,
    topic: "Bias-Variance Tradeoff",
    question:
      "In a machine learning model designed to predict customer churn, you notice that the model performs well on training data but poorly on validation data. Discuss how the bias-variance tradeoff explains this issue and suggest ways to resolve it.",
  },
  {
    number: 6,
    topic: "Overfitting and Underfitting",
    question:
      "You are building a predictive model for housing prices based on various features (e.g., square footage, number of bedrooms, neighborhood). After tuning the model, you notice that it fits the training data perfectly but struggles to generalize to new data. What is happening in terms of overfitting, and how can you address it?",
  },
  {
    number: 7,
    topic: "Regression Techniques - Linear Regression",
    question:
      "A startup company wants to predict monthly revenue based on advertising spend using a linear regression model. What are the steps involved in building and evaluating this model, and how would you interpret the model's coefficients?",
  },
  {
    number: 8,
    topic: "Polynomial Regression",
    question:
      "You notice that the relationship between advertising spend and revenue is not linear but follows a curvilinear pattern. How would you apply polynomial regression to model this relationship, and what challenges might arise when using this technique?",
  },
  {
    number: 9,
    topic: "Evaluation Metrics: MSE, MAE, RMSE, R-squared",
    question:
      "You've applied a random forest regression model to predict customer lifetime value (CLV). After training the model, you evaluate it using metrics such as MSE, MAE, RMSE, and R-squared. Which metric would you prioritize for model evaluation, and why? How do these metrics help in assessing model performance?",
  },
  {
    number: 10,
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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="container mx-auto max-w-4xl mb-8">
        <Card className="w-full bg-gray-800 shadow-lg rounded-lg border-gray-700">
          <CardHeader className="text-center py-8 border-b border-gray-700">
            <CardTitle className="text-3xl font-bold text-blue-400">
              ML Report Generator
            </CardTitle>
            <CardDescription className="text-lg text-gray-400 mt-2">
              Generate detailed reports on machine learning concepts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-lg font-medium text-gray-300"
              >
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg py-2"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="question"
                className="text-lg font-medium text-gray-300"
              >
                Select a Question
              </Label>
              <Select
                onValueChange={(value) =>
                  setSelectedQuestion(questions[Number.parseInt(value)])
                }
              >
                <SelectTrigger className="bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 text-lg py-2">
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 max-h-[300px] overflow-y-auto">
                  {questions.map((q, index) => (
                    <SelectItem
                      key={index}
                      value={index.toString()}
                      className="py-2 text-white hover:bg-blue-600"
                    >
                      {`${q.number}. ${q.topic}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center py-6 border-t border-gray-700">
            <Button
              onClick={generateReport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md text-lg transition-all duration-300 ease-in-out"
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              Generate Report
            </Button>
          </CardFooter>
        </Card>

        {loading && <LoadingModal />}

        {report && chartData && !loading && (
          <div
            id="report-content"
            className="mt-12 space-y-8 bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-blue-400 mb-4">
              Generated Report
            </h2>
            <ReportContent report={report} />
            <ReportChart chartData={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}
