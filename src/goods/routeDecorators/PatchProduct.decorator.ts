import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { vocabulary } from 'src/shared';

const {
  GOODS: { GOODS_NOT_FOUND },
} = vocabulary;

export function PatchDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a goods item' }),
    ApiResponse({
      status: 200,
      description: 'The goods has been successfully updated.',
    }),
    ApiNotFoundResponse({
      example: {
        message: GOODS_NOT_FOUND,
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      },
      description: "When goods doesn't exist on database",
    }),
  );
}
