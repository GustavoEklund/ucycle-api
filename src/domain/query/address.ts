import { AddressType } from '@/domain/entities/address'

export interface LoadMyAddressesQuery {
  loadMyAddresses: (input: LoadMyAddressesQuery.Input) => Promise<LoadMyAddressesQuery.Output>
}

export namespace LoadMyAddressesQuery {
  export type Input = {
    user: { id: string }
  }
  type Address = {
    id: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    neighbourhood: string
    buildingNumber: string | undefined
    landmark: string | undefined
    phoneContact:
      | {
          id: string
          value: string
        }
      | undefined
    type: AddressType
  }
  export type Output = Address[]
}
