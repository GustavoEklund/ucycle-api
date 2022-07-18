import { Entity } from '@/domain/entities'

export enum AdmissionProposalStatus {
  pending = 'PENDING',
  accepted = 'ACCEPTED',
  rejected = 'REJECTED',
}

export class AdmissionProposal extends Entity {
  public readonly userId: string
  public readonly organizationId: string

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
    this.userId = userId
    this.organizationId = organizationId
    this._status = AdmissionProposalStatus.pending
  }

  private _status: AdmissionProposalStatus

  public get status(): AdmissionProposalStatus {
    return this._status
  }

  public accept(): void {
    this._status = AdmissionProposalStatus.accepted
  }
}
