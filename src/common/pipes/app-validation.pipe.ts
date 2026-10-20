// common/pipes/app-validation.pipe.ts - one place to configure validation
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    transform: true,              // turn plain JSON into DTO class instances
    whitelist: true,              // remove properties that have no decorator
    forbidNonWhitelisted: true,   // ...and reject the request instead of ignoring
    // do not add missing keys as undefined
    transformOptions: { exposeUnsetFields: false },
    exceptionFactory: (errors: ValidationError[]) =>
      new BadRequestException({
        statusCode: 400,
        error: 'Validation failed',
        details: errors.flatMap((e) => Object.values(e.constraints ?? {})),
      }),
  });
}
