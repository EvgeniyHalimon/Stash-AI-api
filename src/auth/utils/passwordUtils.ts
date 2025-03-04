// library
import * as bcrypt from 'bcrypt';

const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Unknown error');
  }
};

const verifyPassword = async (password: string, hashPassword: string) => {
  try {
    const comparedPassword = await bcrypt.compare(password, hashPassword);
    return comparedPassword;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Unknown error');
  }
};

export { hashPassword, verifyPassword };
