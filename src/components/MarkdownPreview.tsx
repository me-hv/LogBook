import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownPreviewProps {
  content: string;
}

// Helpers to extract clean text and generate matching heading IDs for TOC anchors
const cleanText = (node: any): string => {
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(cleanText).join("");
  if (node?.props?.children) return cleanText(node.props.children);
  return "";
};

const getHeaderId = (children: any) => {
  const text = cleanText(children);
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose-like-markdown select-text text-zinc-800 dark:text-zinc-205">
      {/* Self-contained style link for highlight.js */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
      />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => {
            const id = getHeaderId(children);
            return <h1 id={id} className="text-3xl font-extrabold tracking-tight mt-8 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2 first:mt-0">{children}</h1>;
          },
          h2: ({ children }) => {
            const id = getHeaderId(children);
            return <h2 id={id} className="text-2xl font-bold tracking-tight mt-6 mb-3 border-b border-zinc-200 dark:border-zinc-800 pb-1 first:mt-0">{children}</h2>;
          },
          h3: ({ children }) => {
            const id = getHeaderId(children);
            return <h3 id={id} className="text-xl font-semibold mt-6 mb-2">{children}</h3>;
          },
          h4: ({ children }) => {
            const id = getHeaderId(children);
            return <h4 id={id} className="text-lg font-semibold mt-4 mb-2">{children}</h4>;
          },
          p: ({ children }) => <p className="leading-relaxed my-4 text-sm sm:text-base">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-4 pl-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-4 pl-4">{children}</ol>,
          li: ({ children }) => <li className="text-sm sm:text-base">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 py-1 my-6 italic bg-zinc-50 dark:bg-zinc-900/40 rounded-r-xl">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <table className="w-full text-left text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
          td: ({ children }) => <td className="px-4 py-3">{children}</td>,
          hr: () => <hr className="my-8 border-t border-zinc-200 dark:border-zinc-800" />,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium break-all"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-xs font-mono text-zinc-950 dark:text-zinc-50 border border-zinc-200/50 dark:border-zinc-800">
                  {children}
                </code>
              );
            }
            return (
              <pre className="overflow-x-auto p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-zinc-50 text-xs font-mono my-6 leading-relaxed shadow-sm">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
