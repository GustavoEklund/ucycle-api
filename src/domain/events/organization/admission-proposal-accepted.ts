import { DomainEvent } from '@/domain/events'

export class AdmissionProposalAccepted extends DomainEvent {
  public constructor(input: {
    acceptedByUserId: string
    targetUserId: string
    admissionProposalId: string
    when?: Date
  }) {
    super({ name: 'ADMISSION_PROPOSAL_ACCEPTED', when: input.when })
  }
}
