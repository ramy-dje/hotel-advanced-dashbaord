import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const originalUrl = url.pathname + url.search;

  // Set the x-original-url header
  req.headers.set("x-original-url", originalUrl);

  // Call the existing intl middleware
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|fr|en)/:path*"],
};
