import { Catch, ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import {responseHandler} from '../../utils'

@Catch()
export class GraphqlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {

    let statusCode = 500;
    let message = 'Internal server error';
    let status = false;
    let data = null

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      statusCode = exception.getStatus();
      message = (typeof exceptionResponse === 'object' && 'message' in exceptionResponse)
        ? (exceptionResponse as any).message
        : exceptionResponse.toString();
    } else if (exception instanceof Error) {
      message = exception.message;
    }else {
          status = exception['status'] ? exception['status'] : status
          statusCode = exception['statusCode'] ? exception['statusCode'] : statusCode
          message = exception['message'] ? exception['message'] : message
          data = exception['data'] ? exception['data'] : data
    }

    const response = responseHandler({
      status,
      statusCode,
      message,
      data
    });

    return response;
  }
}
