import { ValidationError } from '@nestjs/common/interfaces/external/validation-error.interface';
import { BadRequestException } from '@nestjs/common';

export function validationExceptionFactory(errors: ValidationError[]) {
  return new BadRequestException(
    errors.map((error: ValidationError) => ({
      property: error.property,
      constraints: error.constraints,
      children: error.children,
    })),
  );
}
