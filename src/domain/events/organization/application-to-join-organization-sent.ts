import { DomainEvent } from '@/domain/events'
import { Document } from '@/domain/value-objects'
import { Contact } from '@/domain/value-objects/contact'

export class ApplicationToJoinOrganizationSent extends DomainEvent {
  public readonly admissionProposalId: string

  public readonly organization: {
    id: string
    name: string
    ownerUser: {
      id: string
      contacts: Contact[]
    }
  }

  public readonly user: {
    id: string
    name: string
    documents: Document[]
    contacts: Contact[]
  }

  public constructor({
    admissionProposalId,
    user,
    organization,
  }: {
    admissionProposalId: string
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
    this.admissionProposalId = admissionProposalId
    this.user = user
    this.organization = organization
  }
}
