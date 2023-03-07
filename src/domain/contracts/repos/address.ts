import { Address } from '@/domain/entities/address'

export interface SaveAddress {
  save: (input: Address) => Promise<void>
}

export interface LoadAddress {
  load: (input: LoadAddress.Input) => Promise<LoadAddress.Output>
}

export namespace LoadAddress {
  export type Input = {
    id: string
  }
  export type Output = Address | undefined
}

export interface DeleteAddress {
  delete: (input: Address) => Promise<void>
}
