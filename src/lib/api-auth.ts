import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

// Simple in-memory rate limit cache
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

export interface ApiAuthResult {
  authorized: boolean;
  errorResponse?: NextResponse;
  userId?: string;
  permissions?: string;
}

export async function validateApiKeyAndRateLimit(
  req: NextRequest,
  requiredPermission?: string
): Promise<ApiAuthResult> {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown_ip";
  const authHeader = req.headers.get("Authorization");
  
  let apiKeyHash = "";
  let isAuthenticated = false;
  let userId = "";
  let permissions = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const rawToken = authHeader.substring(7).trim();
    apiKeyHash = createHash("sha256").update(rawToken).digest("hex");

    const keyRecord = await prisma.apiKey.findUnique({
      where: { tokenHash: apiKeyHash },
      include: { createdBy: { select: { id: true, role: true } } },
    });

    if (keyRecord) {
      // Check expiry date
      if (!keyRecord.expiresAt || new Date() < keyRecord.expiresAt) {
        isAuthenticated = true;
        userId = keyRecord.createdById;
        permissions = keyRecord.permissions;
      }
    }
  }

  // Determine rate limits based on auth status
  // Public rate limits: 60 requests/minute. Authenticated: 300 requests/minute.
  const limit = isAuthenticated ? 300 : 60;
  const identifier = isAuthenticated ? `key_${apiKeyHash}` : `ip_${ip}`;
  
  const now = Date.now();
  const cached = rateLimitCache.get(identifier);

  if (cached && now < cached.resetAt) {
    if (cached.count >= limit) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          { error: "Too Many Requests. Rate limit exceeded.", limit, remaining: 0 },
          {
            status: 429,
            headers: {
              "Retry-After": Math.ceil((cached.resetAt - now) / 1000).toString(),
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": "0",
              "Access-Control-Allow-Origin": "*",
            },
          }
        ),
      };
    }
    cached.count += 1;
    rateLimitCache.set(identifier, cached);
  } else {
    // Reset window
    rateLimitCache.set(identifier, {
      count: 1,
      resetAt: now + 60 * 1000, // 1-minute window
    });
  }

  const updatedCached = rateLimitCache.get(identifier) || { count: 1, resetAt: now + 60000 };
  const remaining = Math.max(0, limit - updatedCached.count);

  // If endpoint requires specific write permissions, validate them
  if (requiredPermission && isAuthenticated) {
    const scopes = permissions.split(",").map(p => p.trim());
    if (!scopes.includes(requiredPermission)) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          { error: `Forbidden. Missing required scope: ${requiredPermission}` },
          {
            status: 403,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "Access-Control-Allow-Origin": "*",
            },
          }
        ),
      };
    }
  }

  return {
    authorized: true,
    userId,
    permissions,
  };
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
