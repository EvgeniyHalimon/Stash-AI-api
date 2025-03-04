// nest
import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const formattedErrors = validationErrors.map((error) => {
        return {
          property: error.property,
          constraints: Object.values(error.constraints || {}).map((message) =>
            this.formatMessage(message, error.property),
          ),
        };
      });
      return new BadRequestException({
        message: formattedErrors.flatMap((error) => error.constraints),
        error: 'Bad Request',
        statusCode: 400,
      });
    };
  }

  private formatMessage(message: string, property: string): string {
    const formattedProperty = this.capitalizeFirstLetter(property);
    return message.replaceAll(property, formattedProperty);
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
}
