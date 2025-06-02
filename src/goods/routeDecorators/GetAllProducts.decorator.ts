import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetAllProductsDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all goods with filtering and pagination' }),
    ApiResponse({ status: 200, description: 'Return all goods.' }),
  );
}
