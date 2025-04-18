import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";

export const Match = (
    property: string,
    validateOptions?: ValidationOptions,
) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: "match",
            target: object.constructor,
            propertyName: propertyName,
            options: validateOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[
                        relatedPropertyName
                    ];
                    return value === relatedValue;
                },
            },
        });
    };
};
