import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getActiveTenantId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) return null;

    const cookieStore = await cookies();
    let tenantId = cookieStore.get("logbook_active_tenant")?.value;

    if (tenantId) {
      const member = await prisma.tenantMember.findFirst({
        where: {
          tenantId,
          userId: session.user.id,
        },
      });
      if (member) return tenantId;
    }

    const membership = await prisma.tenantMember.findFirst({
      where: { userId: session.user.id },
    });
    if (membership) {
      // Cache it in cookie
      cookieStore.set("logbook_active_tenant", membership.tenantId, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
      });
      return membership.tenantId;
    }

    // Auto-create default
    const defaultTenant = await prisma.tenant.create({
      data: {
        name: "Personal Workspace",
        slug: `personal-${session.user.id.substring(0, 5).toLowerCase()}`,
        plan: "FREE",
        ownerId: session.user.id,
      },
    });

    await prisma.tenantMember.create({
      data: {
        tenantId: defaultTenant.id,
        userId: session.user.id,
        role: "owner",
      },
    });

    cookieStore.set("logbook_active_tenant", defaultTenant.id, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
    });

    return defaultTenant.id;
  } catch {
    return null;
  }
}
