/**
 * SQLite database initialization and management
 */
import * as SQLite from 'expo-sqlite';
import { logger } from '@utils/logger';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize database and run migrations
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  try {
    db = await SQLite.openDatabaseAsync('aurora_downloads.db');
    logger.info('Database opened successfully');

    await runMigrations(db);
    return db;
  } catch (error) {
    logger.error('Failed to initialize database', error);
    throw error;
  }
}

/**
 * Get database instance
 */
export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Run database migrations
 */
async function runMigrations(database: SQLite.SQLiteDatabase) {
  try {
    // Create downloads table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS downloads (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        filename TEXT NOT NULL,
        fileType TEXT,
        status TEXT CHECK(status IN ('pending', 'downloading', 'paused', 'completed', 'failed')) DEFAULT 'pending',
        progress REAL DEFAULT 0,
        bytesTotal INTEGER,
        bytesDownloaded INTEGER DEFAULT 0,
        speed INTEGER DEFAULT 0,
        estimatedTimeRemaining INTEGER,
        createdAt TEXT NOT NULL,
        startedAt TEXT,
        completedAt TEXT,
        localUri TEXT,
        error TEXT,
        retryCount INTEGER DEFAULT 0,
        maxRetries INTEGER DEFAULT 3,
        checksum TEXT,
        customHeaders TEXT
      );
    `);

    // Create settings table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Create indexes for better query performance
    await database.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_downloads_status ON downloads(status);
      CREATE INDEX IF NOT EXISTS idx_downloads_created ON downloads(createdAt DESC);
    `);

    logger.info('Database migrations completed successfully');
  } catch (error) {
    logger.error('Failed to run migrations', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (db) {
    await db.closeAsync();
    db = null;
    logger.info('Database closed');
  }
}
