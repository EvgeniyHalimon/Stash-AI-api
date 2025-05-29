import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreateProductDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new goods item' }),
    ApiResponse({
      status: 201,
      description: 'The goods has been successfully created.',
    }),
    ApiResponse({ status: 400, description: 'Bad Request.' }),
  );
}
