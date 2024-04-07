import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: "Match" })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }
}

@ValidatorConstraint({ name: "string-or-number", async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
  validate(text: any, args: ValidationArguments) {
    return typeof text === "number" || typeof text === "string";
  }

  defaultMessage(args: ValidationArguments) {
    return "($value) must be number or string";
  }
}
