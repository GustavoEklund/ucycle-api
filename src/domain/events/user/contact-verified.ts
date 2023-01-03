import { DomainEvent } from '@/domain/events'
import { Contact } from '@/domain/entities/contact'
import { User } from '@/domain/entities/user'

export class ContactVerifiedEvent extends DomainEvent {
  public readonly contact: Contact
  public readonly user: User

  public constructor(input: { contact: Contact; user: User; when?: Date }) {
    super({ name: 'CONTACT_VERIFIED', when: input.when })
    this.contact = input.contact
    this.user = input.user
  }
}
