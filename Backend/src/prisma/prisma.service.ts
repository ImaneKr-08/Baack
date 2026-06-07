import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private static createAdapter() {
    const dbUrl = process.env.DATABASE_URL;
    let host = process.env.DATABASE_HOST || 'localhost';
    let port = parseInt(process.env.DATABASE_PORT || '3306', 10);
    let user = process.env.DATABASE_USER || 'root';
    let password = process.env.DATABASE_PASSWORD || '';
    let database = process.env.DATABASE_NAME || '';

    if (dbUrl) {
      try {
        const parsed = new URL(dbUrl);
        host = parsed.hostname;
        port = parsed.port ? parseInt(parsed.port, 10) : 3306;
        user = decodeURIComponent(parsed.username);
        password = decodeURIComponent(parsed.password);
        database = parsed.pathname.replace(/^\//, '');
      } catch (err) {
        console.error('Failed to parse DATABASE_URL, fallback to env vars:', err);
      }
    }

    const requiresSsl = dbUrl?.includes('ssl-mode=REQUIRED') || dbUrl?.includes('ssl=true');

const config = {      host,
      port,
      user,
      password,
      database,
      connectionLimit: 5,
      acquireTimeout: 30000,
      connectTimeout: 30000,
      idleTimeout: 60000,
      keepAliveDelay: 10000,
      ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
    };

    console.log(`[PrismaService] Connecting to ${host}:${port}/${database} (SSL: ${!!requiresSsl})`);

    return new PrismaMariaDb(config);
  }

  constructor() {
    super({
      adapter: PrismaService.createAdapter(),
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('[PrismaService] Database connected successfully');
    } catch (err) {
      console.error('[PrismaService] Failed to connect to database:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
