import { Configuration, Value } from "@itgorillaz/configify";

@Configuration()
export class RedisCacheConfiguration {

    @Value('REDIS_URL')
    REDIS_URL: string

    @Value('REDIS_HOST')
    REDIS_HOST: string

    @Value('REDIS_PORT')
    REDIS_PORT: string

    @Value('REDIS_CACHE_TTL')
    REDIS_CACHE_TTL: string

    @Value('REDIS_CACHE_MAX_ITEMS')
    REDIS_CACHE_MAX_ITEMS: string

    @Value('REDIS_DATABASE')
    REDIS_DATABASE: string
}

