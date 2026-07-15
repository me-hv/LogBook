import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "localhost:3000";

  // Exclude static routes, assets and auth API calls
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api/auth") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const rootHostnames = ["localhost:3000", "logbook.app", "www.logbook.app"];
  const isRoot = rootHostnames.some((h) => hostname.toLowerCase() === h.toLowerCase());

  if (!isRoot) {
    let tenantSlug = "";
    if (hostname.includes(".localhost:3000")) {
      tenantSlug = hostname.split(".localhost:3000")[0];
    } else if (hostname.includes(".logbook.app")) {
      tenantSlug = hostname.split(".logbook.app")[0];
    } else {
      tenantSlug = hostname; // e.g. "blog.acme.com"
    }

    if (tenantSlug && tenantSlug !== "www") {
      // Rewrite internally to dynamic tenants router
      return NextResponse.rewrite(
        new URL(`/_tenants/${tenantSlug}${url.pathname}${url.search}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
