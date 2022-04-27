import {
  AllowedMimeTypes,
  MaxFileSize,
  Required,
  RequiredBuffer,
  RequiredString,
  RequiredType,
  ValidationBuilder,
} from '@/application/validation'

describe('ValidationBuilder', () => {
  it('should return RequiredString', () => {
    const validators = ValidationBuilder.of({ value: 'any_value', fieldName: 'any_field' })
      .required(RequiredType.string)
      .build()

    expect(validators).toEqual([new RequiredString('any_value', 'any_field')])
  })

  it('should return RequiredBuffer', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: { buffer }, fieldName: 'any_field' })
      .required(RequiredType.buffer)
      .build()

    expect(validators).toEqual([new RequiredBuffer(buffer, 'any_field')])
  })

  it('should return Required', () => {
    const validators = ValidationBuilder.of({ value: { any: 'any' }, fieldName: 'any_field' })
      .required(RequiredType.any)
      .build()

    expect(validators).toEqual([new Required({ any: 'any' }, 'any_field')])
  })

  it('should return Required', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({ value: { buffer }, fieldName: 'any_field' })
      .required(RequiredType.any)
      .build()

    expect(validators).toEqual([new Required({ buffer }, 'any_field')])
  })

  it('should return correct file validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({
      value: { buffer, mimeType: 'image/png' },
      fieldName: 'file',
    })
      .file({ allowedExtensions: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png'], 'image/png'),
      new MaxFileSize(6, buffer),
    ])
  })

  it('should return correct image validators', () => {
    const buffer = Buffer.from('any_buffer')

    const validators = ValidationBuilder.of({
      value: { buffer, mimeType: 'image/png' },
      fieldName: 'file',
    })
      .file({ allowedExtensions: ['png'], maxSizeInMb: 6 })
      .build()

    expect(validators).toEqual([
      new AllowedMimeTypes(['png'], 'image/png'),
      new MaxFileSize(6, buffer),
    ])
  })
})
