import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, UnauthorizedException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AppConfiguration } from '../configuration/app.config';
import { DateTime } from 'luxon';


@Catch(HttpException, Error)
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(
    private applicationConfig: AppConfiguration,
  ) {}

  catch(exception: any, host: ArgumentsHost): void {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    
    let status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const env = this.applicationConfig.APP_ENV;
    const isDevelopment = env === 'development';
   

    let errorResponse: any = {
      statusCode: status,
      timestamp: DateTime.now().setZone('Asia/Kolkata').toFormat('yyyy-MM-dd HH:mm:ss'),
      path: request.url,
    };
    
    if (exception instanceof InternalServerErrorException) {
          
          errorResponse.message = 'Internal server error occured';
          if (isDevelopment) {
            errorResponse.stack = exception instanceof Error ? exception.stack : null;
          }

    }else if (exception instanceof BadRequestException) {

          // Specific handling for BadRequestException
          const responseContent = exception.getResponse();
          if (typeof responseContent === 'object') {
            errorResponse = {
              ...errorResponse,
              ...responseContent,
            };
          } else {
            errorResponse.message = responseContent;
          }

    }else if(exception instanceof UnauthorizedException){

          // Specific handling for validation UnauthorizedException
          const responseContent = exception.getResponse();
          if (typeof responseContent === 'object') {
            errorResponse = {
              ...errorResponse,
              ...responseContent,
            };
          } else {
            errorResponse.message = responseContent;
          }


    }else if(exception instanceof ForbiddenException){
      
          // Specific handling for validation UnauthorizedException
          const responseContent = exception.getResponse();
          if (typeof responseContent === 'object') {
            errorResponse = {
              ...errorResponse,
              ...responseContent,
            };
          } else {
            errorResponse.message = responseContent;
          }

    }else if(exception instanceof JsonWebTokenError){
          
          errorResponse.statusCode = 400;
          const responseContent = exception;
          if (typeof responseContent === 'object') {
            errorResponse = {
              ...errorResponse,
              ...responseContent,
            };
            
          } else {
                errorResponse.message = responseContent;
          }

    }else if(exception instanceof TokenExpiredError){

          errorResponse.statusCode = 400;
           const responseContent = exception;
           if (typeof responseContent === 'object') {
             errorResponse = {
               ...errorResponse,
               ...responseContent,
             };
             
           } else {
                 errorResponse.message = responseContent;
           }

    }else if (exception.name === "MongoServerError") {

      // Handle MongoDB errors
      switch (exception.code) {
        case 11000: // Duplicate key error
        errorResponse.statusCode = 409;
        status = 409;
        errorResponse.message = 'Duplicate entry. Value(s) are already exists.';
          break;

        case 121: // Validation error (invalid schema)
        case 16755: // Invalid schema or data type
        errorResponse.statusCode = 400;
        status = 400
        errorResponse.message = 'Invalid data type.';
          break;

        case 50: // Timeout error
        errorResponse.statusCode  = 408;
        status = 408;
        errorResponse.message = 'Request timeout. The operation took too long.';
          break;

        default:
          errorResponse.statusCode = 'An unknown error occurred';
          errorResponse.message = 'InternalServerError';
      }

    }else{

          errorResponse.message = exception instanceof HttpException ? exception.message : null;

    }

   
    response.status(status).json(errorResponse);
  }

}