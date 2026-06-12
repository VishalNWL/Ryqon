import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/api/webhooks(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const ADMIN_EMAILS = [
  process.env.ADMIN_1_EMAIL,
  process.env.ADMIN_2_EMAIL
];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Not logged in — redirect to login for protected routes
  if (!isPublicRoute(req) && !userId) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route check
  if (isAdminRoute(req) && userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user?.emailAddresses[0]?.emailAddress ?? "";
    // console.log("🔐 Admin check — email:", email);

    if (!ADMIN_EMAILS.includes(email)) {
      // console.log("❌ Not admin, redirecting home");
      return NextResponse.redirect(new URL("/", req.url));
    }

    // console.log("✅ Admin access granted");
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};