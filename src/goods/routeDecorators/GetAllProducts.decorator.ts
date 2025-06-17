import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetAllProductsDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all goods with filtering and pagination' }),
    ApiResponse({
      status: 200,
      description: 'Return all goods.',
      example: {
        page: 1,
        limit: 10,
        goods: [
          {
            _id: 'e0726ce0-aa4e-478f-83f6-1ac7785f577b',
            title: 'Jacket',
            price: 120,
            category: 'clothing',
            user: {
              _id: 'cfb3569f-4655-4208-8354-410ee57a1f9c',
              firstName: 'Bob',
              lastName: 'Johnson',
              email: 'bob@example.com',
              role: 'user',
            },
            postponed: 60,
            remainingToBePostponed: 60,
            whenWillItEnd: '2025-06-24T08:38:13.773Z',
            createdAt: '2025-06-17T08:38:13.773Z',
            updatedAt: '2025-06-17T08:38:13.775Z',
          },
          {
            _id: 'd0a005b7-2126-4a16-9a5a-b80e71eb840b',
            title: 'Sneakers',
            price: 90,
            category: 'clothing',
            user: {
              _id: 'cfb3569f-4655-4208-8354-410ee57a1f9c',
              firstName: 'Bob',
              lastName: 'Johnson',
              email: 'bob@example.com',
              role: 'user',
            },
            postponed: 30,
            remainingToBePostponed: 60,
            whenWillItEnd: '2025-06-24T08:38:13.772Z',
            createdAt: '2025-06-17T08:38:13.772Z',
            updatedAt: '2025-06-17T08:38:13.775Z',
          },
        ],
        count: 2,
      },
    }),
  );
}
