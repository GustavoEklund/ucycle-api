import { OrganizationMember } from '@/domain/entities'

type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: string
}

export class Organization {
  public readonly id: string
  public readonly name: string
  public readonly address: Address
  public readonly ownerUserId: string
  public readonly members: OrganizationMember[]

  constructor({
    id,
    name,
    address,
    userId,
  }: {
    id: string
    name: string
    address: Address
    userId: string
  }) {
    this.id = id
    this.name = name
    this.address = address
    this.ownerUserId = userId
    this.members = []
  }

  public joinMember(member: { userId: string; admissionProposalId: string; date: Date }): void {
    this.members.push(
      new OrganizationMember({
        userId: member.userId,
        admissionProposalId: member.admissionProposalId,
        joinDate: member.date,
      })
    )
  }
}
