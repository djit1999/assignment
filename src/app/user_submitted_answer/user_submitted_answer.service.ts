import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DateTime } from "luxon";
import mongoose, { Model } from "mongoose";
import { User } from "src/model/user.model";
import { UserSubmittedAnswer } from "src/model/user_submitted_answer.model"; // Adjust the import path as necessary

@Injectable()   
export class UserSubmittedAnswerService {
    constructor(
        @InjectModel('UserSubmittedAnswer') 
        private readonly userSubmittedAnswerModel: Model<UserSubmittedAnswer>, 
    ){}


    async submitAnswer(payload: any){
        try{
        
            const { answerId, questionId, userId } = payload;
            const newSubmission = new this.userSubmittedAnswerModel({
                answerId,
                questionId,
                userId,
                submittedAt: DateTime.utc().toJSDate()
            });

            return await newSubmission.save();

        }catch(e){
            throw e;
        }
    }

    async getUserSubmittedAnswers(userId: string, question: string, timeZone = 'Asia/Kolkata'): Promise<Partial<UserSubmittedAnswer[]>> {
        try{

            const pipeline = [
                {
                  $match: { userId: new mongoose.Types.ObjectId(userId) }
                },
                {
                  $lookup: {
                    from: 'questions',
                    localField: 'questionId',
                    foreignField: '_id',
                    as: 'question'
                  }
                },
                { $unwind: '$question' },
                {
                  $match: {
                    'question.question': { $regex: new RegExp(question, 'i') }
                  }
                },
                {
                  $lookup: {
                    from: 'answers',
                    localField: 'answerId',
                    foreignField: '_id',
                    as: 'answer'
                  }
                },
                { $unwind: '$answer' },
                {
                  $addFields: {
                    submittedAt: {
                      $dateToString: {
                        date: '$submittedAt',
                        timezone: timeZone,
                        format: '%Y-%m-%d %H:%M:%S'
                      }
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    question: '$question.question',
                    answer: '$answer.answer',
                    submittedAt: 1
                  }
                }
              ];

              const result = await this.userSubmittedAnswerModel.aggregate(pipeline);
              return result;
            
        }catch(e){
            throw e;
        }
    }

  
}   