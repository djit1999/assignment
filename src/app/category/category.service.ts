import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DateTime } from "luxon";
import { Model } from "mongoose";
import { Category } from "src/model/category.model";

@Injectable()
export class CategoryService{
    constructor(
        @InjectModel('Category')
        private readonly categoryModel: Model<Category>,
    ){}

    async getCategories(): Promise<Partial<Category[]>>{
        try{

            const categories =  await this.categoryModel.aggregate([
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        isActive: 1,
                        isDeleted: 1,
                    }
                }
            ]);
            return categories;

        }catch(e){
            throw e;
        }
    }

    async saveCategory(payload: any){
        try{

            let category = {}
            if(payload.name){ category["name"] = payload.name}
            category["createdAt"] = DateTime.utc().toJSDate()
            category["isActive"] = true;
            category["isDeleted"] = false;

            const newCategory = new this.categoryModel(category);
            return await newCategory.save();

        }catch(e){
            throw e;
        }
    }


    async getCategoriesAndQuestionCount(): Promise<Partial<Category[]>>{
        try{

            let pipeline: any[] = [
                  {
                    $lookup: {
                      from: 'questions', 
                      localField: '_id',
                      foreignField: 'categoryId',
                      as: 'questions'
                    }
                  },
                  {
                    $project: {
                      _id: 1,
                      category: '$name',
                      questionCount: { $size: '$questions' },
                    }
                  }
            ];
       

            const categoriesAndCount = await this.categoryModel.aggregate(pipeline)
            return categoriesAndCount;

        }catch(e){
            throw e;
        }
    }

    async getCategoryByName(name: string): Promise<Partial<Category>>{
        try{

            const category = await this.categoryModel.findOne({ name: new RegExp(`^${name}$`, 'i') });
            return category;

        }catch(e){
            throw e;
        }
    }

}