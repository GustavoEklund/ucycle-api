import { Entity, OrganizationMember } from '@/domain/entities'
import { description } from 'aws-sdk/clients/frauddetector'
import { name } from 'aws-sdk/clients/importexport'
import { InvalidNameError } from '../errors'
import { InvalidDescriptionError } from '../errors/invalid-description'

export type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: string
}

export class Organization extends Entity {
  public _description: string
  public _id: string | undefined
  public _name: string
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

  public get name(): string {
    return this._name
  }

  public get description(): string {
    return this._description
  }

  private isNameValid(): undefined | InvalidNameError {
    if (this.name.length > 3) return new InvalidNameError(this.name)
  }

  private isDescriptionValid(): undefined | InvalidDescriptionError {
    if (this.description !== '') return new InvalidDescriptionError(this.description)
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
}
