import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OptionSchema } from "src/model/option.model";
import { OptionController } from "./option.controller";
import { OptionService } from "./option.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Option', schema: OptionSchema}])],
    exports: [OptionService],
    controllers: [OptionController],
    providers: [OptionService]
})
export class OptionModule{}