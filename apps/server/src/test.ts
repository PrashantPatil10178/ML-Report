import express, { Request, Response } from "express";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

const hfClient = new HfInference(process.env.HF_API_KEY);

const generateChartData = async (question: string, hfClient: HfInference) => {
  try {
    const chartDataPrompt = `Generate chart data comparing regression and correlation metrics for the question: "${question}". 
    Include metrics like R-squared, prediction accuracy, and model complexity. 
    Return only the JSON data in this format:
    {
      "labels": ["Metric 1", "Metric 2", "Metric 3"],
      "data": [value1, value2, value3],
      "title": "Regression vs Correlation Analysis Metrics"
    }`;

    const chartDataResponse = await hfClient.chatCompletion({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: [{ role: "user", content: chartDataPrompt }],
      max_tokens: 200,
    });

    return JSON.parse(chartDataResponse.choices[0].message.content);
  } catch (error) {
    console.error("Error generating chart data:", error);
    // Fallback data
    return {
      labels: ["R-squared", "Prediction Accuracy", "Model Complexity"],
      data: [0.85, 0.78, 0.92],
      title: "Regression vs Correlation Analysis Metrics",
    };
  }
};

const generateChartVisualization = (chartData: any) => {
  return `
    <html>
      <body>
        <canvas id="chart"></canvas>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
          const ctx = document.getElementById('chart').getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ${JSON.stringify(chartData.labels)},
              datasets: [{
                label: ${JSON.stringify(chartData.title)},
                data: ${JSON.stringify(chartData.data)},
                backgroundColor: [
                  'rgba(75, 192, 192, 0.6)',
                  'rgba(54, 162, 235, 0.6)',
                  'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Score'
                  }
                }
              },
              plugins: {
                title: {
                  display: true,
                  text: ${JSON.stringify(chartData.title)}
                },
                legend: {
                  display: true,
                  position: 'bottom'
                }
              }
            }
          });
        </script>
      </body>
    </html>
  `;
};

app.post(
  "/generate-report",
  async (req: Request, res: Response): Promise<any> => {
    const { question, task, hint } = req.body;
    console.log("Request Body:", req.body);

    if (!question || !task) {
      return res
        .status(400)
        .json({ error: "Missing required fields: question or task." });
    }

    try {
      const tavilyResponse = await tavilyClient.search(question, {
        searchDepth: "basic",
        topic: "general",
        maxResults: 5,
      });

      const reportPrompt = `
    Based on this outline and the question "${question}", generate a detailed academic report:

    1. Title and Introduction
    - Explain ML algorithms used
    - Compare Regression vs Correlation
    
    2. Methodology
    - Detailed mathematical concepts
    - Algorithm steps
    - Include formulas with proper LaTeX notation
    
    3. Approach
    - ML methods
    - Step-by-step problem-solving process
    
    4. Significance
    - Compare Regression vs Correlation benefits
    - Practical implications
    
    5. Conclusion
    - Justify why regression is better than correlation
    - Summarize key points
    
    Include proper LaTeX notation for all mathematical formulas.
    Format in Markdown with proper headings and sections.
    Use academic writing style with detailed explanations.
    
    Additional information: ${JSON.stringify(tavilyResponse)}
    Task: ${task}
    Hint: ${hint}
    `;

      const hfResponse = await hfClient.chatCompletion({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct",
        messages: [{ role: "user", content: reportPrompt }],
        max_tokens: 2000,
      });

      const chartData = await generateChartData(question, hfClient);

      res.json({
        question,
        task,
        processedInformation: hfResponse.choices[0].message.content,
        chart: generateChartVisualization(chartData),
      });
    } catch (error) {
      console.error("Error during processing:", error);
      res
        .status(500)
        .json({ error: "An error occurred while processing your request." });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
