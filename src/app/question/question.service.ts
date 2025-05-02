import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DateTime } from "luxon";
import mongoose, { Model } from "mongoose";
import { Question } from "src/model/question.model";
import { Answer } from "src/model/answer.model";
import { Category } from "src/model/category.model";
import { OptionService } from "../option/option.service";
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";



@Injectable()
export class QuestionService {
    constructor(
        @InjectModel('Question')
        private readonly questionModel: Model<Question>,
        @InjectModel('Answer')
        private readonly answerModel: Model<Answer>,
        @InjectModel('Category')
        private readonly categoryModel: Model<Category>,
        @InjectQueue('process-question-csv') 
        private readonly questionQueue: Queue,
        private readonly optionService: OptionService
    ){}

    async saveQuestion(payload: any): Promise<Partial<Question>>{
        try{

            let question = {}
            if(payload.question){ question["question"] = payload.question};
            if(payload.categoryId){ question['categoryId'] = payload.categoryId };
            if(payload.answerId){ question['answerId'] = payload.answerId };
            question["createdAt"] = DateTime.utc().toJSDate();
            question["isActive"] = true;
            question["isDeleted"] = false;

            const newQuestion = new this.questionModel(question);
            const savedQuestion = await newQuestion.save();
            
            await Promise.all(
                payload.options.map((option: any) =>
                  this.optionService.saveOption({
                    name: option,
                    questionId: savedQuestion._id,
                  }),
                ),
              );

            return savedQuestion;

        }catch(e){
            throw e;
        }
    }


    async getQuestionsByCategory(categoryId: string): Promise<Partial<Question[]>>{
        try{

          const pipeline: any[] = [];

          // Conditionally filtering based on category
          pipeline.push({ $unwind: '$categoryId' });
          if (categoryId && categoryId !== 'all') {
              pipeline.push({
                $match: {
                  categoryId: { $in: [new mongoose.Types.ObjectId(categoryId)] },
                },
              });
          }

          pipeline.push(
            {
              $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
              },
            },
            { $unwind: '$category' },
            {
              $lookup: {
                from: 'answers',
                localField: 'answerId',
                foreignField: '_id',
                as: 'answer',
              },
            },
            {
              $unwind: {
                path: '$answer',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $group: {
                _id: '$category._id',
                category: { 
                      $first: {
                        _id: '$category._id',
                        name: '$category.name', 
                    }
              },
                questions: {
                  $push: {
                    _id: '$_id',
                    question: '$question',
                    answer: {
                      _id: '$answer._id',
                      answer: '$answer.answer',
                    },
                  },
                },
              },
            }
          );

          const questions = await this.questionModel.aggregate(pipeline);
          return questions;

        }catch(e){
          throw e;
        }
    }

    async saveAndQueueCSV(filePath: string): Promise<any> {
      try{

          const queuing = await this.questionQueue.add('process-question-csv', { filePath }, {
            removeOnComplete: true,
          });
          return queuing;

      }catch(e){
        throw e;
      }
    }

}

