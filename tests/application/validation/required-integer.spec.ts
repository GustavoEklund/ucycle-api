import { InvalidFieldError, RequiredFieldError } from '@/application/errors'
import { Required, RequiredInteger } from '@/application/validation'

describe('RequiredInteger', () => {
  it('should extend Required', () => {
    const sut = new RequiredInteger('')

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if validate returns RequiredFieldError', () => {
    const sut = new RequiredInteger(undefined, 'any_field')

    const errors = sut.validate()

    expect(errors).toEqual([
      new RequiredFieldError('any_field'),
      new InvalidFieldError('any_field'),
    ])
  })

  it('should return InvalidFieldError if value is not an Integer', () => {
    const sut = new RequiredInteger('invalid_value', 'any_field')

    const errors = sut.validate()

    expect(errors).toEqual([new InvalidFieldError('any_field')])
  })

  it('should return InvalidFieldError if value is not an Integer', () => {
    const sut = new RequiredInteger(1.1, 'any_field')

    const errors = sut.validate()

    expect(errors).toEqual([new InvalidFieldError('any_field')])
  })

  it('should return an empty array if value is not empty', () => {
    const sut = new RequiredInteger(1, 'any_field')

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })
})
