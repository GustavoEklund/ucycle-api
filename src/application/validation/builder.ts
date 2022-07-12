import {
  AllowedMimeTypes,
  Extension,
  MaxFileSize,
  Required,
  RequiredBuffer,
  RequiredInteger,
  RequiredString,
  RequiredBoolean,
  Validator,
} from '@/application/validation'

export enum RequiredType {
  any = 'any',
  string = 'string',
  buffer = 'buffer',
  integer = 'integer',
  boolean = 'boolean',
}

export class ValidationBuilder {
  private constructor(
    private readonly value: any,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  public static of({ value, fieldName }: { value: any; fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(value, fieldName)
  }

  public required(type: RequiredType): ValidationBuilder {
    switch (type) {
      case RequiredType.string:
        this.validators.push(new RequiredString(this.value, this.fieldName))
        return this
      case RequiredType.buffer:
        this.validators.push(new RequiredBuffer(this.value?.buffer, this.fieldName))
        return this
      case RequiredType.integer:
        this.validators.push(new RequiredInteger(this.value, this.fieldName))
        return this
      case RequiredType.boolean:
        this.validators.push(new RequiredBoolean(this.value, this.fieldName))
        return this
      case RequiredType.any:
      default:
        this.validators.push(new Required(this.value, this.fieldName))
        return this
    }
  }

  public file({
    allowedExtensions,
    maxSizeInMb,
  }: {
    allowedExtensions: Extension[]
    maxSizeInMb: number
  }): ValidationBuilder {
    this.validators.push(new AllowedMimeTypes(allowedExtensions, this.value?.mimeType))
    this.validators.push(new MaxFileSize(maxSizeInMb, this.value?.buffer))
    return this
  }

  public build(): Validator[] {
    return this.validators
  }
}
