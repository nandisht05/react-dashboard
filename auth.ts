import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { db } from './lib/db';
import { users } from './lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Helper to fetch user from database
async function getUser(email: string) {
    try {
        const user = db.select().from(users).where(eq(users.email, email)).get();
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    console.log(`[AUTH DEBUG] Attempting login for: ${email}`);
                    if (!user) {
                        console.log(`[AUTH DEBUG] User not found: ${email}`);
                        return null;
                    }

                    console.log(`[AUTH DEBUG] User found. ID: ${user.id}, Role: ${user.role}, Approved: ${user.isApproved}`);

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log(`[AUTH DEBUG] Password match result: ${passwordsMatch}`);

                    if (passwordsMatch) {
                        // User approval check removed as per request
                        // if (!user.isApproved) {
                        //     console.log("[AUTH DEBUG] User not approved");
                        //     return null;
                        // }

                        // Return user object compatible with NextAuth User type
                        console.log("[AUTH DEBUG] Login successful");
                        return {
                            ...user,
                            id: user.id.toString(), // Convert number ID to string
                        };
                    } else {
                        console.log("[AUTH DEBUG] Invalid password");
                    }
                }
                return null;
            },
        }),
    ],
});
