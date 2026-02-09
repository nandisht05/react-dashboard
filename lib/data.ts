import { db } from './db';
import { users } from './schema';
import { desc, eq, sql } from 'drizzle-orm';

export async function getRecentUsers() {
    try {
        const result = await db.select().from(users).orderBy(desc(users.id)).limit(5);
        return result;
    } catch (error) {
        console.error('Failed to fetch recent users:', error);
        throw new Error('Failed to fetch recent users');
    }
}

export async function getUserStats() {
    try {
        const totalResult = await db.select({ count: sql<number>`count(*)` }).from(users);
        const approvedResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isApproved, true));
        const pendingResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isApproved, false));

        return {
            total: Number(totalResult[0]?.count ?? 0),
            approved: Number(approvedResult[0]?.count ?? 0),
            pending: Number(pendingResult[0]?.count ?? 0)
        };
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return { total: 0, approved: 0, pending: 0 };
    }
}
