import { NextRequest, NextResponse } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
    '/login',
    '/register',
    '/unauthorized',
    '/_next',
    '/api',
    '/favicon.ico',
];

// Basic middleware - only checks if a token exists
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip checking public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Simple auth check - just verify token exists in cookie
    const hasToken = request.cookies.has('token');
    if (!hasToken) {
        // No token, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Permissions are checked client-side in the withAuth HOC
    // This middleware only enforces authentication
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|assets|favicon.ico).*)'],
};
