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
      }
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
