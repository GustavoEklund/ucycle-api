export interface LoadOrganization {
  load: (params: LoadOrganization.Input) => Promise<LoadOrganization.Output>
}

export namespace LoadOrganization {
  export type Input = {
    id: string
  }
  export type Output =
    | undefined
    | {
        id: string
        name: string
        documents: { number: string }[]
        ownerUser: {
          id: string
          contacts: {
            value: string
            type: string
            label: string
            verified: boolean
          }[]
        }
      }
}

export interface LoadOrganizations {
  loadAll: (input: LoadOrganizations.Input) => Promise<LoadOrganizations.Output>
}

export namespace LoadOrganizations {
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

export interface SaveOrganization {
  save: (params: SaveOrganization.Input) => Promise<SaveOrganization.Output>
}

export namespace SaveOrganization {
  export type Input = {
    name: string
    address: {
      city: string
      state: string
      country: string
      street: string
      neighbourhood: string
      buildingNumber: number
    }
    ownerUserId: string
  }

  export type Output = {
    id: string
  }
}
