import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { OTPService } from "./otp.service";
import { EmailService } from "../email/email.service";
import { RedisCacheService } from "../redis/redis.service";
import { JwtTokenService } from "./jwt.service";
import { HashingService } from "./hasing.service";

@Injectable()
export class AuthService{
    constructor(
        private readonly redisCacheService: RedisCacheService,
        private readonly userService: UserService,
        private readonly otpService: OTPService,
        private readonly EmailService: EmailService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly hasingService: HashingService,
    ){}


    async signupStep1(payload: any): Promise<any>{
        try{

            const cachedOTP: any = await this.redisCacheService.get(`signup:${payload.email}`);
            if(cachedOTP){ throw new BadRequestException("OTP already sent")}
            
            const user = await this.userService.getUserByEmail(payload.email);
            
            if(user){ throw new BadRequestException("User already exists")}

            // Generate OTP
            const otp = await this.otpService.generateNumericOTP();
            
            // Save OTP to cache for 5 minutes
            await this.redisCacheService.set( `signup:${payload.email}`, { otp, email: payload.email }, 60 * 5);
            
            // Send OTP to user email
           const sentEmail = await this.EmailService.sendEmail(
                {
                    email: payload.email,
                    subject: "OTP for signup",
                    template: "otp",
                    context: {
                        title: 'OTP for signup',
                        header: 'Signup OTP',
                        otp: `${otp}`, 
                        receiver: `User`,
                        sender: 'Admin',
                        footerHeader : "ABC Pvt.Ltd",
                        footerSubHeader: "Kolkata, New Town, 700001"
                    }
                }
            )

            return sentEmail;

        }catch(e){
            throw e;
        }
    }


    async verifyOTP(payload: any): Promise<any>{
        try{

            if(payload.password !== payload.confirmPassword){ throw new BadRequestException("Password and confirm password do not match")}

            // Get OTP from cache
            const cachedOTP: any = await this.redisCacheService.get(`signup:${payload.email}`);
            
            if(!cachedOTP){ throw new BadRequestException("OTP expired")}
            
            // Verify OTP
            if(cachedOTP.otp !== payload.otp){ throw new BadRequestException("Invalid OTP")}
            
            // Delete OTP from cache
            await this.redisCacheService.del(`signup:${payload.email}`);
            
            // Save user to database
            const user = await this.userService.saveNewUser(payload);
            return user;

        }catch(e){
            throw e;
        }
    }

    async login(payload: any): Promise<string>{
        try{

            const user = await this.userService.getUserByEmail(payload.email);

            if(!user){ throw new BadRequestException("User does not exist")};

            if(!user.isActive){ throw new BadRequestException("User is not active")};

            if(user.isDeleted){ throw new BadRequestException("User is deleted")};
            
            const isPasswordMatched = await this.hasingService.verifyHash(user.password, payload.password);
            if(!isPasswordMatched){ throw new BadRequestException("Invalid password")};

            // Generate JWT token
            const jwtToken = await this.jwtTokenService.generateJwtToken({ userId: user._id, email: user.email } as any);

            return jwtToken;

        }catch(e){
            throw e;
        }
    }

}