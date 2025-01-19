import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import "katex/dist/katex.min.css"; // Importing the KaTeX CSS for proper styling
import MathJax from "react-mathjax";
import { BlockMath } from "react-katex";

export default function ReportContent({ report }: { report: string }) {
  console.log("Report Content:", report);

  return (
    <MathJax.Provider>
      <Card className="dark w-full shadow-xl overflow-hidden">
        <CardHeader className="bg-secondary">
          <CardTitle className="text-2xl font-bold text-white">
            Generated Report
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none p-6 space-y-4">
          <ReactMarkdown
            children={report}
            remarkPlugins={[remarkMath]} // Enable parsing LaTeX expressions with remark-math
            rehypePlugins={[rehypeKatex]} // Use rehype-katex to render LaTeX equations
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-4xl font-extrabold text-primary"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-bold text-primary" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-2xl font-semibold text-primary"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="text-white" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-secondary" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="text-white underline hover:text-primary"
                  {...props}
                />
              ),
              code: ({
                inline,
                ...props
              }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => (
                <code
                  className={`${
                    inline
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-800 text-white p-2 rounded block"
                  }`}
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc pl-6 space-y-2 text-white"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal pl-6 space-y-2 text-white"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-lg text-white" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-accent pl-4 italic text-white"
                  {...props}
                />
              ),
              p: ({ node, children, ...props }) => {
                // Check if the paragraph contains a MathJax expression
                const content = React.Children.toArray(children).join(""); // Combine children into a single string
                const isMathJax =
                  content.startsWith("[") || content.startsWith(`( \``);

                // Render MathJax if detected
                return isMathJax ? (
                  <MathJax.Node formula={content} />
                ) : (
                  <p {...props}>{children}</p>
                );
              },
            }}
          />
        </CardContent>
      </Card>
    </MathJax.Provider>
  );
}
