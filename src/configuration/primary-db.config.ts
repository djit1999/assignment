import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class PrimaryDbConfiguration {

    @Value('DB_CONNECTION_STRING')
    DB_CONNECTION_STRING: string

}