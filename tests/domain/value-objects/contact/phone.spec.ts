import { Phone, PhoneType } from '@/domain/value-objects/contact'

describe('Phone', () => {
  it('should be a valid phone', () => {
    const sut = new Phone('+5512987654321', PhoneType.primary)

    expect(sut.label).toBe(PhoneType.primary)
    expect(sut.verified).toBe(false)
    expect(sut.value).toEqual({
      countryCode: '55',
      areaCode: '12',
      number: '987654321',
    })
    expect(sut.type).toBe('PHONE')
  })
})
