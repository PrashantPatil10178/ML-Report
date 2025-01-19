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
    query: `My Question is ${question}.Conduct a detailed study on the topic: ${topic}. The research should be structured in the following format:  Introduction  Provide an overview of the topic, including its relevance and applications. Mention key Machine Learning (ML) algorithms or concepts used (e.g., Regression and Correlation). Methodology  Explain the methodology in a step-by-step manner. Include detailed explanations of algorithms, along with any necessary mathematical concepts. Approach  Describe the specific steps or ML methods used to solve the problem. Significance  Highlight the importance of the findings, focusing on the benefits of one method (e.g., Regression) over another (e.g., Correlation). Conclusion  Justify your answer, emphasizing why the chosen method (e.g., Regression) is superior to others (e.g., Correlation).Also Give me The Formulas of the ${topic}.`,
  };
}

// Example of making a request using Axios
async function makeRequest(
  apiKey: string,
  topic: string,
  question: string
): Promise<any> {
  const body = generateRequestBody(apiKey, topic, question);

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
  }
}

// Call the function with the required parameters
const topic = "Regression vs. Correlation";
const question =
  "A company is interested in predicting its annual revenue based on various factors like advertising spend, product pricing, and market trends. Explain the difference between regression and correlation, and why regression would be more appropriate for this prediction task than correlation.Also I need To Draw a Chart for this so Give Chart.js data For x and y ";

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
    const data = await makeRequest(apiKey, topic, question);
    res.status(200).json({ data });
  }
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
