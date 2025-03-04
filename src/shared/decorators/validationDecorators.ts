import { applyDecorators } from '@nestjs/common';
import { MaxLength, MinLength } from 'class-validator';

export function MaxLengthWithMessage({
  max,
  property,
}: {
  max: number;
  property: string;
}) {
  return applyDecorators(
    MaxLength(max, {
      message: `${property} must be maximum ${max} characters long`,
    }),
  );
}

export function MinLengthWithMessage({
  min,
  property,
}: {
  min: number;
  property: string;
}) {
  return applyDecorators(
    MinLength(min, {
      message: `${property} must be ${min} or more characters long`,
    }),
  );
}
