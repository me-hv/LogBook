import { prisma } from "@/lib/prisma";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

  const rssItemsXml = posts
    .map((post) => {
      const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : "";
      const authorName = post.author.name || "Anonymous";
      const postUrl = `${siteUrl}/blog/${post.slug}`;
      const description = post.excerpt || "";

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${post.author.email} (${authorName})</author>
      <description><![CDATA[${description}]]></description>
    </item>`;
    })
    .join("");

  const rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LogBook Feed</title>
    <link>${siteUrl}</link>
    <description>Latest blog articles and programming insights from LogBook</description>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItemsXml}
  </channel>
</rss>`;

  return new Response(rssFeedXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
export const dynamic = "force-dynamic";
