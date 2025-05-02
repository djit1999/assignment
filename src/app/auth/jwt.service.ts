import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export class IJwtToken {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}

@Injectable()
export class JwtTokenService {
    constructor(
        private readonly jwtService: JwtService
    ){}

    async generateJwtToken(jwtTokenPayload: IJwtToken): Promise<any>{
        try{
           
            const jwtToken = await this.jwtService.signAsync({ sub: jwtTokenPayload.userId, email: jwtTokenPayload.email });
            return jwtToken;

        }catch(e){
            throw e;
        }
    }

    async verifyJwtToken(jwtToken: string): Promise<string>{
        try{

            const jwtTokenPayload = await this.jwtService.verifyAsync(jwtToken);
            return jwtTokenPayload;

        }catch(e){
            throw e;
        }
    }
}