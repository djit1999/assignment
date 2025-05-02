import { Injectable } from "@nestjs/common";
import * as argon2 from 'argon2';


@Injectable()
export class HashingService {
    constructor(){}

    async hash(stringToHash: string): Promise<string>{
        try{

            return await argon2.hash(stringToHash, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16, // 64 MB
                timeCost: 4,         // 4 iterations
                parallelism: 2       // 2 threads
            });

        }catch(e){
            throw e;
        }
    }

    async verifyHash(hash: string, password: string): Promise<boolean> {
        try{
            return await argon2.verify(hash, password);
        }catch(e){
            throw e
        }
    }

}