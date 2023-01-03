import { Phone, PhoneType } from '@/domain/entities/contact'
import { InvalidPhoneError } from '@/domain/entities/errors/contact'

describe('Phone', () => {
  const phoneNumbers = [
    {
      rawValue: '+55 (12) 98765-4321',
      value: {
        countryCode: '55',
        areaCode: '12',
        number: '987654321',
      },
    },
    {
      rawValue: '+55 (12) 8765-4321',
      value: {
        countryCode: '55',
        areaCode: '12',
        number: '87654321',
      },
    },
  ]

  it.each(phoneNumbers)('should be a valid phone number', (phoneNumber) => {
    const makePhone = (value: string): Phone =>
      new Phone({
        value,
        label: PhoneType.primary,
        verified: false,
        isPrivate: false,
        userId: 'any_user_id',
      })

    const sut = makePhone(phoneNumber.rawValue)

    expect(() => makePhone(phoneNumber.rawValue)).not.toThrow()
    expect(sut.label).toBe(PhoneType.primary)
    expect(sut.verified).toBe(false)
    expect(sut.value).toEqual(phoneNumber.value)
    expect(sut.type).toBe('PHONE')
  })

  it('should throw InvalidPhoneError if phone number has less than 12 numbers', () => {
    const expectedError = new InvalidPhoneError('+1 12 3456-7890')
    expect(
      () =>
        new Phone({
          value: '+1 12 3456-7890',
          label: PhoneType.primary,
          verified: false,
          isPrivate: false,
          userId: 'any_user_id',
        })
    ).toThrow(expectedError)
  })

  it('should throw InvalidPhoneNumber if value has no country code', () => {
    const expectedError = new InvalidPhoneError('12987654321')

    expect(
      () =>
        new Phone({
          value: '12987654321',
          label: PhoneType.primary,
          verified: false,
          isPrivate: false,
          userId: 'any_user_id',
        })
    ).toThrow(expectedError)
  })

  it('should return the correct full plain number', () => {
    const sut = new Phone({
      value: '+55 (12) 98765-4321',
      label: PhoneType.primary,
      verified: false,
      isPrivate: false,
      userId: 'any_user_id',
    })
    const expectedFullPlainValue = '+5512987654321'

    const fullPlainValue = sut.getFullPlainValue()

    expect(fullPlainValue).toEqual(expectedFullPlainValue)
  })

  it('should return the correct formatted value', () => {
    const sut = new Phone({
      value: '+5512987654321',
      label: PhoneType.primary,
      verified: false,
      isPrivate: false,
      userId: 'any_user_id',
    })
    const expectedFullPlainValue = '+55 (12) 98765-4321'

    const fullPlainValue = sut.getFormattedValue()

    expect(fullPlainValue).toEqual(expectedFullPlainValue)
  })
})
