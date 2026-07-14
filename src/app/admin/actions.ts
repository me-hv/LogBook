"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { supabaseAdmin, ensureBucketExists } from "@/lib/supabase";
import { sendWelcomeEmail, sendNewPostNotification, sendAnnouncementEmail } from "@/services/emails";
import { randomUUID, createHash } from "crypto";
import { resend } from "@/lib/resend";
import { dispatchWebhookEvent, dispatchThirdPartyAnnouncements } from "@/lib/webhooks";
import { PLUGINS_REGISTRY } from "@/lib/plugins-registry";
import { triggerPluginHook } from "@/lib/plugin-hooks";

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
  discordWebhookUrl: "",
  slackWebhookUrl: "",
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

    // Save initial post revision snapshot
    await prisma.postRevision.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
        editorId: session.user.id,
      },
    });

    // Log creation activity
    await prisma.activityLog.create({
      data: {
        action: "post_created",
        userId: session.user.id,
        details: `Created new article: "${post.title}"`,
      },
    });

    // Dispatch webhook event
    dispatchWebhookEvent("post.created", post);
    if (post.status === "published") {
      dispatchWebhookEvent("post.published", post);
      dispatchThirdPartyAnnouncements(post);
      triggerPluginHook("post.published", post);
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

    // Save snapshot revision
    await prisma.postRevision.create({
      data: {
        postId: id,
        title: post.title,
        content: post.content,
        editorId: session.user.id,
      },
    });

    // Log editing activity
    await prisma.activityLog.create({
      data: {
        action: "post_edited",
        userId: session.user.id,
        details: `Edited article details: "${post.title}"`,
      },
    });

    // Dispatch webhook events
    dispatchWebhookEvent("post.updated", post);
    if (oldPost && oldPost.status !== "published" && post.status === "published") {
      dispatchWebhookEvent("post.published", post);
      dispatchThirdPartyAnnouncements(post);
      triggerPluginHook("post.published", post);
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
      // Dispatch webhook event
      dispatchWebhookEvent("subscriber.created", updated);
      triggerPluginHook("subscriber.created", updated);
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
    // Dispatch webhook event
    dispatchWebhookEvent("subscriber.created", sub);
    triggerPluginHook("subscriber.created", sub);
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

function filterProfanity(text: string): string {
  const badWords = ["spam", "casino", "viagra", "porn", "drugs", "cryptohack"];
  let clean = text;
  for (const word of badWords) {
    const reg = new RegExp(word, "gi");
    clean = clean.replace(reg, "***");
  }
  return clean;
}

/**
 * PUBLIC/USER action: Adds a comment to a post.
 */
export async function createComment(postId: string, content: string, parentId?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("You must be logged in to comment.");
    }

    const userId = session.user.id;
    const cleanContent = filterProfanity(content.trim());

    if (!cleanContent) {
      throw new Error("Comment content cannot be empty.");
    }

    // Heuristics: Rate limiting - check if same user commented same content within 15 seconds
    const fifteenSecondsAgo = new Date(Date.now() - 15 * 1000);
    const spamCheck = await prisma.comment.findFirst({
      where: {
        authorId: userId,
        content: cleanContent,
        createdAt: { gte: fifteenSecondsAgo },
      },
    });

    if (spamCheck) {
      throw new Error("Duplicate comment detected. Please wait a moment before sending again.");
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content: cleanContent,
        authorId: userId,
        parentId: parentId || null,
        status: "approved",
      },
      include: {
        author: {
          select: { name: true, image: true, email: true },
        },
      },
    });

    // Notify post author in background (if not the commenter)
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (post && post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          type: "comment",
          userId: post.authorId,
          entityId: comment.id,
        },
      });
    }

    // If reply, notify parent comment author (if not same user)
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { authorId: true },
      });
      if (parentComment && parentComment.authorId !== userId) {
        await prisma.notification.create({
          data: {
            type: "reply",
            userId: parentComment.authorId,
            entityId: comment.id,
          },
        });
      }
    }

    // Dispatch webhook event
    dispatchWebhookEvent("comment.created", comment);

    return { success: true, comment };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * PUBLIC/USER action: Fetch comments for a post.
 */
export async function getPostComments(postId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        status: "approved",
      },
      include: {
        author: {
          select: { id: true, name: true, image: true, email: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const serialized = comments.map(c => ({
      id: c.id,
      content: c.content,
      postId: c.postId,
      authorId: c.authorId,
      parentId: c.parentId,
      status: c.status,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      author: c.author,
    }));

    return { success: true, data: serialized };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * USER/ADMIN action: Delete a comment (Admins, Post Authors, or Comment Author within 15 minutes).
 */
export async function deleteCommentAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { post: true },
    });

    if (!comment) {
      throw new Error("Comment not found.");
    }

    const isAdmin = userRole === "admin";
    const isPostAuthor = comment.post.authorId === userId;
    const isCommentAuthor = comment.authorId === userId;
    
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const isWithinTimeLimit = comment.createdAt >= fifteenMinsAgo;

    const allowed = isAdmin || isPostAuthor || (isCommentAuthor && isWithinTimeLimit);

    if (!allowed) {
      throw new Error("You do not have permission to delete this comment or the 15-minute edit window has closed.");
    }

    await prisma.comment.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN/AUTHOR action: Moderate a comment.
 */
export async function moderateCommentAction(id: string, status: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const userRole = session.user.role;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: { post: true },
    });

    if (!comment) {
      throw new Error("Comment not found.");
    }

    const isAdmin = userRole === "admin";
    const isPostAuthor = comment.post.authorId === userId;

    if (!isAdmin && !isPostAuthor) {
      throw new Error("You do not have permission to moderate this comment.");
    }

    await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN/AUTHOR action: Get comments list for moderation.
 */
export async function getModerationCommentsList(status: string = "all", search: string = "") {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const userRole = session.user.role;
    const isAuthorOnly = userRole === "author";

    const where: any = {};
    if (isAuthorOnly) {
      where.post = { authorId: userId };
    }

    if (status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { content: { contains: search, mode: "insensitive" } },
        { author: { email: { contains: search, mode: "insensitive" } } },
        { author: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        author: {
          select: { name: true, email: true, image: true },
        },
        post: {
          select: { title: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: comments.map(c => ({
        id: c.id,
        content: c.content,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        author: c.author,
        post: c.post,
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * USER action: Toggle post reaction.
 */
export async function togglePostReaction(postId: string, type: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("You must be logged in to react.");
    }

    const userId = session.user.id;

    const existing = await prisma.reaction.findUnique({
      where: {
        userId_postId_type: {
          userId,
          postId,
          type,
        },
      },
    });

    if (existing) {
      await prisma.reaction.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.reaction.create({
        data: {
          postId,
          userId,
          type,
        },
      });
    }

    const reactions = await prisma.reaction.findMany({
      where: { postId },
      select: { type: true, userId: true },
    });

    const counts: Record<string, number> = { like: 0, love: 0, fire: 0, insightful: 0, bookmark: 0 };
    reactions.forEach(r => {
      if (r.type in counts) counts[r.type]++;
    });

    const userReactions = reactions.filter(r => r.userId === userId).map(r => r.type);

    return {
      success: true,
      counts,
      userReactions,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * PUBLIC action: Get post reactions summary.
 */
export async function getPostReactions(postId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id || null;

    const reactions = await prisma.reaction.findMany({
      where: { postId },
      select: { type: true, userId: true },
    });

    const counts: Record<string, number> = { like: 0, love: 0, fire: 0, insightful: 0, bookmark: 0 };
    reactions.forEach(r => {
      if (r.type in counts) counts[r.type]++;
    });

    const userReactions = userId
      ? reactions.filter(r => r.userId === userId).map(r => r.type)
      : [];

    return {
      success: true,
      counts,
      userReactions,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * USER action: Get notifications list.
 */
export async function getNotificationsList() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return {
      success: true,
      data: notifications.map(n => ({
        id: n.id,
        type: n.type,
        entityId: n.entityId,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * USER action: Mark single notification as read.
 */
export async function markNotificationAsRead(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * USER action: Mark all notifications as read.
 */
export async function markAllNotificationsAsRead() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: List all users.
 */
export async function getUsersList(search: string = "") {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const role = session.user.role;
    if (role !== "admin" && role !== "superadmin") {
      throw new Error("Unauthorized access");
    }

    const users = await prisma.user.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt.toISOString(),
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: Update a user's role.
 */
export async function updateUserRole(userId: string, targetRole: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const currentRole = session.user.role;
    if (currentRole !== "admin" && currentRole !== "superadmin") {
      throw new Error("Unauthorized access");
    }

    if (targetRole === "superadmin" && currentRole !== "superadmin") {
      throw new Error("Only Super Admins can assign other Super Admins.");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (targetUser?.role === "superadmin" && currentRole !== "superadmin") {
      throw new Error("Only Super Admins can modify other Super Admins.");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: targetRole },
    });

    await prisma.activityLog.create({
      data: {
        action: "role_changed",
        userId: session.user.id,
        details: `Changed role of user ${updated.email} to ${targetRole}`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: Toggle user suspension.
 */
export async function toggleUserSuspension(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const currentRole = session.user.role;
    if (currentRole !== "admin" && currentRole !== "superadmin") {
      throw new Error("Unauthorized access");
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new Error("User not found.");

    if (targetUser.role === "superadmin" && currentRole !== "superadmin") {
      throw new Error("Only Super Admins can suspend other Super Admins.");
    }

    const nextStatus = targetUser.status === "suspended" ? "active" : "suspended";
    await prisma.user.update({
      where: { id: userId },
      data: { status: nextStatus },
    });

    await prisma.activityLog.create({
      data: {
        action: "user_status_changed",
        userId: session.user.id,
        details: `${nextStatus === "suspended" ? "Suspended" : "Re-activated"} user ${targetUser.email}`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: Delete a user record.
 */
export async function deleteUserAction(userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const currentRole = session.user.role;
    if (currentRole !== "admin" && currentRole !== "superadmin") {
      throw new Error("Unauthorized access");
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) throw new Error("User not found.");

    if (targetUser.role === "superadmin" && currentRole !== "superadmin") {
      throw new Error("Only Super Admins can delete other Super Admins.");
    }

    await prisma.user.delete({ where: { id: userId } });

    await prisma.activityLog.create({
      data: {
        action: "user_deleted",
        userId: session.user.id,
        details: `Deleted user account: ${targetUser.email}`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * ADMIN action: Invite a user by email.
 */
export async function inviteUserAction(email: string, role: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const currentRole = session.user.role;
    if (currentRole !== "admin" && currentRole !== "superadmin") {
      throw new Error("Unauthorized access");
    }

    const cleanEmail = email.trim().toLowerCase();
    
    const userExists = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (userExists) {
      throw new Error("A user with this email address already exists.");
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry

    await prisma.invitation.upsert({
      where: { email: cleanEmail },
      update: { role, token, expiresAt, createdAt: new Date() },
      create: { email: cleanEmail, role, token, expiresAt },
    });

    const inviteUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/register?token=${token}`;
    const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
    
    await resend.emails.send({
      from: emailFrom,
      to: cleanEmail,
      subject: "You have been invited to collaborate on LogBook",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px;">
          <h2 style="margin-top: 0;">Collaborate on LogBook</h2>
          <p>You have been invited to join the team as an <strong>${role}</strong>.</p>
          <p>Click the link below to accept your invite and set up your account profile:</p>
          <p><a href="${inviteUrl}" style="display: inline-block; background: #18181b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">Accept Invitation</a></p>
          <p style="font-size: 11px; color: #71717a; margin-top: 24px;">This invitation will expire in 7 days.</p>
        </div>
      `,
    });

    await prisma.activityLog.create({
      data: {
        action: "user_invited",
        userId: session.user.id,
        details: `Invited ${cleanEmail} as ${role}`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * PUBLIC action: Validate registration invitation token.
 */
export async function validateInvitationToken(token: string) {
  try {
    const invite = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invite) {
      return { success: false, error: "Invalid or expired invitation token." };
    }

    if (new Date() > invite.expiresAt) {
      return { success: false, error: "This invitation link has expired." };
    }

    return { success: true, data: { email: invite.email, role: invite.role } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Editorial Workflow Actions
 */
export async function submitPostForReview(postId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Post not found");

    if (post.authorId !== session.user.id && session.user.role !== "admin" && session.user.role !== "superadmin") {
      throw new Error("You do not have permission to submit this post.");
    }

    await prisma.post.update({
      where: { id: postId },
      data: { status: "in_review" },
    });

    await prisma.activityLog.create({
      data: {
        action: "post_submitted_for_review",
        userId: session.user.id,
        details: `Submitted post "${post.title}" for editorial review.`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approvePostAction(postId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");
    const role = session.user.role;

    if (role !== "editor" && role !== "admin" && role !== "superadmin") {
      throw new Error("Only editors and admins can approve drafts.");
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: { status: "approved", reviewerId: session.user.id },
    });

    await prisma.activityLog.create({
      data: {
        action: "post_approved",
        userId: session.user.id,
        details: `Approved post: "${post.title}"`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function publishPostAction(postId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");
    const role = session.user.role;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new Error("Post not found");

    const isAuthor = post.authorId === session.user.id;
    const isContributor = role === "contributor";
    const canPublish = !isContributor && (role === "admin" || role === "superadmin" || role === "editor" || (role === "author" && isAuthor));

    if (!canPublish) {
      throw new Error("You do not have permission to publish this post.");
    }

    const updated = await prisma.post.update({
      where: { id: postId },
      data: { status: "published", publishedAt: new Date(), publisherId: session.user.id },
    });

    await prisma.activityLog.create({
      data: {
        action: "post_published",
        userId: session.user.id,
        details: `Published post: "${updated.title}"`,
      },
    });

    // Dispatch webhook event
    dispatchWebhookEvent("post.published", updated);
    dispatchThirdPartyAnnouncements(updated);
    triggerPluginHook("post.published", updated);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function schedulePostAction(postId: string, scheduledAt: Date) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");
    const role = session.user.role;

    if (role !== "editor" && role !== "admin" && role !== "superadmin") {
      throw new Error("Only editors and admins can schedule posts.");
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: { status: "scheduled", scheduledAt },
    });

    await prisma.activityLog.create({
      data: {
        action: "post_scheduled",
        userId: session.user.id,
        details: `Scheduled post "${post.title}" for ${new Date(scheduledAt).toLocaleString()}`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Editorial Notes Actions
 */
export async function getEditorialNotes(postId: string) {
  try {
    const notes = await prisma.editorialNote.findMany({
      where: { postId },
      include: {
        author: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: notes.map((n) => ({
        id: n.id,
        content: n.content,
        createdAt: n.createdAt.toISOString(),
        author: n.author,
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createEditorialNote(postId: string, content: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");
    const role = session.user.role;

    if (role !== "editor" && role !== "admin" && role !== "superadmin") {
      throw new Error("Only editors and admins can leave editorial notes.");
    }

    const note = await prisma.editorialNote.create({
      data: {
        postId,
        content: content.trim(),
        authorId: session.user.id,
      },
    });

    return { success: true, note };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Version History Revisions Actions
 */
export async function getPostRevisions(postId: string) {
  try {
    const revisions = await prisma.postRevision.findMany({
      where: { postId },
      include: {
        editor: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: revisions.map((r) => ({
        id: r.id,
        title: r.title,
        content: r.content,
        createdAt: r.createdAt.toISOString(),
        editor: r.editor,
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function savePostRevision(postId: string, title: string, content: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const revision = await prisma.postRevision.create({
      data: {
        postId,
        title,
        content,
        editorId: session.user.id,
      },
    });

    return { success: true, revisionId: revision.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function restorePostRevision(postId: string, revisionId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const revision = await prisma.postRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision || revision.postId !== postId) {
      throw new Error("Revision not found.");
    }

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title: revision.title,
        content: revision.content,
        lastEditorId: session.user.id,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "post_revision_restored",
        userId: session.user.id,
        details: `Restored version from ${new Date(revision.createdAt).toLocaleString()} for "${post.title}"`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Activity timeline logs
 */
export async function getActivityLogs(limit: number = 10) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const logs = await prisma.activityLog.findMany({
      include: {
        user: { select: { name: true, image: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return {
      success: true,
      data: logs.map((l) => ({
        id: l.id,
        action: l.action,
        details: l.details,
        createdAt: l.createdAt.toISOString(),
        user: l.user,
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Collaboration dashboard widget data
 */
export async function getCollaborationWidgetsData() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const [inReviewCount, scheduledCount, pendingInvites, activityData] = await Promise.all([
      prisma.post.count({ where: { status: "in_review" } }),
      prisma.post.count({ where: { status: "scheduled" } }),
      prisma.invitation.count({ where: { expiresAt: { gt: new Date() } } }),
      prisma.activityLog.findMany({
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      success: true,
      data: {
        inReviewCount,
        scheduledCount,
        pendingInvites,
        recentActivity: activityData.map((l) => ({
          id: l.id,
          action: l.action,
          details: l.details,
          createdAt: l.createdAt.toISOString(),
          user: l.user,
        })),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * PUBLIC action: Consume invitation token after successful Better Auth registration.
 */
export async function consumeInvitationTokenAction(email: string, token: string) {
  try {
    const invite = await prisma.invitation.findUnique({ where: { token } });
    if (!invite || invite.email.toLowerCase() !== email.toLowerCase()) {
      throw new Error("Invalid invitation token correlation.");
    }

    if (new Date() > invite.expiresAt) {
      throw new Error("This invitation has expired.");
    }

    // Find the newly registered user and update their role
    const user = await prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: invite.role },
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          action: "user_joined",
          userId: user.id,
          details: `Accepted team invitation as ${invite.role}`,
        },
      });
    }

    // Delete the invitation
    await prisma.invitation.delete({ where: { id: invite.id } });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * MOCK fallback AI responses when GEMINI_API_KEY is not defined.
 */
function getMockAIResponse(type: string, input: string, tone?: string) {
  if (type === "outline") {
    return `### Article Outline Suggestions\n\n- **Introduction**\n  - Hook: Why this topic matters today\n  - Core thesis statement\n- **Key Pillars**\n  - Detailed breakdown of sub-concept 1\n  - Case studies and real-world examples\n- **Actionable Takeaways**\n  - Implementation checklists\n  - Common pitfalls to avoid\n- **Conclusion**\n  - Summary of insights\n  - Future trends to watch`;
  }
  if (type === "expand") {
    return `In analyzing the current landscape, it becomes increasingly clear that modern web applications demand exceptional performance alongside clean user interfaces. By structuring components cleanly and minimizing direct server roundtrips, development teams can build scalable applications that deliver both robust features and responsiveness. Ultimately, this approach translates directly to higher retention rates and greater user engagement.`;
  }
  if (type === "rewrite") {
    return `Here is a refined version of your text written in a ${tone || "professional"} tone:\n\n"We are excited to share these key insights to help elevate your publishing workflows. By adopting modular design structures and streamlining database queries, creators can achieve faster release cycles while maintaining exceptional quality standards."`;
  }
  if (type === "simplify") {
    return `Simply put: when you write code in Next.js, standard pages are loaded dynamically by default. By enabling static optimization, the server builds the pages once when compiling, so visitors load them instantly.`;
  }
  if (type === "summarize") {
    return JSON.stringify({
      shortSummary: "A guide detailing Next.js optimization strategies and CMS publishing workflows.",
      socialSummary: "⚡ Optimize your Next.js CMS! Learn how static pages, modular setups, and caching streamline user flows. #nextjs #webdev",
      newsletterSummary: "Hello readers! In today's edition, we explore core web vitals optimizations in modern blog engines. Learn simple changes that yield fast pages.",
      ogDescription: "A comprehensive deep dive into CMS layout structures, caching rules, and publishing tools."
    });
  }
  if (type === "seo") {
    return JSON.stringify({
      titles: [
        "10 Next.js Performance Hacks You Need to Know",
        "How to Build a High-Performance Next.js CMS",
        "Next.js SEO: A Complete Guide for Modern Blogs",
        "Supercharging Next.js: Speed & Content Architecture",
        "The Ultimate Next.js CMS Optimization Checklist"
      ],
      metaDescription: "Learn how to optimize your Next.js CMS platform using clean metadata APIs, sitemaps, caching, and modern web design structures.",
      keywords: ["Next.js", "SEO Guide", "CMS optimization", "web performance", "metadata API", "static pages"],
      score: 85,
      suggestions: [
        "Include the primary keyword in the first paragraph of your post.",
        "Add a cover image Alt description to improve image accessibility search.",
        "Include more internal link references to category posts."
      ]
    });
  }
  if (type === "tags") {
    return JSON.stringify({
      categories: ["Development", "Technology", "Web Design"],
      tags: ["Nextjs", "React", "SEO", "CMS", "Tailwind", "JavaScript", "Prisma", "Database"]
    });
  }
  if (type === "insights") {
    return JSON.stringify({
      readingLevel: "Grade 8 (Easy to read)",
      complexity: "Moderate - Average sentence length is 14 words.",
      passiveVoiceCount: 2,
      repetitionScore: 12,
      suggestions: [
        "Try using active verbs instead of passive voice in your introduction.",
        "Break down long sentences to improve scanning readability."
      ]
    });
  }
  return "AI Completion response placeholder.";
}

/**
 * AI action: Generate AI completion details.
 */
export async function generateAICompletionAction(type: string, input: string, tone?: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    // Create a pending AIJob entry
    const job = await prisma.aIJob.create({
      data: {
        type,
        input: input.substring(0, 10000),
        status: "pending",
        userId: session.user.id,
      },
    });

    const apiKey = process.env.GEMINI_API_KEY;
    let outputText = "";
    let tokensUsed = 0;

    if (apiKey) {
      let prompt = "";
      if (type === "outline") {
        prompt = `Generate a structured, professional article outline in markdown bullet points for this topic:\n\n${input}`;
      } else if (type === "expand") {
        prompt = `Expand these bullet points or rough outline notes into full, descriptive, natural paragraphs:\n\n${input}`;
      } else if (type === "rewrite") {
        prompt = `Rewrite the following text to improve clarity, vocabulary, flow, and quality. Use a ${tone || "professional"} writing tone:\n\n${input}`;
      } else if (type === "simplify") {
        prompt = `Simplify this complex concept or text into simple, easy-to-understand explanations for a general audience:\n\n${input}`;
      } else if (type === "summarize") {
        prompt = `Generate a JSON object containing a short summary (1-2 sentences), a social media post summary with hashtags, a newsletter summary, and an OpenGraph description. Return ONLY the raw JSON block without markdown formatting or code blocks. The JSON must match this structure:\n{ "shortSummary": "...", "socialSummary": "...", "newsletterSummary": "...", "ogDescription": "..." }\n\nArticle Content:\n${input}`;
      } else if (type === "seo") {
        prompt = `Analyze this article content and return a JSON object with: 5 SEO title suggestions, a meta description (max 160 characters), 8 suggested search keywords, a content optimization score (number from 0 to 100), and an array of 3 specific suggestions to improve it. Return ONLY the raw JSON block without markdown formatting. The JSON must match this structure:\n{ "titles": ["...", "..."], "metaDescription": "...", "keywords": ["...", "..."], "score": 80, "suggestions": ["...", "..."] }\n\nArticle Content:\n${input}`;
      } else if (type === "tags") {
        prompt = `Scan this article content and return a JSON object with: 3 suggested categories and 6 suggested tags for one-click insertion. Return ONLY the raw JSON block without markdown formatting. The JSON must match this structure:\n{ "categories": ["...", "..."], "tags": ["...", "..."] }\n\nArticle Content:\n${input}`;
      } else if (type === "insights") {
        prompt = `Evaluate the readability of this text. Return a JSON object with: readingLevel (e.g. "Grade 8"), complexity (sentence structure analysis), passiveVoiceCount (number), repetitionScore (relative score from 0-100), and an array of 3 suggestions to improve reading clarity. Return ONLY the raw JSON block without markdown formatting. The JSON must match this structure:\n{ "readingLevel": "...", "complexity": "...", "passiveVoiceCount": 0, "repetitionScore": 0, "suggestions": ["...", "..."] }\n\nContent:\n${input}`;
      } else {
        prompt = `Provide assistance for: ${input}`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const resData = await response.json();
      const text = resData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      outputText = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      tokensUsed = Math.floor(prompt.length / 4) + Math.floor(outputText.length / 4);
    } else {
      outputText = getMockAIResponse(type, input, tone);
      tokensUsed = Math.floor(input.length / 4) + Math.floor(outputText.length / 4);
    }

    await prisma.aIJob.update({
      where: { id: job.id },
      data: {
        output: outputText,
        status: "completed",
        tokensUsed,
      },
    });

    return { success: true, data: outputText };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * AI action: Recommends related internal links based on content overlap.
 */
export async function suggestInternalLinksAction(currentPostId: string, content: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    const posts = await prisma.post.findMany({
      where: {
        status: "published",
        NOT: { id: currentPostId || "new" },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
      },
      take: 10,
    });

    const cleanContent = content.toLowerCase();
    const suggestions = posts
      .map((post) => {
        const words = post.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        const matchCount = words.filter((w) => cleanContent.includes(w)).length;
        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          matchScore: matchCount,
        };
      })
      .filter((p) => p.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    return { success: true, data: suggestions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * AI action: Fetches AI request usage statistics.
 */
export async function getAIUsageStatsAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }

    if (session.user.role !== "admin" && session.user.role !== "superadmin") {
      throw new Error("Only administrators can view AI usage statistics.");
    }

    const [totalRequests, totalTokensResult, featureBreakdown, recentJobs] = await Promise.all([
      prisma.aIJob.count(),
      prisma.aIJob.aggregate({
        _sum: { tokensUsed: true },
      }),
      prisma.aIJob.groupBy({
        by: ["type"],
        _count: { id: true },
        _sum: { tokensUsed: true },
      }),
      prisma.aIJob.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalRequests,
        totalTokens: totalTokensResult._sum.tokensUsed || 0,
        featureBreakdown: featureBreakdown.map((f) => ({
          type: f.type,
          count: f._count.id,
          tokens: f._sum.tokensUsed || 0,
        })),
        recentJobs: recentJobs.map((j) => ({
          id: j.id,
          type: j.type,
          status: j.status,
          tokensUsed: j.tokensUsed,
          createdAt: j.createdAt.toISOString(),
          user: j.user,
        })),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Developer actions: Create a Personal Access Token / API key.
 */
export async function createApiKeyAction(name: string, permissions: string, expiresAt: Date | null) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    // Generate random secure token prefix with logbook_pat_
    const rawToken = "logbook_pat_" + randomUUID().replace(/-/g, "") + randomUUID().replace(/-/g, "");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");

    const key = await prisma.apiKey.create({
      data: {
        name,
        tokenHash,
        permissions,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        createdById: session.user.id,
      },
    });

    return {
      success: true,
      data: {
        id: key.id,
        name: key.name,
        rawToken, // Plaintext token shown ONLY ONCE
        permissions: key.permissions,
        expiresAt: key.expiresAt?.toISOString() || null,
        createdAt: key.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Developer actions: Revoke an API key.
 */
export async function revokeApiKeyAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    await prisma.apiKey.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Developer actions: List all API keys generated by the active user.
 */
export async function getApiKeysListAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const keys = await prisma.apiKey.findMany({
      where: { createdById: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: keys.map((k) => ({
        id: k.id,
        name: k.name,
        permissions: k.permissions,
        expiresAt: k.expiresAt?.toISOString() || null,
        createdAt: k.createdAt.toISOString(),
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Developer actions: Create a webhook.
 */
export async function createWebhookAction(url: string, secret: string, events: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const webhook = await prisma.webhook.create({
      data: {
        url,
        secret,
        events,
        createdById: session.user.id,
      },
    });

    return {
      success: true,
      data: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        active: webhook.active,
        createdAt: webhook.createdAt.toISOString(),
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Developer actions: Toggle webhook active/inactive.
 */
export async function toggleWebhookAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const hook = await prisma.webhook.findUnique({ where: { id } });
    if (!hook) throw new Error("Webhook not found");

    await prisma.webhook.update({
      where: { id },
      data: { active: !hook.active },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Developer actions: Delete a webhook subscription.
 */
export async function deleteWebhookAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    await prisma.webhook.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Developer actions: List webhooks.
 */
export async function getWebhooksListAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const hooks = await prisma.webhook.findMany({
      where: { createdById: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: hooks.map((h) => ({
        id: h.id,
        url: h.url,
        events: h.events,
        active: h.active,
        createdAt: h.createdAt.toISOString(),
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Plugin Actions: Get installed plugins list.
 */
export async function getPluginsListAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    const plugins = await prisma.plugin.findMany({
      include: { settings: true },
      orderBy: { installedAt: "desc" },
    });

    return {
      success: true,
      data: plugins.map((p) => ({
        id: p.id,
        name: p.name,
        version: p.version,
        enabled: p.enabled,
        installedAt: p.installedAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        settings: p.settings.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>),
      })),
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Plugin Actions: Install a plugin.
 */
export async function installPluginAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");
    if (session.user.role !== "admin" && session.user.role !== "superadmin") {
      throw new Error("Only administrators can install extensions.");
    }

    const info = PLUGINS_REGISTRY.find((p) => p.id === id);
    if (!info) throw new Error("Plugin not found in registry");

    // Create plugin record
    const plugin = await prisma.plugin.create({
      data: {
        id: info.id,
        name: info.name,
        version: info.version,
      },
    });

    // Create default settings rows
    const settingsData = Object.entries(info.defaultSettings).map(([key, value]) => ({
      pluginId: plugin.id,
      key,
      value,
    }));

    await prisma.pluginSetting.createMany({
      data: settingsData,
    });

    await prisma.activityLog.create({
      data: {
        action: "role_changed",
        userId: session.user.id,
        details: `Installed extension plugin: "${info.name}" v${info.version}`,
      },
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Plugin Actions: Toggle enabled status.
 */
export async function togglePluginAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");
    if (session.user.role !== "admin" && session.user.role !== "superadmin") {
      throw new Error("Only administrators can toggle extensions.");
    }

    const plugin = await prisma.plugin.findUnique({ where: { id } });
    if (!plugin) throw new Error("Plugin not found");

    const updated = await prisma.plugin.update({
      where: { id },
      data: { enabled: !plugin.enabled },
    });

    return { success: true, enabled: updated.enabled };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Plugin Actions: Save setting values.
 */
export async function savePluginSettingsAction(pluginId: string, settings: Record<string, string>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");

    // Update settings keys sequentially
    for (const [key, value] of Object.entries(settings)) {
      await prisma.pluginSetting.upsert({
        where: {
          pluginId_key: {
            pluginId,
            key,
          },
        },
        create: {
          pluginId,
          key,
          value,
        },
        update: {
          value,
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Plugin Actions: Uninstall extension.
 */
export async function uninstallPluginAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) throw new Error("Unauthorized");
    if (session.user.role !== "admin" && session.user.role !== "superadmin") {
      throw new Error("Only administrators can uninstall extensions.");
    }

    await prisma.plugin.delete({ where: { id } });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
