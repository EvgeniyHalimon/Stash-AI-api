import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindAllHistoryDecorators() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all history of postponement with concrete range',
    }),
    ApiResponse({
      status: 200,
      description: 'Return all history for concrete period.',
      example: [
        {
          date: '2025-06-17',
          amount: 15,
        },
        {
          date: '2025-06-18',
          amount: 35,
        },
      ],
    }),
  );
}
