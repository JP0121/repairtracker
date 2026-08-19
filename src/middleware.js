export { default } from 'next-auth/middleware';

// Protect everything except the login page, NextAuth's own routes, and static assets.
export const config = {
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)'],
};
