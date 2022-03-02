export class Organization {
  public readonly id: string | void
  public readonly name: string
  public readonly address: object
  public readonly ownerUserId: number

  constructor({
    id,
    name,
    address,
    ownerUserId,
  }: {
    id?: string
    name: string
    address: object
    ownerUserId: number
  }) {
    this.id = id
    this.name = name
    this.address = address
    this.ownerUserId = ownerUserId
  }
}
