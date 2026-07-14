import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iqubfffydyuletsgdize.supabase.co";
// Fallback placeholder JWT prevents initialization crashes during next build compilation
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxdWJmZmZ5ZHl1bGV0c2dkaXplIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU4MDk0NTMsImV4cCI6MTk3MTM4NTQ1M30.placeholder";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for administrative / server-side storage operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Ensure storage buckets exist and are public.
 */
export async function ensureBucketExists(bucketName: string) {
  try {
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
    if (error) {
      console.warn("Supabase Storage bucket list failed:", error.message);
      return;
    }

    const exists = buckets.some((b) => b.name === bucketName);
    if (!exists) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
        fileSizeLimit: 5242880, // 5MB
      });
      if (createError) {
        console.warn(`Could not create storage bucket "${bucketName}":`, createError.message);
      }
    }
  } catch (err: any) {
    console.warn(`Failed to verify bucket "${bucketName}":`, err.message);
  }
}
