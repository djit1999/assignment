import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import { EncDecConfiguration } from "src/configuration/enc-dec.config";


@Injectable()
export class DecryptionService{
    constructor(
        private readonly encDecConfiguration: EncDecConfiguration
    ){}

    async decryptStr(str: string): Promise<string> {
        try {
            const parts = str.split(':');
            const iv = Buffer.from(parts.shift(), 'hex');
            const encryptedText = parts.join(':');
    
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.encDecConfiguration.APP_ENC_DEC_KEY, 'hex'), iv);
    
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
    
            return decrypted
            
        } catch (e) {
            throw e
        }
    }

}