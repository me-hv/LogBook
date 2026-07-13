"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";

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
