import { Document, Name, ValueObject } from '@/domain/value-objects'
import { Contact, Email, EmailType, Phone, PhoneType } from '@/domain/entities/contact'
import { ContactNotFoundError } from '@/domain/entities/errors/contact'

export enum UserAccountStatus {
  active = 'ACTIVE',
  disabled = 'DISABLED',
  banned = 'BANNED',
}

export class UserAccount extends ValueObject {
  public readonly name: Name
  public readonly contacts: Contact[]
  public readonly documents: Document[]
  public readonly verified: boolean
  public readonly status: UserAccountStatus

  public constructor({
    name,
    emails,
    phones,
    documents,
    verified,
    status,
    userId,
  }: {
    name: string
    emails: { value: string; label: EmailType; verified: boolean; isPrivate: boolean }[]
    phones: { value: string; label: PhoneType; verified: boolean; isPrivate: boolean }[]
    documents: string[]
    verified: boolean
    status: UserAccountStatus
    userId: string
  }) {
    super()
    this.name = new Name({ value: name })
    const emailContacts = emails.map(
      (email) =>
        new Email({
          value: email.value,
          label: email.label,
          verified: email.verified,
          isPrivate: email.isPrivate,
          userId,
        })
    )
    const phoneContacts = phones.map(
      (phone) =>
        new Phone({
          value: phone.value,
          label: phone.label,
          verified: phone.verified,
          isPrivate: phone.isPrivate,
          userId,
        })
    )
    this.contacts = [...emailContacts, ...phoneContacts]
    this.documents = documents.map((document) => new Document(document))
    this.verified = verified
    this.status = status
  }

  public getPrimaryEmail(): Email {
    const searchFunction = (contact: Contact): boolean =>
      contact instanceof Email && contact.label === EmailType.primary
    const email = this.contacts.find(searchFunction)
    if (email === undefined) throw new ContactNotFoundError()
    return email
  }

  public getPrimaryPhone(): Phone {
    const searchFunction = (contact: Contact): boolean =>
      Phone.isPhoneInstance(contact) && contact.label === PhoneType.primary
    const phone = this.contacts.find(searchFunction)
    if (!Phone.isPhoneInstance(phone)) throw new ContactNotFoundError()
    return phone
  }

  public doesContactBelongsTo(value: string): boolean {
    const searchFunction = (contact: Contact): boolean => contact.isValueEqualsToRawValue(value)
    return this.contacts.find(searchFunction) !== undefined
  }
}
