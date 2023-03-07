import { AddAddress, AddAddressUseCase } from '@/domain/use-cases/address'
import { makeUuidHandler } from '@/main/factories/infra/gateways'
import {
  makePgAddressRepository,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeAddAddressUseCase = (): AddAddress => {
  return new AddAddressUseCase(
    makeUuidHandler(),
    makePgAddressRepository(),
    makePgUserAccountRepo()
  )
}
