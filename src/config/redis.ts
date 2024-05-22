import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        tls: true,
      },
      password: process.env.REDIS_PASSWORD,
      ttl: 600,
      pingInterval: 1000,
    });
    return {
      store: () => store,
    };
  },
};
