import { faker } from '@faker-js/faker'

export const mockContact = () => ({
  verified: true,
  type: 'EMAIL',
  label: 'PRIMARY',
  value: 'email@email.com',
})

export const makeEmailContact = () => ({
  verified: true,
  type: 'EMAIL',
  label: 'PRIMARY',
  value: 'email@email.com',
  isPrivate: true,
})

export const makePhoneContact = () => ({
  verified: true,
  type: 'PHONE',
  label: 'WHATSAPP',
  value: faker.phone.phoneNumber('+55 (##) #####-####'),
  isPrivate: true,
})
