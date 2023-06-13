import { AddressQuery } from '@/infra/query/postgres/address'

export const makeAddressQuery = (): AddressQuery => {
  return new AddressQuery()
}
