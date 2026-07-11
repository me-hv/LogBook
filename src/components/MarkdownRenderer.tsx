import React from "react";

interface MarkdownRendererProps {
  content: string; // Expects HTML content (usually processed by markdownToHtml)
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div
      className="markdown-content max-w-none text-zinc-800 dark:text-zinc-200"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
