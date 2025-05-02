import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { EncDecConfiguration } from 'src/configuration/enc-dec.config';


@Injectable()
export class EncryptionService{
 
    constructor(
       private encDecConfiguration: EncDecConfiguration,
    ){}

    // Encrypt the string
    async encryptStr(str: string): Promise<string> {
        try {

            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.encDecConfiguration.APP_ENC_DEC_KEY, 'hex'), iv);
    
            let encrypted = cipher.update(str, 'utf8', 'hex');
            encrypted += cipher.final('hex');
    
            return iv.toString('hex') + ':' + encrypted;
            
        } catch (e) {
            throw e
        }
    }
    
}