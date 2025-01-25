import { type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import remarkGfm from "remark-gfm";

const processLatex = (content: ReactNode): ReactNode => {
  if (typeof content !== "string") {
    return content;
  }

  const parts = content.split(/([[\s\S]+?]|$$[\s\S]+?$$)/g);
  return parts.map((part, index) => {
    if (part.startsWith("[") && part.endsWith("]")) {
      return <BlockMath key={index} math={part.slice(1, -1)} />;
    } else if (part.startsWith("(") && part.endsWith(")")) {
      return <InlineMath key={index} math={part.slice(1, -1)} />;
    }
    return part;
  });
};

export default function ReportContent({ report }: { report: string }) {
  return (
    <Card className="dark w-full shadow-xl overflow-hidden border-accent">
      {" "}
      <CardHeader className="bg-secondary">
        {" "}
        <CardTitle className="text-2xl font-bold text-white">
          {" "}
          Generated Report{" "}
        </CardTitle>{" "}
      </CardHeader>{" "}
      <CardContent className="prose prose-invert max-w-none p-6 space-y-4">
        {" "}
        <ReactMarkdown
          children={report}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-4xl font-extrabold text-primary mt-6 mb-4"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-3xl font-bold text-primary mt-5 mb-3"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-2xl font-semibold text-primary mt-4 mb-2"
                {...props}
              />
            ),
            p: ({ children }) => (
              <p className="my-2">{processLatex(children)}</p>
            ),
            li: ({ children }) => (
              <li className="text-gray-300 my-1">{processLatex(children)}</li>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                {" "}
                <table className="min-w-full divide-y divide-gray-700">
                  {" "}
                  {children}{" "}
                </table>{" "}
              </div>
            ),
            th: ({ children }) => (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                {" "}
                {children}{" "}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {" "}
                {children}{" "}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-blue-400 hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                {children}{" "}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4 text-gray-400">
                {" "}
                {children}{" "}
              </blockquote>
            ),
          }}
        />{" "}
      </CardContent>{" "}
    </Card>
  );
}
