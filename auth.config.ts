import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnDashboard || isOnAdmin) {
                // Allow public access to these pages.
                // The pages themselves will determine what content to show based on auth status.
                return true;
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                console.log('[AUTH CONFIG] JWT Callback: Setting user data', { role: user.role, approved: user.isApproved });
                token.role = user.role;
                token.isApproved = user.isApproved;
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                console.log('[AUTH CONFIG] Session Callback: Setting session data');
                session.user.role = token.role as string;
                session.user.isApproved = token.isApproved as boolean;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
