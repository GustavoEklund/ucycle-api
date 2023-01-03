import { faker } from '@faker-js/faker'

export const mockPgContact = () => {
  return faker.datatype.boolean() ? makePgEmailContact() : makePgPhoneContact()
}

export const makePgEmailContact = () => ({
  verified: true,
  type: 'EMAIL',
  label: 'PRIMARY',
  value: 'email@email.com',
  isPrivate: true,
})

export const makePgPhoneContact = () => ({
  verified: true,
  type: 'PHONE',
  label: 'WHATSAPP',
  value: faker.phone.phoneNumber('+55 (##) #####-####'),
  isPrivate: true,
})
