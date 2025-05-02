import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnswerSchema } from "src/model/answer.model";
import { AnswerService } from "./answer.service";
import { AnswerController } from "./answer.controller";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Answer', schema: AnswerSchema }])],
    exports: [AnswerService],
    controllers: [AnswerController],
    providers: [AnswerService]
})
export class AnswerModule{}