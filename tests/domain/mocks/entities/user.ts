import { User, UserAccount, UserAccountStatus, UserProfile } from '@/domain/entities/user'
import { faker } from '@faker-js/faker'
import { EmailType, PhoneType } from '@/domain/value-objects/contact'

const arrayWithRandomSize = (min = 1, max = 10): unknown[] =>
  Array(faker.datatype.number({ min, max })).fill(undefined)

export const mockUser = (input?: { id?: string }): User => {
  const userName = `${faker.name.firstName()} ${faker.name.lastName()}`
  const profile = new UserProfile({
    socialName: faker.datatype.boolean()
      ? `${faker.name.firstName()} ${faker.name.lastName()}`
      : undefined,
  })
  profile.updatePicture({
    name: faker.datatype.boolean() ? userName : undefined,
    pictureUrl: faker.datatype.boolean() ? faker.image.avatar() : undefined,
  })
  const account = new UserAccount({
    name: userName,
    status: faker.helpers.arrayElement([
      UserAccountStatus.active,
      UserAccountStatus.disabled,
      UserAccountStatus.banned,
    ]),
    verified: faker.datatype.boolean(),
    phones: arrayWithRandomSize().map(() => ({
      value: faker.phone.phoneNumber('+55 (##) #####-####'),
      label: faker.helpers.arrayElement([PhoneType.primary, PhoneType.whatsapp]),
    })),
    emails: arrayWithRandomSize().map(() => ({
      value: faker.internet.email(faker.name.firstName(), faker.name.lastName(), 'email.com', {
        allowSpecialCharacters: false,
      }),
      label: faker.helpers.arrayElement([EmailType.primary, EmailType.secondary]),
    })),
    documents: arrayWithRandomSize().map(() =>
      faker.helpers.arrayElement([
        '342.444.198-88',
        '342.444.198.88',
        '350.45261819',
        '693-319-118-40',
        '3.6.8.8.9.2.5.5.4.8.8',
        '11598647644',
        '86734718697',
        '86223423284',
        '24845408333',
        '95574461102',
      ])
    ),
  })
  return new User({ id: input?.id ?? faker.datatype.uuid(), profile, account })
}
