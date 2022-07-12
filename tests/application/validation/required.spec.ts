import { RequiredFieldError } from '@/application/errors'
import { Required } from '@/application/validation'

describe('Required', () => {
  it('should return RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, 'any_field')

    const errors = sut.validate()

    expect(errors).toEqual([new RequiredFieldError('any_field')])
  })

  it('should return RequiredFieldError if value is undefined', () => {
    const sut = new Required(undefined as any, 'any_field')

    const errors = sut.validate()

    expect(errors).toEqual([new RequiredFieldError('any_field')])
  })

  it('should return an empty array if value is not empty', () => {
    const sut = new Required('any_value', 'any_field')

    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })
})
