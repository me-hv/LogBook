import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(html)
    .process(markdown);
  return addIdsToHeadings(result.toString());
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): TocHeading[] {
  const lines = markdown.split("\n");
  const headings: TocHeading[] = [];
  
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.*)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim().replace(/[*`_]/g, ""); // Strip basic markdown formatting
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      headings.push({ id, text, level });
    }
  }
  
  return headings;
}

export function addIdsToHeadings(htmlContent: string): string {
  // Matches h2 and h3 headers
  return htmlContent.replace(/<(h[23])>(.*?)<\/\1>/g, (match, tag, text) => {
    const cleanText = text.replace(/<[^>]*>/g, ""); // strip HTML tags
    const id = cleanText
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `<${tag} id="${id}">${text}</${tag}>`;
  });
}

