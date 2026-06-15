import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 🔐 Define which routes require an authenticated session
const isProtectedRoute = createRouteMatcher([
  "/sync-user(.*)",
  "/dashboard(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect(); // Protects the route and forces a clear authentication state
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|webp|ico|csv|docx|xlsx|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};