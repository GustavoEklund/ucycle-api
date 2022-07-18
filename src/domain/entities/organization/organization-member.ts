import { ValueObject } from '@/domain/value-objects'

export class OrganizationMember extends ValueObject {
  public readonly userId: string
  public readonly admissionProposalId: string
  public readonly joinDate: Date

  constructor({
    userId,
    admissionProposalId,
    joinDate,
  }: {
    userId: string
    admissionProposalId: string
    joinDate: Date
  }) {
    super()
    this.userId = userId
    this.admissionProposalId = admissionProposalId
    this.joinDate = joinDate
  }
}
