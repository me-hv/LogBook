import { prisma } from "./prisma";

export interface PlanLimits {
  posts: number;
  storageMb: number;
  users: number;
  domains: number;
  allowAI: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  FREE: {
    posts: 100,
    storageMb: 1024, // 1 GB
    users: 3,
    domains: 0,
    allowAI: false,
  },
  STARTER: {
    posts: 1000,
    storageMb: 10240, // 10 GB
    users: 5,
    domains: 1,
    allowAI: true,
  },
  PRO: {
    posts: 999999, // unlimited representation
    storageMb: 102400, // 100 GB
    users: 20,
    domains: 5,
    allowAI: true,
  },
  BUSINESS: {
    posts: 999999,
    storageMb: 9999999,
    users: 999999,
    domains: 999999,
    allowAI: true,
  },
  ENTERPRISE: {
    posts: 999999,
    storageMb: 9999999,
    users: 999999,
    domains: 999999,
    allowAI: true,
  },
};

/**
 * Resolve limits for a tenant.
 */
export async function getTenantLimits(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { plan: true },
  });

  const plan = tenant?.plan || "FREE";
  return PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
}

/**
 * Gate check for creating posts.
 */
export async function canCreatePost(tenantId: string): Promise<boolean> {
  const [limits, count] = await Promise.all([
    getTenantLimits(tenantId),
    prisma.post.count({ where: { tenantId } }),
  ]);

  return count < limits.posts;
}

/**
 * Gate check for inviting workspace users.
 */
export async function canInviteUser(tenantId: string): Promise<boolean> {
  const [limits, count] = await Promise.all([
    getTenantLimits(tenantId),
    prisma.tenantMember.count({ where: { tenantId } }),
  ]);

  return count < limits.users;
}

/**
 * Gate check for uploading media.
 */
export async function canUploadMedia(tenantId: string, newSizeBytes: number): Promise<boolean> {
  const limits = await getTenantLimits(tenantId);

  const aggregate = await prisma.media.aggregate({
    where: { tenantId },
    _sum: { size: true },
  });

  const currentSize = aggregate._sum.size || 0;
  const currentSizeMb = currentSize / (1024 * 1024);
  const newSizeMb = newSizeBytes / (1024 * 1024);

  return (currentSizeMb + newSizeMb) < limits.storageMb;
}

/**
 * Gate check for using AI features.
 */
export async function canUseAI(tenantId: string): Promise<boolean> {
  const limits = await getTenantLimits(tenantId);
  return limits.allowAI;
}

/**
 * Gate check for mapping custom domains.
 */
export async function canAddCustomDomain(tenantId: string): Promise<boolean> {
  const limits = await getTenantLimits(tenantId);
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { customDomain: true },
  });

  const currentCount = tenant?.customDomain ? 1 : 0;
  return currentCount < limits.domains;
}
