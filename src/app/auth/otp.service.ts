import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OTPService{
    private otpLength:number = 6;

    constructor(){}


    async generateAlphaNumericOtp(): Promise<string> {
            // Generate a random buffer
            const buffer = crypto.randomBytes(this.otpLength);
            const otp = buffer.toString('hex');
            return otp.slice(0, this.otpLength);

      }

    async generateNumericOTP(): Promise<string>{
            const otp = crypto.randomInt(0, Math.pow(10, this.otpLength)).toString();
            return otp.padStart(this.otpLength, '0');
    }

}