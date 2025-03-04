// libraries
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// constants
import { userFieldLengths } from '../user.constants';

// custom decorators
import {
  MaxLengthWithMessage,
  MinLengthWithMessage,
} from 'src/shared/decorators';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '$property must be not empty' })
  @MaxLengthWithMessage({
    max: userFieldLengths.firstName.max,
    property: 'First name',
  })
  @ApiProperty({
    type: String,
    description: 'First name of user',
    required: true,
    example: 'Morgan',
  })
  readonly firstName: string;

  @IsString()
  @IsNotEmpty({ message: '$property must be not empty' })
  @MaxLengthWithMessage({
    max: userFieldLengths.lastName.max,
    property: 'Last name',
  })
  @ApiProperty({
    type: String,
    description: 'Last name of user',
    required: true,
    example: 'Blackhand',
  })
  readonly lastName: string;

  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email of user',
    required: true,
    example: 'morgan-blackhand@gmail.com',
  })
  readonly email: string;

  @IsString()
  @MinLengthWithMessage({
    min: userFieldLengths.password.min,
    property: 'Password',
  })
  @ApiProperty({
    type: String,
    description: 'Password of user',
    required: true,
    minLength: userFieldLengths.password.min,
    example: 'qwertyui12345678',
  })
  readonly password: string;

  @IsString()
  @MinLengthWithMessage({ min: userFieldLengths.bio.min, property: 'Bio' })
  @MaxLengthWithMessage({
    max: userFieldLengths.bio.max,
    property: 'Bio',
  })
  @ApiProperty({
    type: String,
    description: 'Bio of user',
    required: true,
    minLength: userFieldLengths.bio.min,
    maxLength: userFieldLengths.bio.max,
    example: 'Hello my name is Monty',
  })
  readonly bio: string;
}
