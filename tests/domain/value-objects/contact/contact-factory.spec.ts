import { Email, EmailType, makeContact, Phone, PhoneType } from '@/domain/value-objects/contact'
import { InvalidContactTypeError } from '@/domain/entities/errors'

describe('ContactFactory', () => {
  it('should create a Phone contact', () => {
    const phone = makeContact({
      type: 'PHONE',
      label: PhoneType.primary,
      verified: true,
      value: '+5511999999999',
    })

    expect(phone).toEqual(new Phone('+5511999999999', PhoneType.primary))
  })

  it('should create a Email contact', () => {
    const phone = makeContact({
      type: 'EMAIL',
      label: EmailType.primary,
      verified: false,
      value: 'test@test.com',
    })

    expect(phone).toEqual(new Email('test@test.com', EmailType.primary))
  })

  it('should throw InvalidContactTypeError when type is invalid', () => {
    expect(() => {
      makeContact({
        type: 'INVALID_TYPE',
        label: EmailType.primary,
        verified: false,
        value: 'any_value',
      })
    }).toThrow(new InvalidContactTypeError())
  })
})
