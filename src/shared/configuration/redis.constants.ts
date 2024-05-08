import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const redisAsyncOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: parseInt(configService.get<string>('REDIS_PORT')!),
        tls: true,
      },
      username: configService.get<string>('REDIS_USER'),
      password: configService.get<string>('REDIS_PASSWORD'),
      ttl: 60,
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
