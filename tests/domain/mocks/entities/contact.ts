import { Contact, Email, EmailType, Phone, PhoneType } from '@/domain/entities/contact'

import faker from '@faker-js/faker'

export const mockContact = (input?: {
  userId?: string
  forcePrimary?: boolean
  verified?: boolean
}): Contact => {
  return faker.helpers.arrayElement([
    mockEmailContact({ userId: input?.userId, verified: input?.verified }),
    mockPhoneContact({ userId: input?.userId, verified: input?.verified }),
  ])
}

export const mockEmailContact = (input?: {
  userId?: string
  forcePrimary?: boolean
  verified?: boolean
}): Email => {
  return new Email({
    value: faker.internet.email(),
    label: input?.forcePrimary
      ? EmailType.primary
      : faker.helpers.arrayElement([EmailType.primary, EmailType.secondary]),
    userId: input?.userId ?? faker.datatype.uuid(),
    verified: input?.verified === undefined ? faker.datatype.boolean() : input.verified,
    isPrivate: faker.datatype.boolean(),
  })
}

export const mockPhoneContact = (input?: {
  userId?: string
  forcePrimary?: boolean
  verified?: boolean
}): Phone => {
  return new Phone({
    value: faker.phone.phoneNumber('+55 ## #####-####'),
    label: input?.forcePrimary
      ? PhoneType.primary
      : faker.helpers.arrayElement([PhoneType.primary, PhoneType.whatsapp]),
    userId: input?.userId ?? faker.datatype.uuid(),
    verified: input?.verified === undefined ? faker.datatype.boolean() : input.verified,
    isPrivate: faker.datatype.boolean(),
  })
}
