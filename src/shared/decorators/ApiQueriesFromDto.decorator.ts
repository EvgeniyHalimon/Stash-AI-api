import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SwaggerEnumType } from '@nestjs/swagger/dist/types/swagger-enum.type';
import { getMetadataStorage, ValidationTypes } from 'class-validator';
import 'reflect-metadata';

export function ApiQueriesFromDto(dto: Type<any>, keysForOrderBy: any) {
  const metadataStorage = getMetadataStorage();
  const queries = metadataStorage.getTargetValidationMetadatas(
    dto,
    dto.name,
    false,
    false,
  );

  const decorators = queries.map((query) => {
    const { propertyName, type, name } = query;

    const isOptional = type === ValidationTypes.CONDITIONAL_VALIDATION;
    let fieldType;

    if (propertyName === 'order') {
      fieldType = 'enum';
    } else if (name === 'isString') {
      fieldType = String;
    } else if (name === 'isBoolean') {
      fieldType = Boolean;
    }

    if (propertyName === 'order') {
      return ApiQuery({
        name: propertyName,
        required: !isOptional,
        enum: ['ASC', 'DESC'],
      });
    }

    if (propertyName === 'orderBy' && keysForOrderBy) {
      return ApiQuery({
        name: propertyName,
        required: !isOptional,
        enum: Object.keys(keysForOrderBy) as SwaggerEnumType,
      });
    }

    return ApiQuery({
      name: propertyName,
      required: !isOptional,
      type: fieldType,
    });
  });

  return applyDecorators(...decorators);
}
