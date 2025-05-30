import mongoose, { model } from 'mongoose';
import { randomUUID } from 'crypto';
import { hashPassword } from './auth/utils/passwordUtils';
import { GoodsSchema } from './goods/goods.schema';
import { NotificationsSchema } from './notifications/notifications.schema';
import { UserRolesEnum } from './users/user.constants';
import { UserSchema } from './users/user.schema';

const UserModel = model('User', UserSchema);
const GoodsModel = model('Goods', GoodsSchema);
const NotificationModel = model('Notification', NotificationsSchema);

const MONGO_URI = 'mongodb://localhost:27017/stash';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log('Connected to MongoDB');

    await Promise.all([
      UserModel.deleteMany({}),
      GoodsModel.deleteMany({}),
      NotificationModel.deleteMany({}),
    ]);

    const users = await Promise.all([
      createUser('Alice', 'Smith', 'alice@example.com', UserRolesEnum.ADMIN),
      createUser('Bob', 'Johnson', 'bob@example.com', UserRolesEnum.USER),
    ]);

    const goods = await Promise.all([
      createGoods(users[0]._id, 'MacBook Pro', 2000, 1500, 0, 'electronics'),
      createGoods(users[1]._id, 'T-shirt', 25, 5, 0, 'clothing'),
      createGoods(users[0]._id, 'iPhone 15', 1200, 800, 0, 'electronics'),
      createGoods(users[1]._id, 'Jeans', 60, 20, 0, 'clothing'),
      createGoods(
        users[0]._id,
        'Wireless Headphones',
        150,
        100,
        0,
        'electronics',
      ),
      createGoods(users[1]._id, 'Sneakers', 90, 30, 0, 'clothing'),
      createGoods(users[0]._id, 'Gaming Mouse', 70, 20, 0, 'electronics'),
      createGoods(users[1]._id, 'Backpack', 40, 10, 0, 'accessories'),
      createGoods(users[0]._id, 'Smartwatch', 300, 200, 0, 'electronics'),
      createGoods(users[1]._id, 'Jacket', 120, 60, 0, 'clothing'),
      createGoods(users[0]._id, 'Tablet', 500, 250, 0, 'electronics'),
      createGoods(users[1]._id, 'Cap', 15, 5, 0, 'accessories'),
    ]);

    await Promise.all([
      createNotification(users[0]._id, 'Welcome Alice!'),
      createNotification(users[1]._id, 'Welcome Bob!', goods[1]._id),
      createNotification(
        users[1]._id,
        'Your product will be shipped soon.',
        goods[1]._id,
      ),
    ]);

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  role: string = UserRolesEnum.USER,
) {
  const password = await hashPassword('12345678');
  return UserModel.create({
    _id: randomUUID(),
    firstName,
    lastName,
    email,
    password,
    role,
    active: true,
  });
}

function createGoods(
  userId: string,
  title: string,
  price: number,
  postponed: number,
  remainingToBePostponed: number,
  category: string,
) {
  return GoodsModel.create({
    _id: randomUUID(),
    user: userId,
    title,
    price,
    category,
    postponed,
    remainingToBePostponed,
    whenWillItEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}

function createNotification(userId: string, text: string, goodsId?: string) {
  return NotificationModel.create({
    _id: randomUUID(),
    user: userId,
    goods: goodsId,
    text,
  });
}

seed();
