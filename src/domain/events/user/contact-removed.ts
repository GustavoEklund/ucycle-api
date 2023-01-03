import { DomainEvent } from '@/domain/events'
import { Contact } from '@/domain/entities/contact'
import { User } from '@/domain/entities/user'

export class ContactRemovedEvent extends DomainEvent {
  public readonly contact: Contact
  public readonly user: User

  public constructor(input: { contact: Contact; user: User }) {
    super({ name: 'CONTACT_REMOVED' })
    this.contact = input.contact
    this.user = input.user
  }
}
