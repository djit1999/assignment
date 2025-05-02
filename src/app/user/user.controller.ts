import { BadRequestException, Body, Controller, Get, Post, Query, UnprocessableEntityException, UnsupportedMediaTypeException, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join} from "path";
import * as fs from 'fs'
import { DateTime } from "luxon";


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post('sign-up')
    async signUp(@Body() payload: any){
        try{

            const signingUp = await this.userService.saveNewUser(payload)
            return {
                status: true,
                message: "User signed up successfully"
            }

        }catch(e){
            throw e;
        }
    }

    
    @Post('update-user')
    @UseInterceptors(
        FileInterceptor('profile-image', {
            storage: diskStorage({
                    destination: (req, file, cb) => {
                    try {

                        const userId = req.body.userId; // Must be present in form-data
                        if (!userId) {
                        return cb(new BadRequestException('Missing userId'), null);
                        }
            
                        const uploadPath = join(__dirname, '..', '..', '..', 'uploads', 'profile-picture', userId);
            
                        fs.mkdirSync(uploadPath, { recursive: true });
                        cb(null, uploadPath);

                    } catch (err) {
                        cb(err, null);
                    }
                    },
                    filename: (req, file, cb) => {
                        const uniqueSuffix = DateTime.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        cb(null, `profile-${uniqueSuffix}${ext}`);
                    },
            }),
            fileFilter: (req, file, cb) => {
                    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return cb(new UnsupportedMediaTypeException('Only image files with extension(jpg|jpeg|png|gif) are allowed!'), false);
                    }
                    cb(null, true);
            },
        }),
    )
    async updateUser(@UploadedFile() file: Express.Multer.File, @Body() payload: any){
        try{

            if(file.path){ payload["pPicture"] = file.path };
            const updatingUser = await this.userService.updateUser(payload.userId, payload);
            return updatingUser;

        }catch(e){
            throw e;
        }
    }

    @Get('get-user')
    async getUser(@Query('userId') userId: string){
        try{

            const user = await this.userService.getUser(userId)
            return {
                status: true,
                message: 'Data retrieved successfully',
                data: user
            }

        }catch(e){
            throw e;
        }
    }
}