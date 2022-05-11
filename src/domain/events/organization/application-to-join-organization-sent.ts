import { DomainEvent } from '@/domain/events'
import { Document } from '@/domain/value-objects'
import { Contact } from '@/domain/value-objects/contact'

export class ApplicationToJoinOrganizationSent extends DomainEvent {
  organization: {
    id: string
    name: string
    ownerUser: {
      id: string
      contacts: Contact[]
    }
  }

  private readonly user: {
    id: string
    name: string
    documents: Document[]
    contacts: Contact[]
  }

  public constructor({
    user,
    organization,
  }: {
    user: {
      id: string
      name: string
      documents: Document[]
      contacts: Contact[]
    }
    organization: {
      id: string
      name: string
      ownerUser: {
        id: string
        contacts: Contact[]
      }
    }
  }) {
    super({ name: 'APPLICATION_TO_JOIN_ORGANIZATION_SENT' })
    this.user = user
    this.organization = organization
  }
}
