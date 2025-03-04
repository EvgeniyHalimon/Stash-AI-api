import { UserPresenter } from 'src/users/dto';
import { IUser } from 'src/users/user.types';

export class SignUpPresenter extends UserPresenter {
  constructor(user: IUser) {
    super(user);
    this._id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.active = user.active;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
