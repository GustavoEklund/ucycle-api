import { PgAddressRepository } from '@/infra/repos/postgres/address'

export const makePgAddressRepository = (): PgAddressRepository => {
  return new PgAddressRepository()
}
