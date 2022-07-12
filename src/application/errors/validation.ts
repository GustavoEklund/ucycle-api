export class RequiredFieldError extends Error {
  constructor(fieldName?: string) {
    const message =
      fieldName === undefined ? 'field required' : `the field ${fieldName} is required`
    super(message)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidFieldError extends Error {
  constructor(fieldName?: string) {
    const message = fieldName === undefined ? 'field invalid' : `the field ${fieldName} is invalid`
    super(message)
    this.name = 'InvalidFieldError'
  }
}

export class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Unsupported mime type. Allowed types: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}

export class MaxFileSizeError extends Error {
  constructor(maxSizeInMb: number) {
    super(`File upload limit is ${maxSizeInMb}MB`)
    this.name = 'MaxFileSizeError'
  }
}
