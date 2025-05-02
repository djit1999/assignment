import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { SMTPEmailConfiguration } from "src/configuration/smtp.config";
import { from } from "rxjs";


class EmailPayload{
    from: string;
    to: string;
    subject: string;
    template: string;
    context: { [key: string]: string | number | boolean };
}


@Injectable()
export class EmailService{
    constructor(
        private readonly mailerService: MailerService,
        private readonly smtpEmailConfiguration: SMTPEmailConfiguration
    ){}

    async sendEmail(payload: any): Promise<any>{
        try{

            const sendingMessage = await this.mailerService.sendMail(
                {
                    from: this.smtpEmailConfiguration.EMAIL_SMTP_USER,
                    to: payload.email,
                    subject: payload.subject,
                    template: payload.template,
                    context: payload.context      
                }
            );

            return sendingMessage;
           
        }catch(e){
            throw e;
        }
    }
}