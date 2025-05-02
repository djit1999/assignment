import { Configuration, Value } from "@itgorillaz/configify";

@Configuration()
export class AppConfiguration {

    @Value('APPLICATION_PORT')
    APPLICATION_PORT: string

    @Value('APPLICATION_BASE_URL')
    APPLICATION_BASE_URL: string

    @Value('APP_ENV')
    APP_ENV: string

    @Value('APP_JWT_TOKEN_PVT_KEY')
    APP_JWT_TOKEN_PVT_KEY: string

    @Value('APP_JWT_COOKIE_EXPIRES_IN')
    APP_JWT_COOKIE_EXPIRES_IN: string

}