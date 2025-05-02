import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DateTime } from "luxon";
import { Model } from "mongoose";
import { Answer } from "src/model/answer.model";

@Injectable()
export class AnswerService {
    constructor(
        @InjectModel('Answer')
        private readonly answerModel: Model<Answer>,
    ){}

    async saveAnswer(payload: any){
        try{
            
            let answer = {}
            if(payload.answer){ answer["answer"] = payload.answer};
            answer["createdAt"] = DateTime.utc().toJSDate();
            answer["isActive"] = true;
            answer["isDeleted"] = false;

           
            const newAnswer = new this.answerModel(answer);
            return await newAnswer.save();

        }catch(e){
            console.log(e)
            throw e;
        }
    }
}