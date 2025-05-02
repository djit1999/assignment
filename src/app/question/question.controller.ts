import { BadRequestException, Body, Controller, Get, Post, Query, UnsupportedMediaTypeException, UploadedFile, UseInterceptors } from "@nestjs/common";    
import { QuestionService } from "./question.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { extname, join } from "path";
import { diskStorage } from "multer";
import * as fs from 'fs';
import { DateTime } from "luxon";



@Controller('question')
export class QuestionController{
    constructor(
        private readonly questionService: QuestionService
    ){}

    @Post('upload-csv')
    @UseInterceptors(
        FileInterceptor('excel', {
            storage: diskStorage({
                    destination: (req, file, cb) => {
                        try {
                
                            const uploadPath = join(__dirname, '..', '..', '..', 'uploads', 'excels');
                
                            fs.mkdirSync(uploadPath, { recursive: true });
                            cb(null, uploadPath);

                        } catch (err) {
                            cb(err, null);
                        }
                    },
                    filename: (req, file, cb) => {
                        const uniqueSuffix = DateTime.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        cb(null, `question-${uniqueSuffix}${ext}`);
                    },
            }),
            fileFilter: (req, file, cb) => {
                    const allowedMimes = [
                        'text/csv',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ];
            
                    if (!allowedMimes.includes(file.mimetype)) {
                    return cb(new UnsupportedMediaTypeException('Only CSV or Excel (.xls/.xlsx) files are allowed!'), false);
                    }
                    cb(null, true);
            },
        }),
    )
    async uploadCSV(@UploadedFile() file: Express.Multer.File, @Body() payload: any){
        try{

            if (!file) {
                throw new BadRequestException('No file uploaded');
            }

            const processingExcel = await this.questionService.saveAndQueueCSV(file.path);
            return {
                status: true,
                message: 'File uploaded successfully'
            }
            
        }catch(e){
            throw e;
        }
    }

    @Post('save-question')
    async saveQuestion(@Body() payload: any){
        try{

            const savingQuestion = await this.questionService.saveQuestion(payload);
            return {
                status: true,
                message: 'Question saved successfully'
            }

        }catch(e){
            throw e;
        }
    }

    @Get('get-questions-by-category')
    async getQuestion(@Query('categoryId') categoryId: string){
        try{

            const questions = await this.questionService.getQuestionsByCategory(categoryId)
            return {
                status: true,
                message: 'Data retrieved successfully',
                data: questions
            }

        }catch(e){
            throw e;
        }
    }

}
