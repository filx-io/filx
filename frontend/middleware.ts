import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";

  // app.filx.io → rewrite to /launch
  if (hostname.startsWith("app.")) {
    const url = request.nextUrl.clone();

    // If visiting app.filx.io/ → show /launch page
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/launch";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon|api).*)"],
};
