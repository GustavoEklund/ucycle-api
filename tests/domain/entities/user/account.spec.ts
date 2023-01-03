import { UserAccount, UserAccountStatus } from '@/domain/entities/user'
import { Email, EmailType, Phone, PhoneType } from '@/domain/entities/contact'

describe('UserAccount', () => {
  it('should return primary email', () => {
    const sut = new UserAccount({
      name: 'any name',
      emails: [
        {
          value: 'secondary@email.com',
          label: EmailType.secondary,
          verified: true,
          isPrivate: true,
        },
        { value: 'primary@email.com', label: EmailType.primary, verified: true, isPrivate: true },
        {
          value: 'other_secondary@email.com',
          label: EmailType.secondary,
          verified: true,
          isPrivate: true,
        },
      ],
      phones: [],
      documents: [],
      verified: false,
      status: UserAccountStatus.active,
      userId: 'any_user_id',
    })
    const expectedEmailContact = new Email({
      value: 'primary@email.com',
      label: EmailType.primary,
      verified: true,
      isPrivate: true,
      userId: 'any_user_id',
    })

    const emailContact = sut.getPrimaryEmail()

    expect(emailContact).toEqual(expectedEmailContact)
  })

  it('should return primary phone', () => {
    const sut = new UserAccount({
      name: 'any name',
      emails: [],
      phones: [
        {
          value: '+55 (11) 39864-2908',
          label: PhoneType.whatsapp,
          verified: true,
          isPrivate: true,
        },
        { value: '+55 (11) 25662-9534', label: PhoneType.primary, verified: true, isPrivate: true },
        {
          value: '+55 (11) 36720-6143',
          label: PhoneType.whatsapp,
          verified: true,
          isPrivate: true,
        },
      ],
      documents: [],
      verified: false,
      status: UserAccountStatus.active,
      userId: 'any_user_id',
    })
    const expectedPhoneContact = new Phone({
      value: '+55 (11) 25662-9534',
      label: PhoneType.primary,
      verified: true,
      isPrivate: true,
      userId: 'any_user_id',
    })

    const phoneContact = sut.getPrimaryPhone()

    expect(phoneContact).toEqual(expectedPhoneContact)
  })
})
