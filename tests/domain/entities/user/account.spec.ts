import { UserAccount, UserAccountStatus } from '@/domain/entities/user'
import { Email, EmailType, Phone, PhoneType } from '@/domain/value-objects/contact'

describe('UserAccount', () => {
  it('should return primary email', () => {
    const sut = new UserAccount({
      name: 'any name',
      emails: [
        { value: 'secondary@email.com', label: EmailType.secondary },
        { value: 'primary@email.com', label: EmailType.primary },
        { value: 'other_secondary@email.com', label: EmailType.secondary },
      ],
      phones: [],
      documents: [],
      verified: false,
      status: UserAccountStatus.active,
    })
    const expectedEmailContact = new Email('primary@email.com', EmailType.primary)

    const emailContact = sut.getPrimaryEmail()

    expect(emailContact).toEqual(expectedEmailContact)
  })

  it('should return primary phone', () => {
    const sut = new UserAccount({
      name: 'any name',
      emails: [],
      phones: [
        { value: '(11) 39864-2908', label: PhoneType.whatsapp },
        { value: '(11) 25662-9534', label: PhoneType.primary },
        { value: '(11) 36720-6143', label: PhoneType.whatsapp },
      ],
      documents: [],
      verified: false,
      status: UserAccountStatus.active,
    })
    const expectedPhoneContact = new Phone('(11) 25662-9534', PhoneType.primary)

    const phoneContact = sut.getPrimaryPhone()

    expect(phoneContact).toEqual(expectedPhoneContact)
  })
})
