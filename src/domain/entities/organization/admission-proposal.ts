import { Entity } from '@/domain/entities'

export enum AdmissionProposalStatus {
  pending = 'PENDING',
  accepted = 'ACCEPTED',
  rejected = 'REJECTED',
}

export class AdmissionProposal extends Entity {
  public constructor({
    id,
    userId,
    organizationId,
  }: {
    id: string
    userId: string
    organizationId: string
  }) {
    super({ id })
  }
}
