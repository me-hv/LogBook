/**
 * Next.js Edge Runtime helper configurations and response headers templates.
 */
export const EDGE_RUNTIME_CONFIG = {
  runtime: "edge",
};

/**
 * Generate HTTP response cache headers matching edge CDN strategies (Stale-While-Revalidate).
 */
export function getEdgeCacheHeaders(sMaxAge = 60, staleWhileRevalidate = 600) {
  return {
    "Cache-Control": `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    "CDN-Cache-Control": `max-age=${sMaxAge * 2}`,
    "Vercel-CDN-Cache-Control": `max-age=${sMaxAge * 4}`,
  };
}
