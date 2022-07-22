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
    status,
  }: {
    id: string
    userId: string
    organizationId: string
    status?: AdmissionProposalStatus
  }) {
    super({ id })
    this.userId = userId
    this.organizationId = organizationId
    this._status = status ?? AdmissionProposalStatus.pending
  }

  private _status: AdmissionProposalStatus

  public get status(): AdmissionProposalStatus {
    return this._status
  }

  public approve(): void {
    this._status = AdmissionProposalStatus.accepted
  }

  public decline(): void {
    this._status = AdmissionProposalStatus.rejected
  }
}
