import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { DateTime } from "luxon";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('login')
    async login(@Body() payload: any, @Req() req: Request, @Res() res: Response): Promise<any>{
        try{

            const jwtToken = await this.authService.login(payload);

            // Sending cookie to the client
            res.cookie(`access_token`, jwtToken, {
                expires: DateTime.now().setZone('Asia/Kolkata').plus({ days: 2 }).toJSDate(),
                httpOnly: true,
                secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
            });

            // Giviing the resposne to the client
            res.status(200).json({
                status: true,
                message: "Logged in successfully",
                token: jwtToken
            })


        }catch(e){
            throw e;
        }
    }


    @Post('signup')
    async signup(@Body() payload: any): Promise<any>{
        try{
            const signingUp = await this.authService.signupStep1(payload);
            return {
                status: true,
                message: "OTP sent to your email",
            }
        }catch(e){
            throw e;
        }
    }

    @Post('verify-otp')
    async verifyOTP(@Body() payload: any): Promise<any>{
        try{
            const verified = await this.authService.verifyOTP(payload);
            return {
                status: true,
                message: "Signed up successfully",
            }
        }catch(e){
            console.log(e);
            throw e;
        }
    }

}