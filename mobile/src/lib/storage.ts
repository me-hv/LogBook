import AsyncStorage from "@react-native-async-storage/async-storage";
import { MobilePost } from "./api";

const CACHE_POSTS_KEY = "logbook_cached_posts";
const OFFLINE_DRAFTS_KEY = "logbook_offline_drafts";

/**
 * Cache posts list.
 */
export async function cachePosts(posts: MobilePost[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_POSTS_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("AsyncStorage cache failed:", error);
  }
}

/**
 * Fetch cached posts list.
 */
export async function getCachedPosts(): Promise<MobilePost[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save draft offline in AsyncStorage.
 */
export async function saveDraftOffline(draft: MobilePost): Promise<void> {
  try {
    const drafts = await getOfflineDrafts();
    const updated = drafts.filter((d) => d.id !== draft.id);
    updated.push(draft);
    await AsyncStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("AsyncStorage save draft failed:", error);
  }
}

/**
 * Get all offline drafts.
 */
export async function getOfflineDrafts(): Promise<MobilePost[]> {
  try {
    const raw = await AsyncStorage.getItem(OFFLINE_DRAFTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Clear a synced draft from the queue.
 */
export async function removeOfflineDraft(draftId: string): Promise<void> {
  try {
    const drafts = await getOfflineDrafts();
    const filtered = drafts.filter((d) => d.id !== draftId);
    await AsyncStorage.setItem(OFFLINE_DRAFTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("AsyncStorage remove draft failed:", error);
  }
}
