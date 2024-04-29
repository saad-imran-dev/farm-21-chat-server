import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseAsyncOptions: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
    return {
      type: (await configService.get<string>('DATABASE_TYPE')) as any,
      host: await configService.get<string>('DATABASE_HOST'),
      port: parseInt(await configService.get<string>('DATABASE_PORT')),
      username: await configService.get<string>('DATABASE_USER'),
      password: await configService.get<string>('DATABASE_PASSWORD'),
      database: await configService.get<string>('DATABASE_DB'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    };
  },
};
