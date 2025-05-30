import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw new InternalServerErrorException(
      err instanceof Error ? err.message : 'Password hashing failed',
    );
  }
};

const verifyPassword = async (password: string, hashPassword: string) => {
  try {
    const comparedPassword = await bcrypt.compare(password, hashPassword);
    return comparedPassword;
  } catch (err) {
    throw new InternalServerErrorException(
      err instanceof Error ? err.message : 'Unexpected bcrypt error',
    );
  }
};

export { hashPassword, verifyPassword };
