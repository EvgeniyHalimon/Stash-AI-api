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
    min: 8,
  },
};

export const userExample = {
  _id: 'b640e31e-8761-4137-93c5-2ccf5616309e',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  active: true,
  role: 'admin',
  createdAt: '2025-05-30T14:15:34.896+00:00',
  updatedAt: '2025-05-30T14:15:34.899+00:00',
};
