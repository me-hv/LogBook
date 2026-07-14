import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * Anonymously and securely records a view for a blog post.
 * Uses SHA-256 hash combination of IP, User-Agent, and Date to prevent duplicate views
 * while respecting user privacy guidelines (does not store IPs or User-Agents).
 */
export async function recordPostView(postId: string) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const userAgent = reqHeaders.get("user-agent") || "";
    const referer = reqHeaders.get("referer") || "";

    // Session hash (valid for 24h to prevent refresh spamming)
    const dateString = new Date().toISOString().split("T")[0];
    const sessionId = crypto
      .createHash("sha256")
      .update(`${ip}-${userAgent}-${dateString}`)
      .digest("hex");

    // Device parsing
    let deviceType = "desktop";
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      deviceType = "tablet";
    } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(userAgent)) {
      deviceType = "mobile";
    }

    // Referrer classification
    let referrer = "Direct";
    if (referer) {
      try {
        const url = new URL(referer);
        const host = url.hostname.toLowerCase();
        if (host.includes("google.")) referrer = "Google";
        else if (host.includes("twitter.com") || host.includes("t.co") || host.includes("x.com")) referrer = "Twitter/X";
        else if (host.includes("linkedin.com")) referrer = "LinkedIn";
        else if (host.includes("reddit.com")) referrer = "Reddit";
        else if (host.includes("github.com")) referrer = "GitHub";
        else referrer = url.hostname.replace("www.", "");
      } catch {
        referrer = "Referral";
      }
    }

    // Geolocation headers (e.g. injected by edge servers/CDNs)
    const country = reqHeaders.get("x-vercel-ip-country") || "Unknown";
    const city = reqHeaders.get("x-vercel-ip-city") || "Unknown";

    // Start of today boundary
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Verify if this session already viewed this specific post today
    const existing = await prisma.postView.findFirst({
      where: {
        postId,
        sessionId,
        viewedAt: {
          gte: todayStart,
        },
      },
    });

    if (!existing) {
      await prisma.$transaction([
        prisma.postView.create({
          data: {
            postId,
            sessionId,
            deviceType,
            referrer,
            country,
            city,
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: { views: { increment: 1 } },
        }),
      ]);

      // Dynamic daily statistics rollup
      await prisma.dailyStats.upsert({
        where: { date: todayStart },
        update: {
          totalViews: { increment: 1 },
          uniqueVisitors: { increment: 1 },
        },
        create: {
          date: todayStart,
          totalViews: 1,
          uniqueVisitors: 1,
        },
      });
    }
  } catch (err) {
    console.error("Failed to record post view:", err);
  }
}
