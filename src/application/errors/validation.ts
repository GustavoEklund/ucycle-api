import { Exception } from '@/domain/entities/errors'

export class RequiredFieldError extends Exception {
  constructor(fieldName?: string) {
    const message =
      fieldName === undefined ? 'field required' : `the field ${fieldName} is required`
    super('RequiredFieldError', message)
  }
}

export class InvalidFieldError extends Exception {
  constructor(fieldName?: string) {
    const message = fieldName === undefined ? 'field invalid' : `the field ${fieldName} is invalid`
    super('InvalidFieldError', message)
  }
}

export class InvalidMimeTypeError extends Exception {
  constructor(allowed: string[]) {
    super('InvalidMimeTypeError', `Unsupported mime type. Allowed types: ${allowed.join(', ')}`)
  }
}

export class MaxFileSizeError extends Exception {
  constructor(maxSizeInMb: number) {
    super('MaxFileSizeError', `File upload limit is ${maxSizeInMb}MB`)
  }
}
