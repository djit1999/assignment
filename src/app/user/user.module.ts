import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/model/user.model";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user.controller";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), AuthModule],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule{}