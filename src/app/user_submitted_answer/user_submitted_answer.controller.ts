import { Body, Controller, Post } from "@nestjs/common";
import { UserSubmittedAnswerService } from "./user_submitted_answer.service";

@Controller("user-answer")
export class UserSubmittedAnswerController {
    constructor(
        private readonly userSubmittedAnswerService: UserSubmittedAnswerService,
    ){}


    @Post("submit")
    async submitAnswer(@Body() payload: any) {
        try {
            const submittedAnswer = await this.userSubmittedAnswerService.submitAnswer(payload);
            return {
                status: true,
                message: 'Submitted answer suucessfully'
            }
        } catch (e) {
            throw e;
        }
    }

    @Post("get-user-submitted-answers")
    async getUserSubmittedAnswers(@Body() payload: any) {
        try {

            const { userId, question } = payload;
            const userSubmittedAnswers = await this.userSubmittedAnswerService.getUserSubmittedAnswers(userId, question);
            return {
                status: true,
                message: 'Fetched user submitted answers successfully',
                data: userSubmittedAnswers
            }

        } catch (e) {
            throw e;
        }
    }

}
