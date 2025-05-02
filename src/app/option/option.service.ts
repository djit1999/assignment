import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DateTime } from "luxon";
import { Model } from "mongoose";
import { Option } from "src/model/option.model";

@Injectable()
export class OptionService{
    constructor(
        @InjectModel('Option')
        private readonly optionModel: Model<Option>,
    ){}

    async saveOption(payload: any){
        try{

            let option = {}
            if(payload.name){ option["name"] = payload.name};
            if(payload.questionId){ option['questionId'] = payload.questionId };
            option["createdAt"] = DateTime.utc().toJSDate();
            option["isActive"] = true;
            option["isDeleted"] = false;

            const newOption = new this.optionModel(option);
            return await newOption.save();

        }catch(e){
            throw e;
        }
    }

}