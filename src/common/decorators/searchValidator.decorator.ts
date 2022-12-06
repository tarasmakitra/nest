import { UsePipes, ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from '../exceptions/validation.exceptionFactory';

export const Search = (skipMissingProperties = true) =>
  UsePipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties,
      exceptionFactory: validationExceptionFactory,
    }),
  );
