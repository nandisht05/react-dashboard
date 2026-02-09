import { db } from './db';
import { users } from './schema';
import { desc, eq, sql } from 'drizzle-orm';

export function getRecentUsers() {
    try {
        const result = db.select().from(users).orderBy(desc(users.id)).limit(5).all();
        return result;
    } catch (error) {
        console.error('Failed to fetch recent users:', error);
        throw new Error('Failed to fetch recent users');
    }
}

export async function getUserStats() {
    try {
        const totalResult = db.select({ count: sql<number>`count(*)` }).from(users).get();
        const approvedResult = db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isApproved, true)).get();
        const pendingResult = db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isApproved, false)).get();

        return {
            total: totalResult?.count ?? 0,
            approved: approvedResult?.count ?? 0,
            pending: pendingResult?.count ?? 0
        };
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return { total: 0, approved: 0, pending: 0 };
    }
}
