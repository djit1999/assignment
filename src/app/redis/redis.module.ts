// redis.module.ts
import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigifyModule } from '@itgorillaz/configify';
import { RedisCacheConfiguration } from 'src/configuration/redis-cache.config';
import { RedisCacheService } from './redis.service';


@Global()
@Module({
  imports: [ConfigifyModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [RedisCacheConfiguration],
      useFactory: (redisCacheConfiguration: RedisCacheConfiguration) => {
        return new Redis({
          host: redisCacheConfiguration.REDIS_HOST,
          port: Number(redisCacheConfiguration.REDIS_PORT),
          db: Number(redisCacheConfiguration.REDIS_DATABASE)
        });
      },
    },
    RedisCacheService
  ],
  exports: ['REDIS_CLIENT', RedisCacheService],
})
export class RedisModule {}
