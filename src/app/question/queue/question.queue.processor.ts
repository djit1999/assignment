import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as csv from 'csv-parser'; 
import { createReadStream, unlinkSync } from 'fs';
import { finalize, fromEvent, lastValueFrom, mergeMap } from 'rxjs';
import { CategoryService } from 'src/app/category/category.service';
import { OptionService } from 'src/app/option/option.service';
import { AnswerService } from 'src/app/answer/answer.service';
import { QuestionService } from '../question.service';


@Processor('process-question-csv')
export class ExcelProcessor extends WorkerHost {

    constructor(
        private readonly categoryService: CategoryService,
        private readonly optionService: OptionService,
        private readonly answerService: AnswerService,
        private readonly questionService: QuestionService 
    ){
        super();
    }

  async process(job: Job<any, any, string>): Promise<any> {
    try{
        const { filePath } = job.data;
        const stream = createReadStream(filePath).pipe(csv());

        const csv$ = fromEvent(stream, 'data').pipe(


            mergeMap(async (row: any) => {

              const categoryNames = (row.categories || '')
                .split(',')
                .map((c: string) => c.trim());
          
              const categoryIds = await Promise.all(
                categoryNames.map(async (name: string) => {
                  try {
                    const existing = await this.categoryService.getCategoryByName(name);
                    if (existing) return existing._id;
              
                    const created = await this.categoryService.saveCategory({ name });
                    return created._id;
                  } catch (error) {
                    if (error.code === 11000) {
                      // Handle duplicate key error (e.g., category already exists)
                      const existing = await this.categoryService.getCategoryByName(name);
                      if (existing) return existing._id;
                    }
                    // If it's another kind of error, rethrow it
                    throw error;
                  }
                })
              );
          
              const savedAnswer = await this.answerService.saveAnswer({
                answer: row.answer,
              });
          
              const options = (row.options || '').split(',').map((opt: string) => opt.trim());
          
              await this.questionService.saveQuestion({
                question: row.question,
                answerId: savedAnswer._id,
                categoryId: categoryIds,
                options: options,
              });
            }, 4),
            finalize(() => {
              unlinkSync(filePath);
              console.log('CSV processing complete, file deleted.');
            }),
          );
      
          await lastValueFrom(csv$);
          return { message: 'CSV imported successfully' };
        
    }catch(e){
        throw e;
    }
  }

}