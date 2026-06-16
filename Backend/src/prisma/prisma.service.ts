import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static parsePositiveInt(
    value: string | null | undefined,
    fallback: number,
  ) {
    if (!value) {
      return fallback;
    }

    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  private static createAdapter() {
    const dbUrl = process.env.DATABASE_URL;
    let host = process.env.DATABASE_HOST || 'localhost';
    let port = parseInt(process.env.DATABASE_PORT || '3306', 10);
    let user = process.env.DATABASE_USER || 'root';
    let password = process.env.DATABASE_PASSWORD || '';
    let database = process.env.DATABASE_NAME || '';
    let connectionLimit = PrismaService.parsePositiveInt(
      process.env.DATABASE_POOL_CONNECTION_LIMIT,
      5,
    );
    let acquireTimeout = PrismaService.parsePositiveInt(
      process.env.DATABASE_POOL_ACQUIRE_TIMEOUT,
      30000,
    );
    let connectTimeout = PrismaService.parsePositiveInt(
      process.env.DATABASE_CONNECT_TIMEOUT,
      10000,
    );
    const idleTimeout = PrismaService.parsePositiveInt(
      process.env.DATABASE_POOL_IDLE_TIMEOUT,
      60,
    );

    if (dbUrl) {
      try {
        const parsed = new URL(dbUrl);
        host = parsed.hostname;
        port = parsed.port ? parseInt(parsed.port, 10) : 3306;
        user = decodeURIComponent(parsed.username);
        password = decodeURIComponent(parsed.password);
        database = parsed.pathname.replace(/^\//, '');
        connectionLimit = PrismaService.parsePositiveInt(
          parsed.searchParams.get('connection_limit') ||
            parsed.searchParams.get('connectionLimit'),
          connectionLimit,
        );
        acquireTimeout = PrismaService.parsePositiveInt(
          parsed.searchParams.get('pool_timeout') ||
            parsed.searchParams.get('acquireTimeout'),
          acquireTimeout,
        );
        connectTimeout = PrismaService.parsePositiveInt(
          parsed.searchParams.get('connect_timeout') ||
            parsed.searchParams.get('connectTimeout'),
          connectTimeout,
        );
      } catch (err) {
        console.error(
          'Failed to parse DATABASE_URL, fallback to env vars:',
          err,
        );
      }
    }

    const sslConfig =
      dbUrl?.includes('ssl-mode=REQUIRED') || dbUrl?.includes('ssl=true')
        ? { rejectUnauthorized: false }
        : undefined;

    const config = {
      host,
      port,
      user,
      password,
      database,
      connectionLimit,
      acquireTimeout,
      connectTimeout,
      idleTimeout,
      ssl: sslConfig,
    };

    console.log(
      `Prisma MariaDB pool configured for ${host}:${port}/${database} ` +
        `(limit=${connectionLimit}, acquireTimeout=${acquireTimeout}ms)`,
    );

    return new PrismaMariaDb(config);
  }

  constructor() {
    super({
      adapter: PrismaService.createAdapter(),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
