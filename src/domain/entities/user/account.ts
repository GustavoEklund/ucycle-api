import { Document, Name, ValueObject } from '@/domain/value-objects'
import { Contact, Email, EmailType, Phone, PhoneType } from '@/domain/value-objects/contact'
import { ContactNotFoundError } from '@/domain/entities/errors'

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
  }: {
    name: string
    emails: { value: string; label: EmailType }[]
    phones: { value: string; label: PhoneType }[]
    documents: string[]
    verified: boolean
    status: UserAccountStatus
  }) {
    super()
    this.name = new Name({ value: name })
    const emailContacts = emails.map((email) => new Email(email.value, email.label))
    const phoneContacts = phones.map((phone) => new Phone(phone.value, phone.label))
    this.contacts = [...emailContacts, ...phoneContacts]
    this.documents = documents.map((document) => new Document(document))
    this.verified = verified
    this.status = status
  }

  public getPrimaryEmail(): Email {
    const email = this.contacts.find(
      (contact) => contact instanceof Email && contact.label === EmailType.primary
    )
    if (email === undefined) throw new ContactNotFoundError()
    return email
  }

  public getPrimaryPhone(): Phone {
    const phone = this.contacts.find(
      (contact) => contact instanceof Phone && contact.label === PhoneType.primary
    )
    if (phone === undefined) throw new ContactNotFoundError()
    return phone
  }
}
