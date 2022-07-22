import { Phone, PhoneType } from '@/domain/value-objects/contact'
import { InvalidPhoneError } from '@/domain/entities/errors'

describe('Phone', () => {
  it('should be a valid phone', () => {
    const sut = new Phone('+55 (12) 98765-4321', PhoneType.primary)

    expect(sut.label).toBe(PhoneType.primary)
    expect(sut.verified).toBe(false)
    expect(sut.value).toEqual({
      countryCode: '55',
      areaCode: '12',
      number: '987654321',
    })
    expect(sut.type).toBe('PHONE')
  })

  it('should be a valid phone', () => {
    const sut = new Phone('(12) 98765-4321', PhoneType.primary)

    expect(sut.label).toBe(PhoneType.primary)
    expect(sut.verified).toBe(false)
    expect(sut.value).toEqual({
      countryCode: '55',
      areaCode: '12',
      number: '987654321',
    })
    expect(sut.type).toBe('PHONE')
  })

  it('should be a valid phone', () => {
    const sut = new Phone('98765-4321', PhoneType.primary)

    expect(sut.label).toBe(PhoneType.primary)
    expect(sut.verified).toBe(false)
    expect(sut.value).toEqual({
      countryCode: '55',
      areaCode: '',
      number: '987654321',
    })
    expect(sut.type).toBe('PHONE')
  })

  it('should be a valid phone', () => {
    const sut = new Phone('8765-4321', PhoneType.primary)

    expect(sut.label).toBe(PhoneType.primary)
    expect(sut.verified).toBe(false)
    expect(sut.value).toEqual({
      countryCode: '55',
      areaCode: '',
      number: '87654321',
    })
    expect(sut.type).toBe('PHONE')
  })

  it('should throw InvalidPhoneError if phone number has less than 7 characters', () => {
    expect(() => new Phone('8765-43', PhoneType.primary)).toThrow(new InvalidPhoneError())
  })
})
