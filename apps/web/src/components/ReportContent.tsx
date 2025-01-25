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
    <Card className="w-full shadow-xl overflow-hidden border border-gray-700 bg-gray-800">
      <CardHeader className="bg-gray-700 border-b border-gray-600">
        <CardTitle className="text-2xl font-bold text-blue-400">
          Generated Report
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-invert max-w-none p-6 space-y-4 text-gray-300">
        <ReactMarkdown
          children={report}
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-4xl font-extrabold text-blue-400 mt-6 mb-4"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-3xl font-bold text-blue-400 mt-5 mb-3"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-2xl font-semibold text-blue-400 mt-4 mb-2"
                {...props}
              />
            ),
            p: ({ children }) => (
              <p className="my-2 text-gray-300">{processLatex(children)}</p>
            ),
            li: ({ children }) => (
              <li className="text-gray-300 my-1">{processLatex(children)}</li>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-700">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-400">
                {children}
              </blockquote>
            ),
            code: ({
              node,
              inline,
              className,
              children,
              ...props
            }: {
              node?: any;
              inline?: boolean;
              className?: string;
              children?: ReactNode;
            }) => {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <pre className="bg-gray-900 rounded p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code className="bg-gray-700 rounded px-1 py-0.5" {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
