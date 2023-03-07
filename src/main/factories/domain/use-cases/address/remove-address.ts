import { RemoveAddress, RemoveAddressUseCase } from '@/domain/use-cases/address/remove-address'
import {
  makePgAddressRepository,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'

export const makeRemoveAddressUseCase = (): RemoveAddress => {
  return new RemoveAddressUseCase(makePgUserAccountRepo(), makePgAddressRepository())
}
