import dotenv from "dotenv";
import axios from "axios";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

dotenv.config();
const apiKey = `${process.env.TAVILY_API_KEY}`;

function generateRequestBody(apiKey: string, topic: string, question: string) {
  return {
    api_key: apiKey,
    query: `Analyze the topic: ${topic}. The question is: "${question}". Provide a detailed report with the following structure:

    1. Introduction
    - Define the key concepts related to ${topic}
    - Explain the relevance of these concepts in the context of the question
    - Introduce the case study or scenario presented in the question

    2. Methodology
    - Describe the relevant techniques or comparisons involved in ${topic}
    - Provide formulas and mathematical concepts using LaTeX notation
    - Outline the steps for implementing the appropriate analysis

    3. Approach
    - Provide detailed mathematical steps to solve the problem using the most suitable technique for ${topic}
    - Include sample values if applicable
    - Show calculations for key parameters
    - Derive the final equation or model
    - If relevant, make a prediction or analysis using the derived model

    4. Significance
    - Explain why the chosen approach is appropriate for this specific task
    - Discuss advantages and potential limitations of the method
    - Interpret the results in the context of the business problem
    - Briefly mention how to evaluate the accuracy or effectiveness of the approach

    5. Conclusion
    - Summarize key points of the analysis
    - Emphasize the effectiveness of the chosen approach for the given problem
    - Highlight the practical implications and potential future applications

    Use LaTeX notation for all mathematical formulas. Format the response in Markdown with proper headings and sections.`,
  };
}

function generateChartBody(apiKey: string, topic: string, question: string) {
  return {
    api_key: apiKey,
    query: `Based on the topic "${topic}" and the question "${question}", generate sample data for a chart that illustrates a key relationship or concept related to this topic. Provide ONLY the following JSON data structure without any additional text or explanation:
    {
      "chartType": "line",
      "data": {
        "labels": ["label1", "label2", "label3", "label4", "label5"],
        "datasets": [
          {
            "label": "Y-Axis Label",
            "data": [number1, number2, number3, number4, number5],
            "borderColor": "rgb(75, 192, 192)",
            "tension": 0.1
          }
        ]
      },
      "description": "A brief description of what this chart represents"
    }
    Replace "label1", "label2", etc. with appropriate x-axis labels, and number1, number2, etc. with corresponding y-axis values. The "chartType" should be either "line", "bar", or "scatter" depending on what's most appropriate for the data. Ensure the data reflects a realistic relationship that's relevant to the topic and question. The "description" should briefly explain what the chart represents in the context of the topic and question.`,
  };
}

async function makeRequest(
  apiKey: string,
  topic: string,
  question: string,
  isChartRequest: boolean = false
): Promise<any> {
  const body = isChartRequest
    ? generateChartBody(apiKey, topic, question)
    : generateRequestBody(apiKey, topic, question);

  try {
    const response = await axios.post(
      "https://cehewlkelxpx6ut2x2crpewo3y0gmemy.lambda-url.us-east-1.on.aws/researchAPI",
      body,
      {
        headers: {
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "Content-Type": "application/json",
          Priority: "u=3, i",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

function processApiResponse(apiResponse: any): any {
  if (typeof apiResponse === "string") {
    return apiResponse;
  }
  if (typeof apiResponse === "object" && apiResponse !== null) {
    return apiResponse;
  }
  return "Error: Unexpected response format";
}

function parseChartData(chartResponse: string): any {
  try {
    // First, try to parse the entire response as JSON
    return JSON.parse(chartResponse);
  } catch (e) {
    console.error(
      "Failed to parse entire response as JSON, attempting to extract JSON"
    );

    // If parsing fails, try to extract JSON from the string
    const jsonMatch = chartResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const extractedJson = jsonMatch[0];
        console.log("Extracted JSON:", extractedJson);
        return JSON.parse(extractedJson);
      } catch (e) {
        console.error("Error parsing extracted JSON:", e);
      }
    }

    // If all parsing attempts fail, log the response and return a default structure
    console.error("Failed to parse chart data, using default structure");
    console.log("Raw chart response:", chartResponse);
    return {
      chartType: "line",
      data: {
        labels: ["No Data"],
        datasets: [
          {
            label: "No Data Available",
            data: [0],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      description: "No data available for the requested topic and question.",
    };
  }
}

app.post(
  "/generate-report",
  async (req: Request, res: Response): Promise<void> => {
    const { topic, question } = req.body;
    if (!topic || !question) {
      res
        .status(400)
        .json({ error: "Missing required fields: topic or question." });
      return;
    }

    try {
      const [reportResponse, chartResponse] = await Promise.all([
        makeRequest(apiKey, topic, question),
        makeRequest(apiKey, topic, question, true),
      ]);

      const processedReportData = processApiResponse(reportResponse);
      const processedChartData = parseChartData(chartResponse);

      res.status(200).json({
        report: processedReportData,
        chartData: processedChartData,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  }
);

app.listen(9000, () => {
  console.log("Server is running on port 3000");
});
