import { Contact, Email, EmailType, Phone, PhoneType } from '@/domain/value-objects/contact'
import { InvalidContactTypeError } from '@/domain/entities/errors'

type RawContact = {
  type: string
  label: string
  verified: boolean
  value: string
}

export const makeContact = (contact: RawContact): Contact => {
  if (contact.type === 'PHONE' && Object.values(PhoneType).includes(contact.label as PhoneType))
    return new Phone(contact.value, contact.label as PhoneType)
  if (contact.type === 'EMAIL' && Object.values(EmailType).includes(contact.label as EmailType))
    return new Email(contact.value, contact.label as EmailType)
  throw new InvalidContactTypeError()
}

export const makeContacts = (input: RawContact[]): Contact[] => input.map(makeContact)
