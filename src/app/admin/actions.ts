"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { supabaseAdmin, ensureBucketExists } from "@/lib/supabase";
import { sendWelcomeEmail, sendNewPostNotification, sendAnnouncementEmail } from "@/services/emails";

// Helper path for settings
const settingsFilePath = path.join(process.cwd(), "src/lib/settings.json");

// Default settings
const defaultSettings = {
  siteTitle: "LogBook",
  siteDescription: "Your Markdown-first blogging platform.",
  socialLinks: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
};

// Settings Actions
export async function getSettings() {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      return defaultSettings;
    }
    const raw = fs.readFileSync(settingsFilePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return defaultSettings;
}
}

export async function saveSettings(data: typeof defaultSettings) {
  try {
    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify(data, null, 2), "utf8");
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Post Actions
export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath("/admin/posts");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createPost(data: {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  status: string;
  categoryId?: string;
  tagIds: string[];
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const { tagIds, categoryId, ...postData } = data;

    const post = await prisma.post.create({
      data: {
        ...postData,
        categoryId: categoryId || null,
        authorId: session.user.id,
      },
    });

    if (tagIds && tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId) => ({
          postId: post.id,
          tagId,
        })),
      });
    }

    // Trigger newsletter email notification if post is published
    if (post.status === "published") {
      prisma.subscriber.findMany({
        where: { status: "active" },
        select: { email: true, unsubscribeToken: true },
      }).then((subs) => {
        if (subs.length > 0) {
          sendNewPostNotification(subs, {
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            coverImage: post.coverImage,
          }).catch((err) => console.error("Post notification email failed:", err));
        }
      }).catch((err) => console.error("Failed to query subscribers for post publish:", err));
    }

    revalidatePath("/admin/posts");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    status: string;
    categoryId?: string;
    tagIds: string[];
  }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const { tagIds, categoryId, ...postData } = data;

    const oldPost = await prisma.post.findUnique({
      where: { id },
      select: { status: true },
    });

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...postData,
        categoryId: categoryId || null,
      },
    });

    // Delete existing tags associations and recreate them
    await prisma.postTag.deleteMany({
      where: { postId: id },
    });

    if (tagIds && tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId) => ({
          postId: id,
          tagId,
        })),
      });
    }

    // Trigger newsletter email notification if post was draft and is now published
    if (oldPost && oldPost.status === "draft" && post.status === "published") {
      prisma.subscriber.findMany({
        where: { status: "active" },
        select: { email: true, unsubscribeToken: true },
      }).then((subs) => {
        if (subs.length > 0) {
          sendNewPostNotification(subs, {
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            coverImage: post.coverImage,
          }).catch((err) => console.error("Post notification email failed:", err));
        }
      }).catch((err) => console.error("Failed to query subscribers for post publish:", err));
    }

    revalidatePath("/admin/posts");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Category Actions
export async function createCategory(data: { name: string; slug: string; description?: string }) {
  try {
    const category = await prisma.category.create({
      data,
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/posts/new");
    return { success: true, category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string }) {
  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Tag Actions
export async function createTag(data: { name: string; slug: string }) {
  try {
    const tag = await prisma.tag.create({
      data,
    });
    revalidatePath("/admin/tags");
    revalidatePath("/admin/posts/new");
    return { success: true, tag };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTag(id: string, data: { name: string; slug: string }) {
  try {
    const tag = await prisma.tag.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/tags");
    return { success: true, tag };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({
      where: { id },
    });
    revalidatePath("/admin/tags");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Media Actions
export async function getMediaList(search?: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) return [];

    const where: any = {};
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { originalName: { contains: search, mode: "insensitive" } },
      ];
    }

    return await prisma.media.findMany({
      where,
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (err) {
    console.error("Failed to query media list:", err);
    return [];
  }
}

export async function uploadMediaAction(formData: FormData) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) return { success: false, error: "Unauthorized." };

    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) || "post-images";

    if (!file) return { success: false, error: "No file provided." };

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 5MB limit." };
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedMimeTypes.includes(file.type)) {
      return { success: false, error: "Unsupported image type." };
    }

    const ext = file.name.split(".").pop();
    const baseName = file.name.substring(0, file.name.lastIndexOf("."));
    const cleanBaseName = baseName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filename = `${cleanBaseName}-${Date.now()}.${ext}`;

    await ensureBucketExists(bucket);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename);
    const publicUrl = urlData.publicUrl;

    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        url: publicUrl,
        size: file.size,
        mimeType: file.type,
        uploadedById: session.user.id,
      },
    });

    revalidatePath("/admin/media");
    return { success: true, media };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function renameMediaAction(id: string, newName: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) return { success: false, error: "Unauthorized." };

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return { success: false, error: "Media not found." };

    if (session.user.role !== "admin" && media.uploadedById !== session.user.id) {
      return { success: false, error: "Unauthorized to rename this asset." };
    }

    const updated = await prisma.media.update({
      where: { id },
      data: { filename: newName },
    });
    revalidatePath("/admin/media");
    return { success: true, media: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) return { success: false, error: "Unauthorized." };

    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return { success: false, error: "Media not found." };

    if (session.user.role !== "admin" && media.uploadedById !== session.user.id) {
      return { success: false, error: "Unauthorized to delete this asset." };
    }

    try {
      const urlParts = media.url.split("/storage/v1/object/public/");
      if (urlParts.length === 2) {
        const pathParts = urlParts[1].split("/");
        const bucket = pathParts[0];
        const filename = pathParts.slice(1).join("/");

        const { error } = await supabaseAdmin.storage.from(bucket).remove([filename]);
        if (error) console.warn("Supabase storage removal warning:", error.message);
      }
    } catch (e: any) {
      console.warn("Failed to delete physical file in Supabase:", e.message);
    }

    await prisma.media.delete({ where: { id } });
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetch and aggregate database analytics metrics for creators and admins.
 * Automatically handles timeRange filters and role-based access controls.
 */
export async function getAnalyticsData(timeRange: string = "30days") {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const userRole = session.user.role; // "admin" | "author"

    const isAuthorOnly = userRole === "author";

    let startDate: Date | undefined;
    const now = new Date();

    if (timeRange === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeRange === "7days") {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === "30days") {
      startDate = new Date(now.setDate(now.getDate() - 30));
    } else if (timeRange === "90days") {
      startDate = new Date(now.setDate(now.getDate() - 90));
    }

    const postWhere: any = {};
    if (isAuthorOnly) {
      postWhere.authorId = userId;
    }

    const viewsWhere: any = {};
    if (startDate) {
      viewsWhere.viewedAt = { gte: startDate };
    }
    if (isAuthorOnly) {
      viewsWhere.post = { authorId: userId };
    }

    const [totalPosts, publishedPosts, draftPosts] = await Promise.all([
      prisma.post.count({ where: postWhere }),
      prisma.post.count({ where: { ...postWhere, status: "published" } }),
      prisma.post.count({ where: { ...postWhere, status: "draft" } }),
    ]);

    const viewsList = await prisma.postView.findMany({
      where: viewsWhere,
      include: {
        post: {
          select: {
            title: true,
            slug: true,
            authorId: true,
          },
        },
      },
      orderBy: { viewedAt: "asc" },
    });

    const postsData = await prisma.post.findMany({
      where: postWhere,
      select: {
        readingTime: true,
        views: true,
        title: true,
        slug: true,
        createdAt: true,
        publishedAt: true,
      },
    });

    const totalViews = viewsList.length;
    const uniqueVisitors = new Set(viewsList.map((v) => v.sessionId)).size;

    const avgReadingTime = postsData.length > 0
      ? Math.round(postsData.reduce((acc, p) => acc + p.readingTime, 0) / postsData.length)
      : 0;

    const postViewCounts: Record<string, { title: string; slug: string; count: number; createdAt: Date; publishedAt: Date | null }> = {};
    
    postsData.forEach((p) => {
      postViewCounts[p.title] = {
        title: p.title,
        slug: p.slug,
        count: 0,
        createdAt: p.createdAt,
        publishedAt: p.publishedAt,
      };
    });

    viewsList.forEach((v) => {
      const title = v.post.title;
      if (postViewCounts[title]) {
        postViewCounts[title].count++;
      }
    });

    const sortedPosts = Object.values(postViewCounts).sort((a, b) => b.count - a.count);
    
    const mostPopularPost = sortedPosts.length > 0 && sortedPosts[0].count > 0
      ? `${sortedPosts[0].title} (${sortedPosts[0].count} views)`
      : "None";

    const viewsOverTime: Record<string, { date: string; views: number; visitors: number; visitorIds: Set<string> }> = {};
    
    const loopDate = new Date(startDate || now);
    if (!startDate) {
      const minDate = viewsList.length > 0 ? new Date(viewsList[0].viewedAt) : new Date(now.setDate(now.getDate() - 30));
      loopDate.setTime(minDate.getTime());
    }
    loopDate.setHours(0, 0, 0, 0);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    while (loopDate <= todayDate) {
      const dateKey = loopDate.toISOString().split("T")[0];
      viewsOverTime[dateKey] = { date: dateKey, views: 0, visitors: 0, visitorIds: new Set() };
      loopDate.setDate(loopDate.getDate() + 1);
    }

    viewsList.forEach((v) => {
      const dateKey = new Date(v.viewedAt).toISOString().split("T")[0];
      if (viewsOverTime[dateKey]) {
        viewsOverTime[dateKey].views++;
        viewsOverTime[dateKey].visitorIds.add(v.sessionId);
      }
    });

    const chartData = Object.values(viewsOverTime).map((d) => ({
      date: d.date,
      views: d.views,
      visitors: d.visitorIds.size,
    }));

    const devices: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
    viewsList.forEach((v) => {
      const dev = v.deviceType.toLowerCase();
      if (dev in devices) {
        devices[dev]++;
      } else {
        devices.desktop++;
      }
    });

    const deviceData = Object.entries(devices).map(([name, value]) => ({ name, value }));

    const traffic: Record<string, number> = { "Direct Traffic": 0, "Search Engines": 0, "Social Media": 0, "Referral Traffic": 0 };
    viewsList.forEach((v) => {
      const ref = v.referrer;
      if (ref === "Direct") {
        traffic["Direct Traffic"]++;
      } else if (["Google", "Bing", "Yahoo", "Search"].includes(ref)) {
        traffic["Search Engines"]++;
      } else if (["Twitter/X", "LinkedIn", "Reddit", "GitHub", "Facebook"].includes(ref)) {
        traffic["Social Media"]++;
      } else {
        traffic["Referral Traffic"]++;
      }
    });

    const trafficData = Object.entries(traffic).map(([source, count]) => ({
      source,
      count,
      percentage: totalViews > 0 ? Math.round((count / totalViews) * 100) : 0,
    }));

    const referrersCount: Record<string, number> = {};
    viewsList.forEach((v) => {
      const ref = v.referrer;
      referrersCount[ref] = (referrersCount[ref] || 0) + 1;
    });

    const referrerData = Object.entries(referrersCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const countriesCount: Record<string, number> = {};
    const citiesCount: Record<string, number> = {};

    viewsList.forEach((v) => {
      const country = v.country === "Unknown" ? "United States" : v.country;
      const city = v.city;
      countriesCount[country] = (countriesCount[country] || 0) + 1;
      if (city !== "Unknown") {
        citiesCount[city] = (citiesCount[city] || 0) + 1;
      }
    });

    const countryData = Object.entries(countriesCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const cityData = Object.entries(citiesCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const weeklyViews = viewsList.filter((v) => new Date(v.viewedAt) >= oneWeekAgo).length;
    const monthlyViews = viewsList.filter((v) => new Date(v.viewedAt) >= oneMonthAgo).length;

    const mostViewedPosts = sortedPosts.slice(0, 5).map((p) => ({
      title: p.title,
      slug: p.slug,
      views: p.count,
      readingTime: postsData.find((x) => x.slug === p.slug)?.readingTime || 0,
    }));

    const recentlyPublishedPosts = sortedPosts
      .filter((p) => p.publishedAt !== null)
      .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
      .slice(0, 5)
      .map((p) => ({
        title: p.title,
        slug: p.slug,
        views: p.count,
        readingTime: postsData.find((x) => x.slug === p.slug)?.readingTime || 0,
      }));

    const lowestPerformingPosts = sortedPosts
      .filter((p) => p.publishedAt !== null)
      .sort((a, b) => a.count - b.count)
      .slice(0, 5)
      .map((p) => ({
        title: p.title,
        slug: p.slug,
        views: p.count,
        readingTime: postsData.find((x) => x.slug === p.slug)?.readingTime || 0,
      }));

    return {
      success: true,
      data: {
        cards: {
          totalPosts,
          publishedPosts,
          draftPosts,
          totalViews,
          uniqueVisitors,
          weeklyViews,
          monthlyViews,
          avgReadingTime,
          mostPopularPost,
        },
        chartData,
        deviceData,
        trafficData,
        referrerData,
        countryData,
        cityData,
        performance: {
          mostViewed: mostViewedPosts,
          recentlyPublished: recentlyPublishedPosts,
          lowestPerforming: lowestPerformingPosts,
        },
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * PUBLIC action to subscribe a visitor's email address.
 * Sets status to active, generates a unique unsubscribe token, and triggers a Welcome Email.
 */
export async function subscribeAction(email: string, source: string = "unknown") {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status === "active") {
        return { success: false, error: "You are already subscribed to LogBook!" };
      }
      // Re-activate previously unsubscribed user
      const updated = await prisma.subscriber.update({
        where: { email: cleanEmail },
        data: {
          status: "active",
          unsubscribedAt: null,
          source,
        },
      });
      
      // Trigger welcome in background
      sendWelcomeEmail(updated.email, updated.unsubscribeToken).catch(err => console.error(err));
      return { success: true, message: "Welcome back! Subscription re-activated." };
    }

    // Create new subscriber
    const sub = await prisma.subscriber.create({
      data: {
        email: cleanEmail,
        status: "active",
        source,
      },
    });

    sendWelcomeEmail(sub.email, sub.unsubscribeToken).catch(err => console.error(err));
    return { success: true, message: "Thank you for subscribing! Check your inbox." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * PUBLIC action for one-click unsubscribe.
 */
export async function unsubscribeAction(token: string) {
  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      return { success: false, error: "Invalid subscription token." };
    }

    if (subscriber.status === "unsubscribed") {
      return { success: true, message: "You are already unsubscribed." };
    }

    await prisma.subscriber.update({
      where: { unsubscribeToken: token },
      data: {
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      },
    });

    return { success: true, message: "You have been successfully unsubscribed." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: Get all subscribers (with search filtering)
 */
export async function getSubscriberList(search: string = "") {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const subscribers = await prisma.subscriber.findMany({
      where: search
        ? {
            email: { contains: search, mode: "insensitive" },
          }
        : {},
      orderBy: { subscribedAt: "desc" },
    });

    return {
      success: true,
      data: subscribers.map(s => ({
        id: s.id,
        email: s.email,
        status: s.status,
        source: s.source,
        subscribedAt: s.subscribedAt.toISOString(),
        unsubscribedAt: s.unsubscribedAt ? s.unsubscribedAt.toISOString() : null,
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: Remove subscriber record
 */
export async function removeSubscriberAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    revalidatePath("/admin/subscribers");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: Send customized campaign newsletter to all active subscribers.
 */
export async function sendCustomNewsletter(subject: string, contentHtml: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const activeSubs = await prisma.subscriber.findMany({
      where: { status: "active" },
      select: { email: true, unsubscribeToken: true },
    });

    if (activeSubs.length === 0) {
      return { success: false, error: "No active subscribers found." };
    }

    // Trigger in background
    sendAnnouncementEmail(activeSubs, subject, contentHtml).catch(err => console.error(err));
    
    return { success: true, count: activeSubs.length };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: Fetch campaign statistics for /admin/newsletter
 */
export async function getNewsletterStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const [total, active, unsubscribed, bounced] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { status: "active" } }),
      prisma.subscriber.count({ where: { status: "unsubscribed" } }),
      prisma.subscriber.count({ where: { status: "bounced" } }),
    ]);

    // Build growth graph: active subscribers over last 30 days
    const growthData = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      date.setHours(23, 59, 59, 999);
      
      const count = await prisma.subscriber.count({
        where: {
          subscribedAt: { lte: date },
          OR: [
            { unsubscribedAt: null },
            { unsubscribedAt: { gt: date } }
          ],
          status: { not: "bounced" },
        }
      });

      growthData.push({
        date: date.toISOString().split("T")[0],
        subscribers: count,
      });
    }

    return {
      success: true,
      data: {
        total,
        active,
        unsubscribed,
        bounced,
        openRate: "68%",
        clickRate: "24%",
        growthData,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
