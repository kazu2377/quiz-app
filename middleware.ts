import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/(.*)"
]);

export default clerkMiddleware((auth, req) => {
  // For now, allow all routes - we'll handle auth in components
  // This prevents redirect loops and allows the history page to load
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
