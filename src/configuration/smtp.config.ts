import { Configuration, Value } from '@itgorillaz/configify';


@Configuration()
export class SMTPEmailConfiguration {

    @Value('EMAIL_SMTP_PASSWORD')
    EMAIL_SMTP_PASSWORD: string

    @Value('EMAIL_SMTP_USER')
    EMAIL_SMTP_USER: string

    @Value('EMAIL_SMTP_SERVER')
    EMAIL_SMTP_SERVER: string

    @Value('EMAIL_SMTP_PORT')
    EMAIL_SMTP_PORT: string

    @Value('EMAIL_SMTP_SERVICE')
    EMAIL_SMTP_SERVICE: string
}