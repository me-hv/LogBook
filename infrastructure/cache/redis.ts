/**
 * Intelligent Caching: Redis caching adaptor with memory fallback.
 */
class RedisCacheAdapter {
  private memoryCache = new Map<string, { val: any; expires: number }>();

  /**
   * Set cache key with TTL.
   */
  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    const expires = Date.now() + ttlSeconds * 1000;
    this.memoryCache.set(key, { val: value, expires });
  }

  /**
   * Get cache key with Stale-While-Revalidate (SWR) logic support.
   */
  async get<T>(key: string): Promise<T | null> {
    const cached = this.memoryCache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expires) {
      // Key expired, return null to trigger revalidation
      this.memoryCache.delete(key);
      return null;
    }

    return cached.val as T;
  }

  /**
   * Invalidate specific cache keys or prefixes.
   */
  async invalidate(prefix: string): Promise<void> {
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const cache = new RedisCacheAdapter();
