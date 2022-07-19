import { Entity } from '@/domain/entities'
import { description } from 'aws-sdk/clients/frauddetector'
import { name } from 'aws-sdk/clients/importexport'
import { __listOfAudioDescription } from 'aws-sdk/clients/mediaconvert'
import { bool } from 'aws-sdk/clients/signer'
import { InvalidNameError } from '../errors'
import { InvalidDescriptionError } from '../errors/invalid-description'

export type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: number
}

export class Organization extends Entity {
  public _description: string
  public _id: string | undefined
  public _name: string
  public address: Address
  public ownerUserId: string

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
  }

  public get name(): string {
    return this._name
  }

  public get description(): string {
    return this._description
  }

  private isNameValid(name: name): undefined | InvalidNameError {
    if (this.name.length > 3) return new InvalidNameError(this.name)
  }

  private isDescriptionValid(description: description): undefined | InvalidDescriptionError {
    if (this.description !== '') return new InvalidDescriptionError(this.description)
  }

  public isOwner(userId: string): boolean {
    return userId === this.ownerUserId
  }

  public updateName(name: string): void {
    this.isNameValid(this.name)
    this._name = name
  }

  public updateDescription(description: string) {
    this.isDescriptionValid(this.description)
    this._description = description
  }
}
