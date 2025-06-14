// libraries
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty({ message: '$property should not be empty' })
  @ApiProperty({
    type: String,
    description: 'Email of user',
    required: true,
    example: 'bob@example.com',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: '$property should not be empty' })
  @ApiProperty({
    type: String,
    description: 'Password of user',
    required: true,
    example: '12345678',
  })
  readonly password: string;
}
