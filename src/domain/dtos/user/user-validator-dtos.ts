import { CreateUser, UpdateUser, UserRolesList } from '@domain/interfaces';
import {
  StringValidator,
  DateValidator,
  BooleanValidator,
} from '@domain/type-validators';

export class UserValidator {
  static create(object: CreateUser): string[] {
    const errors: string[] = [];

    const {
      role,
      birdDate,
      name,
      phone,
      username,
      password,
      isActive = false,
    } = object;

    // * role
    const roleValid = StringValidator.mostBe({
      value: role,
      allowValues: [
        UserRolesList.ADMIN,
        UserRolesList.CAFE,
        UserRolesList.LAUNDRY,
        UserRolesList.RECEPTION,
      ],
    });
    if (roleValid !== true) errors.push('role ' + roleValid);

    // * birdDate
    const birdDateValid = DateValidator.isValid(birdDate);
    if (birdDateValid !== true) errors.push('birdDate ' + birdDateValid);

    // * name,
    const nameValid = StringValidator.isValid(name);
    if (nameValid !== true) errors.push('name ' + nameValid);

    // * phone,
    const phoneValid = StringValidator.isValid(phone);
    if (phoneValid !== true) errors.push('phone ' + phoneValid);

    // * username,
    const usernameValid = StringValidator.isValid(username);
    if (usernameValid !== true) errors.push('username ' + usernameValid);

    // * password,
    const passwordValid = StringValidator.isValid(password);
    if (passwordValid !== true) errors.push('password ' + passwordValid);

    // * isActive
    const isActiveValid = BooleanValidator.isValid(isActive);
    if (isActiveValid !== true) errors.push('isActive ' + isActiveValid);

    return errors;
  }

  static update(object: UpdateUser): string[] {
    const errors: string[] = [];

    const { id, role, birdDate, name, phone, username, password, isActive } =
      object;

    // * id
    const idValid = StringValidator.isValidUUID(id);
    if (idValid !== true) errors.push('id ' + idValid);

    // * role
    if (role !== undefined) {
      const roleValid = StringValidator.mostBe({
        value: role,
        allowValues: [
          UserRolesList.ADMIN,
          UserRolesList.CAFE,
          UserRolesList.LAUNDRY,
          UserRolesList.RECEPTION,
        ],
      });
      if (roleValid !== true) errors.push('role ' + roleValid);
    }

    // * birdDate
    if (birdDate !== undefined) {
      const birdDateValid = DateValidator.isValid(birdDate);
      if (birdDateValid !== true) errors.push('birdDate ' + birdDateValid);
    }
    // * name
    if (name !== undefined) {
      const nameValid = StringValidator.isValid(name);
      if (nameValid !== true) errors.push('name ' + nameValid);
    }

    // * phone
    if (phone !== undefined) {
      const phoneValid = StringValidator.isValid(phone);
      if (phoneValid !== true) errors.push('phone ' + phoneValid);
    }

    // * username
    if (username !== undefined) {
      const usernameValid = StringValidator.isValid(username);
      if (usernameValid !== true) errors.push('username ' + usernameValid);
    }

    // * password
    if (password !== undefined) {
      const passwordValid = StringValidator.isValid(password);
      if (passwordValid !== true) errors.push('password ' + passwordValid);
    }

    // * isActive
    if (isActive !== undefined) {
      const isActiveValid = BooleanValidator.isValid(isActive);
      if (isActiveValid !== true) errors.push('isActive ' + isActiveValid);
    }

    return errors;
  }
}
