import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { responseHandler } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const result = validationErrors.map((error) => ({
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return responseHandler({
          status: false,
          statusCode: HttpStatus.BAD_REQUEST,
          message: result[0].message,
        });
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
