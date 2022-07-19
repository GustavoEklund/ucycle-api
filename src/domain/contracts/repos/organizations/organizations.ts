import { Organization } from '@/domain/entities'

export interface LoadOrganization {
  load: (params: LoadOrganization.Input) => Promise<LoadOrganization.Output>
}

export namespace LoadOrganization {
  export type Input = {
    id: string
  }
  export type Output = undefined | Organization
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
    buildingNumber: string
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
  export type Input = Organization

  export type Output = {
    id: string
  }
}
