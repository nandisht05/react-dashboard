import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Ensure directory exists or rely on root
const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });
