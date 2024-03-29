import { RequiredFieldError } from '@/application/errors'
import { Required, RequiredString } from '@/application/validation'

describe('RequiredString', () => {
  it('should extend Required', () => {
    const sut = new RequiredString('')

    expect(sut).toBeInstanceOf(Required)
  })

  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual([new RequiredFieldError('any_field')])
  })

  it('should return an empty array if value is not empty', () => {
    const sut = new RequiredString('any_value', 'any_field')

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })
})
