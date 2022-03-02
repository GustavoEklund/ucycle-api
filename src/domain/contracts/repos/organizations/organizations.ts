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
    address: object
    ownerUserId: number
  }

  export type Output = {
    id: string
  }
}
