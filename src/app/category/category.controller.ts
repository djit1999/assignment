import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";

@Controller('category')
export class CategoryController{
    constructor(
        private readonly categoryService: CategoryService
    ){}

    @Post('save-category')
    async saveNewCategory(@Body() payload: any){
        try{

            const savingCategory = await this.categoryService.saveCategory(payload);
            return {
                status: true,
                message: 'Category saved successfully'
            }

        }catch(e){
            throw e;
        }
    } 

    @Get('get-categories')
    async getCategory(){
        try{
                const categories = await this.categoryService.getCategories();
                return {
                    status: true,
                    message: 'Data retrieved succesfully',
                    data: categories
                }
        }catch(e){
            throw e;
        }
    }

    @Get('get-categories-question-count')
    async getCategoryAndCount(){
        try{

            const categoriesAndCount = await this.categoryService.getCategoriesAndQuestionCount();
            return {
                status: true,
                message: 'Data retrieved succesfully',
                data: categoriesAndCount
            }

        }catch(e){
            throw e;
        }
    }

    @Get('get-category-by-name')
    async getCategoryByName(@Query() name: any){
        try{
            
            const category = await this.categoryService.getCategoryByName(name.name);
            return {
                status: true,
                message: 'Data retrieved succesfully',
                data: category
            }

        }catch(e){
            throw e;
        }
    }
}