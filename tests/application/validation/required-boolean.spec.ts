import { Required, RequiredBoolean } from '@/application/validation'
describe('RequiredBoolean', () => {
  it('should extend Required', () => {
    const sut = new RequiredBoolean('any_value', 'any_field_name')

    expect(sut).toBeInstanceOf(Required)
  })
})
