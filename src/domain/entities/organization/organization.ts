import { Entity, OrganizationMember } from '@/domain/entities'
import { InvalidNameError } from '@/domain/entities/errors/user'
import { InvalidDescriptionError } from '@/domain/entities/errors/organization'

export type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: string
}

export class Organization extends Entity {
  public address: Address
  public ownerUserId: string
  public readonly members: OrganizationMember[]

  constructor({
    id,
    name,
    address,
    userId,
    description,
  }: {
    id: string
    name: string
    address: Address
    userId: string
    description: string
  }) {
    super({ id })
    this._name = name
    this.address = address
    this.ownerUserId = userId
    this._description = description
    this.ownerUserId = userId
    this.members = []
  }

  public _description: string

  public get description(): string {
    return this._description
  }

  public _name: string

  public get name(): string {
    return this._name
  }

  public isOwner(userId: string): boolean {
    return userId === this.ownerUserId
  }

  public updateName(name: string): void {
    this._name = name
    const error = this.isNameValid()
    if (error) throw error
  }

  public updateDescription(description: string) {
    this._description = description
    const error = this.isDescriptionValid()
    if (error) throw error
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

  private isNameValid(): undefined | InvalidNameError {
    if (this.name.length < 3) return new InvalidNameError(this.name)
  }

  private isDescriptionValid(): undefined | InvalidDescriptionError {
    if (this.description === '') return new InvalidDescriptionError(this.description)
  }
}
