import { Body, Controller, Post } from "@nestjs/common";
import { AnswerService } from "./answer.service";

@Controller('answer')
export class AnswerController {
    constructor(
        private readonly answerService: AnswerService
    ){}

    @Post('save-answer')
    async saveAnswer(@Body() payload: any){
        try{

            const savingAnswer = await this.answerService.saveAnswer(payload)
            return {
                status: true,
                message: 'Answer saved successfully',
            }

        }catch(e){
            throw e;
        }
    }
}