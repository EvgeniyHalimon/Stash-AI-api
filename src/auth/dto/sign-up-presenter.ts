import { UserPresenter } from 'src/users/dto';
import User from 'src/users/user.schema';

export class SignUpPresenter extends UserPresenter {
  constructor(user: User) {
    super(user);
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.bio = user.bio;
    this.role = user.role;
    this.photo = user.photo;
    this.active = user.active;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
