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

export function GetProductByIdDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a goods item by id' }),
    ApiResponse({ status: 200, description: 'Return the goods item.' }),
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
