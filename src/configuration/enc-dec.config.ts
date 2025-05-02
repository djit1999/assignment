import { Configuration, Value } from "@itgorillaz/configify";

@Configuration()
export class EncDecConfiguration {

    @Value('APP_ENC_DEC_KEY')
    APP_ENC_DEC_KEY: string

}