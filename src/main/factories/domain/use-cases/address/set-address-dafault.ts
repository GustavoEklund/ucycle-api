import {
  makePgAddressRepository,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'
import { SetAddressDefault, SetAddressDefaultUseCase } from '@/domain/use-cases/address'

export const makeSetAddressDefaultUseCase = (): SetAddressDefault => {
  return new SetAddressDefaultUseCase(makePgUserAccountRepo(), makePgAddressRepository())
}
