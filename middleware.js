import arcjet, { createMiddleware, detectBot, shield } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/transactions(.*)',
  '/account(.*)',
]);

// Only initialize Arcjet if the key is available
const aj = process.env.ARCJET_KEY
  ? arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
      shield({
        mode: 'LIVE'
      }),
      detectBot({
        mode: "LIVE",
        allow: [
          'CATEGORY:SEARCH_ENGINE',
          'GO_HTTP',
          'CURL',  // Allow curl-like requests (Inngest uses similar)
        ]
      })
    ]
  })
  : null;

const clerk = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }
});

// Combined middleware that skips Arcjet for Inngest routes
async function middleware(req) {
  // Skip Arcjet for Inngest API routes to avoid fingerprint issues
  if (req.nextUrl.pathname.startsWith('/api/inngest')) {
    return clerk(req);
  }

  // Use Arcjet + Clerk for all other routes
  if (aj) {
    return createMiddleware(aj, clerk)(req);
  }

  return clerk(req);
}

export default middleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};