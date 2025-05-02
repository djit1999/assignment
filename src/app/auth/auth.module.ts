import { Module } from "@nestjs/common";
import { DecryptionService } from "./decryption.service";
import { EncryptionService } from "./encryption.service";
import { HashingService } from "./hasing.service";
import { RandomStringService } from "./rand_str.service";
import { AuthService } from "./auth.service";
import { OTPService } from "./otp.service";
import { JwtTokenService } from "./jwt.service";
import { UserModule } from "../user/user.module";
import { EmailModule } from "../email/email.module";
import { AuthController } from "./auth.controller";
import { RedisModule } from "../redis/redis.module";
import { forwardRef } from "@nestjs/common";

@Module({
    imports: [forwardRef(() => UserModule), EmailModule, RedisModule],
    exports: [DecryptionService, EncryptionService, HashingService, RandomStringService, OTPService, AuthService, JwtTokenService],
    controllers: [AuthController],
    providers: [DecryptionService, EncryptionService, HashingService, RandomStringService, OTPService, AuthService, JwtTokenService]
})
export class AuthModule{}