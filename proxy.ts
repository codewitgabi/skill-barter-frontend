import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isMePage = request.nextUrl.pathname.startsWith("/me") || 
                   request.nextUrl.pathname.startsWith("/@me");

  if (isMePage && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL("/@me", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/me/:path*", "/@me/:path*", "/auth/:path*"],
};
