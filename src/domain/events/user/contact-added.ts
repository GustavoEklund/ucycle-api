import { DomainEvent } from '@/domain/events'
import { Contact } from '@/domain/entities/contact'

export class ContactAddedEvent extends DomainEvent {
  public readonly contact: Contact

  public constructor(input: { contact: Contact }) {
    super({ name: 'CONTACT_ADDED' })
    this.contact = input.contact
  }
}
