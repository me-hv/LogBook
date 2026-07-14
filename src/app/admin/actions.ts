"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { supabaseAdmin, ensureBucketExists } from "@/lib/supabase";

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
