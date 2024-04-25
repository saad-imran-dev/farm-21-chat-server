import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { RedisStore } from 'cache-manager-redis-store';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private readonly client: RedisClientType;
  private readonly redisStore: RedisStore;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.redisStore = cache.store as unknown as RedisStore;
    this.client = this.redisStore.getClient();
  }

  async set(key: string, value: any): Promise<void> {
    const cacheValue = JSON.stringify(value);
    await this.client.set(key, cacheValue);
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    return JSON.parse(value);
  }

  async remove(key: string): Promise<void> {
    await this.client.del(key);
  }

  async hset(key: string, field: string, value: any): Promise<void> {
    const cacheValue = JSON.stringify(value);
    await this.client.HSET(key, field, cacheValue);
  }

  async hget(key: string, field: string) {
    const value = await this.client.HGET(key, field);
    return JSON.parse(value);
  }

  async hdel(key: string, field: string) {
    await this.client.HDEL(key, field);
  }
}
