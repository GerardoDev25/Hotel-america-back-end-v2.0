import { CustomError } from '@domain/error';
import { IUser, UserRole } from '@domain/interfaces';
import {
  BooleanValidator,
  DateValidator,
  StringValidator,
} from '@domain/type-validators';

export class UserEntity implements IUser {
  id: string;
  role: UserRole;
  birdDate: string;
  name: string;
  phone: string;
  username: string;
  password: string;
  isActive: boolean;

  constructor(params: IUser) {
    this.id = params.id;
    this.role = params.role;
    this.birdDate = params.birdDate;
    this.name = params.name;
    this.phone = params.phone;
    this.username = params.username;
    this.password = params.password;
    this.isActive = params.isActive;
  }

  private static verifyProperties(properties: IUser) {
    const { id, role, birdDate, name, phone, username, password, isActive } =
      properties;

    // * id
    const idValidation = StringValidator.isValidUUID(id);
    if (idValidation !== true) {
      throw CustomError.badRequest('id ' + idValidation);
    }
    // * roomType
    const userRoleValid = StringValidator.mostBe({
      value: role,
      allowValues: ['admin', 'cafe', 'laundry', 'reception'],
    });
    if (userRoleValid !== true)
      throw CustomError.badRequest('roomType ' + userRoleValid);

    // * birdDate
    const birdDateValid = DateValidator.isValid(birdDate);
    if (birdDateValid !== true)
      throw CustomError.badRequest('birdDate ' + birdDateValid);

    // * name
    const nameValid = StringValidator.isValid(name);
    if (nameValid !== true) throw CustomError.badRequest('name ' + nameValid);

    // * phone
    const phoneValid = StringValidator.isValid(phone);
    if (phoneValid !== true)
      throw CustomError.badRequest('phone ' + phoneValid);

    // * username
    const usernameValid = StringValidator.isValid(username);
    if (usernameValid !== true)
      throw CustomError.badRequest('username ' + usernameValid);

    // * password
    const passwordValid = StringValidator.isValid(password);
    if (passwordValid !== true)
      throw CustomError.badRequest('password ' + passwordValid);

    // * isActive
    const isAvailableValid = BooleanValidator.isValid(isActive);
    if (isAvailableValid !== true)
      throw CustomError.badRequest('isActive ' + isAvailableValid);
  }

  static fromObject(object: Record<string, any>): UserEntity {
    const { id, role, birdDate, name, phone, username, password, isActive } =
      object;

    UserEntity.verifyProperties({
      id,
      role,
      birdDate,
      name,
      phone,
      username,
      password,
      isActive,
    });

    const newBirdDate =
      new Date(birdDate).toISOString().split('T').at(0) ?? birdDate;

    return new UserEntity({
      id,
      role,
      birdDate: newBirdDate,
      name,
      phone,
      username,
      password,
      isActive: BooleanValidator.toBoolean(isActive) ?? false,
    });
  }
}
