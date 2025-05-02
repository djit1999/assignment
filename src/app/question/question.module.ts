import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestionSchema } from "src/model/question.model";
import { QuestionService } from "./question.service";
import { QuestionController } from "./question.controller";
import { AnswerSchema } from "src/model/answer.model";
import { CategorySchema } from "src/model/category.model";
import { BullModule } from "@nestjs/bullmq";
import { ExcelProcessor } from "./queue/question.queue.processor";
import { CategoryModule } from "../category/category.module";
import { OptionModule } from "../option/option.module";
import { AnswerModule } from "../answer/answer.module";


@Module({
    imports: [
        BullModule.registerQueue({ name: 'process-question-csv' }),
        MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }, { name: 'Answer', schema: AnswerSchema }, { name: 'Category', schema: CategorySchema }]), 
        OptionModule,
        CategoryModule,
        OptionModule,
        AnswerModule
    ],
    exports: [QuestionService, ExcelProcessor],
    controllers :[QuestionController],
    providers: [QuestionService, ExcelProcessor]
})
export class QuestionModule{}