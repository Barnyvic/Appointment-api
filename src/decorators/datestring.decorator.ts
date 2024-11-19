import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidBirthdateConstraint implements ValidatorConstraintInterface {
  validate(birthdate: any, args: ValidationArguments) {
    if (typeof birthdate === 'undefined' || birthdate === null) {
      return true;
    }
    if (typeof birthdate === 'string' && birthdate.trim() === '') {
      return false;
    }
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return typeof birthdate === 'string' && regex.test(birthdate);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Birthdate must be a valid date string in the format YYYY-MM-DD or not provided';
  }
}

export function IsValidBirthdate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidBirthdateConstraint,
    });
  };
}
