import { Controller, SaveProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/domain/use-cases'
import { makePgTransactionControllerDecorator } from '@/main/factories/application/decorators'

export const makeSaveProfilePictureController = (): Controller => {
  const controller = new SaveProfilePictureController(makeChangeProfilePicture())
  return makePgTransactionControllerDecorator(controller)
}
