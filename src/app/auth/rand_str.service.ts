import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';



@Injectable()
export class RandomStringService {
    constructor(){}

    // Generate random string 32 bytes
    async generate32RandomString(): Promise<string> {
        try{

            const randomBytes = crypto.randomBytes(32);
            const hexString = randomBytes.toString('hex');
            
            return hexString;

        }catch(e){
            throw e
        }
    }

    // Generate random string 64 bytes
    async generateRandom64BitString(): Promise<string>{
        try{
            const randomBytes = crypto.randomBytes(64);
            const hexString = randomBytes.toString('hex');
            
            return hexString;

        }catch(e){
            throw e
        }
    }

    // Generate random string 128 bytes
    async generateRandom128BitString(): Promise<string>{
        try{
            const randomBytes = crypto.randomBytes(128);
            const hexString = randomBytes.toString('hex');
            
            return hexString;

        }catch(e){
            throw e
        }
    }

    // Generate random string 256 bytes
    async generateRandom256BitString(): Promise<string>{
        try{
            const randomBytes = crypto.randomBytes(256);
            const hexString = randomBytes.toString('hex');
            
            return hexString;

        }catch(e){
            throw e
        }
    }

    // Generate random string 512 bytes
    async generateRandom512BitString(): Promise<string>{
        try{
            const randomBytes = crypto.randomBytes(512);
            const hexString = randomBytes.toString('hex');
            
            return hexString;

        }catch(e){
            throw e
        }
    }


}