import { DomainEvent } from '@/domain/events'
import { User } from '@/domain/entities/user'
import { AdmissionProposal } from '@/domain/entities'

export class AdmissionProposalAccepted extends DomainEvent {
  public readonly acceptedByUser: User
  public readonly admissionProposal: AdmissionProposal

  public constructor(input: {
    acceptedByUser: User
    admissionProposal: AdmissionProposal
    when?: Date
  }) {
    super({ name: 'ADMISSION_PROPOSAL_ACCEPTED', when: input.when })
    this.acceptedByUser = input.acceptedByUser
    this.admissionProposal = input.admissionProposal
  }
}
