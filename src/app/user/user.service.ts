import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { User } from "src/model/user.model";
import { HashingService } from "../auth/hasing.service";
import { DateTime } from "luxon";


@Injectable()
export class UserService {
    constructor(
        @InjectModel('User')
        private readonly userModel: Model<User>,
        private readonly hashingService: HashingService
    ){}


    async saveNewUser(payload: any): Promise<Partial<User>>{
        try{

            let user = {}
            if(payload.password){ user["password"] = await this.hashingService.hash(payload.password)}
            if(payload.firstName){ user["firstName"] = payload.firstName }
            if(payload.lastName){ user["lastName"] = payload.lastName }
            if(payload.email){ user["email"] = payload.email }
            if(payload.pPicture){ user["pPicture"] = payload.pPicture }
            user["createdAt"] = DateTime.utc().toJSDate()
            user["isActive"] = true;
            user["isDeleted"] = false;

            const newUser = new this.userModel(user);
            return await newUser.save();
            
        }catch(e){
            throw e;
        }
    }


    async getUser(userId: string): Promise<Partial<User>>{
        try{

            const user =  await this.userModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
                    },
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        pPicture: 1,
                        isActive: 1,
                        isDeleted: 1,
                        createdAt: 1
                    }
                }
            ]);

            return user[0];

        }catch(e){
            throw e;
        }
    }

    async getUserByEmail(email: string): Promise<Partial<User>>{
        try{

            const user =  await this.userModel.aggregate([
                {
                    $match: {
                        email: email
                    },
                },
                {
                    $project: {
                        _id: 1,
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        pPicture: 1,
                        password: 1,
                        isActive: 1,
                        isDeleted: 1,
                        createdAt: 1
                    }
                }
            ]);

            return user[0];

        }catch(e){
            throw e;
        }
    }


    async updateUser(userId: string, payload: any): Promise<Partial<User>>{
        try{

            let user = {}
            if(payload.password){ user["password"] = await this.hashingService.hash(payload.password)};
            if(payload.firstName){ user["firstName"] = payload.firstName };
            if(payload.lastName){ user["lastName"] = payload.lastName };
            if(payload.email){ user["email"] = payload.email };
            if(payload.pPicture){ user["pPicture"] = payload.pPicture };
            if(payload.isActive){ user["isActive"] = payload.isActive };
            if(payload.isDeleted){ user["isDeleted"] = payload.isDeleted };
            user["updatedAt"] = DateTime.utc().toJSDate()


            const updatedUser = await this.userModel.findByIdAndUpdate(userId, user, { new: true }).select('-password');;
            return updatedUser;

        }catch(e){
            throw e;
        }
    }

}