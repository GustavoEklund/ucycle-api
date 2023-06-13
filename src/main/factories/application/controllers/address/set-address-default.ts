import { SetAddressDefaultController } from '@/application/controllers/address'
import { Controller } from '@/application/controllers'
import { makeSetAddressDefaultUseCase } from '@/main/factories/domain/use-cases/address'

export const makeSetAddressDefaultController = (): Controller => {
  return new SetAddressDefaultController(makeSetAddressDefaultUseCase())
}
