'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './schema';
import { eq, sql } from 'drizzle-orm';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';

const SignupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function signup(prevState: string | undefined, formData: FormData) {
    const customObject = Object.fromEntries(formData.entries());
    const parsed = SignupSchema.safeParse(customObject);

    if (!parsed.success) {
        return 'Invalid fields';
    }

    const { name, email, password } = parsed.data;

    try {
        console.log(`[SIGNUP DEBUG] Attempting signup for: ${email}`);

        const existingUser = db.select().from(users).where(eq(users.email, email)).get();
        if (existingUser) {
            console.log(`[SIGNUP DEBUG] Email already exists: ${email}`);
            return 'Email already in use';
        }

        console.log(`[SIGNUP DEBUG] Hashing password...`);

        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if it's the first user
        const userCountResult = db.select({ count: sql<number>`count(*)` }).from(users).get();
        const userCount = userCountResult?.count ?? 0;

        const isFirstUser = userCount === 0;

        db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role: isFirstUser ? 'admin' : 'user',
            isApproved: true, // Auto-approve all users
        }).run();

        console.log(`[SIGNUP DEBUG] User created successfully. Auto-approved.`);
        return 'Success';

    } catch (error) {
        console.error('Signup error:', error);
        return 'Failed to create user';
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/welcome',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function approveUser(formData: FormData) {
    const email = formData.get('email') as string;
    try {
        db.update(users).set({ isApproved: true }).where(eq(users.email, email)).run();
        revalidatePath('/admin');
    } catch (error) {
        console.error('Failed to approve user:', error);
    }
}
