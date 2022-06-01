import { InvalidMimeTypeError } from '@/application/errors'
import { AllowedMimeTypes } from '@/application/validation'

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg')

    const errors = sut.validate()

    expect(errors).toEqual([new InvalidMimeTypeError(['png'])])
  })

  it('should return an empty array if value is valid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/png')

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })

  it('should return an empty array if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpg')

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })

  it('should return an empty array if value is valid', () => {
    const sut = new AllowedMimeTypes(['jpg'], 'image/jpeg')

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })

  it('should return an empty array if value is valid', () => {
    const sut = new AllowedMimeTypes(['csv'], 'text/csv')

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })
})
