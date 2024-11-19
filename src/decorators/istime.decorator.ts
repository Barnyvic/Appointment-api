import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time string in HH:MM format`;
        },
      },
    });
  };
}
