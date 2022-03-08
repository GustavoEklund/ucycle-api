type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: number
}

export class Organization {
  public readonly id: string | undefined
  public readonly name: string
  public readonly address: Address
  public readonly ownerUserId: number

  constructor({
    id,
    name,
    address,
    userId,
  }: {
    id?: string
    name: string
    address: Address
    userId: number
  }) {
    this.id = id
    this.name = name
    this.address = address
    this.ownerUserId = userId
  }
}
