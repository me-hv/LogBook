import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:3000/api/v1";

export interface MobilePost {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch list of publications from Headless REST API.
 */
export async function fetchMobilePosts(): Promise<MobilePost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    if (!response.ok) throw new Error("Failed to fetch posts from server");
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.warn("API Offline, using local cache:", error);
    throw error;
  }
}

/**
 * Synchronize local offline drafts with the server endpoint.
 */
export async function syncDraftToServer(draft: MobilePost): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: draft.title,
        content: draft.content,
        slug: draft.slug || `draft-${Date.now()}`,
        status: "draft",
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Sync failed for draft:", draft.id, error);
    return false;
  }
}
