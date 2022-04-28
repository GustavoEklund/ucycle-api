export interface LoadMyOrganizations {
  perform: (input: LoadMyOrganizations.Input) => Promise<LoadMyOrganizations.Output>
}

export namespace LoadMyOrganizations {
  export type Input = {
    userId: string
  }
  type Address = {
    city: string
    state: string
    country: string
    street: string
    neighbourhood: string
    buildingNumber: number
  }
  type Picture = {
    url: string
  }
  export type Output = {
    id: string
    name: string
    address: Address
    pictures: Picture[]
  }[]
}
