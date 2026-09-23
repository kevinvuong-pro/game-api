import { Injectable } from '@nestjs/common';

import { HEALTH_CHECK_CACHE_MS } from '@/common/constants';
import { RedisService } from '@/infra/redis/redis.service';
import { PrismaService } from '@/infra/prisma/prisma.service';

type DependencyStatus = 'connected' | 'disconnected';

@Injectable()
export class AppService {
  private healthCache: {
    healthy: boolean;
    expiresAt: number;
    services: { db: DependencyStatus; redis: DependencyStatus };
  } | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async checkHealth() {
    const now = Date.now();

    if (!this.healthCache || now >= this.healthCache.expiresAt) {
      const [dbStatus, redisStatus] = await Promise.all([this.checkPostgres(), this.checkRedis()]);
      const services = { db: dbStatus, redis: redisStatus };
      const healthy = dbStatus === 'connected' && redisStatus === 'connected';
      this.healthCache = {
        healthy,
        services,
        expiresAt: now + HEALTH_CHECK_CACHE_MS,
      };
    }

    const { healthy, services } = this.healthCache;

    return {
      healthy,
      services,
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    };
  }

  private async checkPostgres(): Promise<'connected' | 'disconnected'> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'connected';
    } catch {
      return 'disconnected';
    }
  }

  private async checkRedis(): Promise<'connected' | 'disconnected'> {
    const ok = await this.redisService.ping();
    return ok ? 'connected' : 'disconnected';
  }
}
