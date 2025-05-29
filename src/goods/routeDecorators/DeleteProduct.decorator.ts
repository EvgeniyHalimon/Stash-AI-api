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

export function DeleteProductDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a goods item' }),
    ApiResponse({
      status: 200,
      description: 'The goods has been successfully deleted.',
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
