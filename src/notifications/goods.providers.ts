import { modelsVocabulary } from 'src/shared';
import { Notification } from './notifications.schema';

const { NOTIFICATION_MODEL } = modelsVocabulary;

export const notificationsProviders = [
  {
    provide: NOTIFICATION_MODEL,
    useFactory: () => Notification,
    inject: ['DATABASE_CONNECTION'],
  },
];
