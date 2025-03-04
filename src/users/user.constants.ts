export enum UserRolesEnum {
  USER = 'user',
  ADMIN = 'admin',
}

export const userFieldLengths = {
  firstName: {
    max: 200,
  },
  lastName: {
    max: 200,
  },
  password: {
    min: 16,
  },
};
