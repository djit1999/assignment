import { Module } from "@nestjs/common";    
import { UserSubmittedAnswerController } from "./user_submitted_answer.controller";
import { UserSubmittedAnswerService } from "./user_submitted_answer.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSubmittedAnswerSchema } from "src/model/user_submitted_answer.model";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'UserSubmittedAnswer', schema: UserSubmittedAnswerSchema }])],
    exports :[UserSubmittedAnswerService],
    controllers: [UserSubmittedAnswerController],
    providers: [UserSubmittedAnswerService],
})
export class UserSubmittedAnswerModule {}   