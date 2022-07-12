import { Required, RequiredBoolean } from '@/application/validation'
import { RequiredFieldError } from '@/application/errors'
describe('RequiredBoolean', () => {
  it('should extend Required', () => {
    const sut = new RequiredBoolean('any_value', 'any_field_name')

    expect(sut).toBeInstanceOf(Required)
  })

  const invalidValue = ['string', undefined, 0, null, [], {}, NaN]

  it.each(invalidValue)(
    'should return RequiredFieldError if value is not boolean',
    (invalidValue) => {
      const sut = new RequiredBoolean(invalidValue, 'any_field_name')

      const errors = sut.validate()

      expect(errors).toEqual([new RequiredFieldError('any_field_name')])
    }
  )

  it('should return an empty array if value is true', () => {
    const sut = new RequiredBoolean(true, 'any_field_name')

    const errors = sut.validate()

    expect(errors).toHaveLength(0)
  })

  it('should return an empty array if value is false', () => {
    const sut = new RequiredBoolean(false, 'any_field_name')

    const errors = sut.validate()

    expect(errors).toHaveLength(0)
  })
})
