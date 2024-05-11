import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async set(key: string, value: unknown): Promise<void> {
    try {
      await this.cacheManager.set(key, value);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const val = await this.cacheManager.get<string>(key);
      return val ? JSON.parse(val) : undefined;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
