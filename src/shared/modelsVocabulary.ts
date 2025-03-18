import { Goods } from 'src/goods/goods.schema';
import { Notification } from 'src/notifications/notifications.schema';
import { User } from 'src/users/user.schema';

export const modelsVocabulary = {
  USER_MODEL: User.name,
  NOTIFICATION_MODEL: Notification.name,
  GOODS_MODEL: Goods.name,
};
