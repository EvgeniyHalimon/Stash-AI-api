import { User } from './user.schema';
import { modelsVocabulary } from 'src/shared';

const { USER_MODEL } = modelsVocabulary;

export const userProviders = [
  {
    provide: USER_MODEL,
    useFactory: () => User,
    inject: ['DATABASE_CONNECTION'],
  },
];
