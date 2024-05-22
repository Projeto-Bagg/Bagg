import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RedisOptions } from 'src/config/redis';
import { CacheService } from './cache.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class _CacheModule {}
