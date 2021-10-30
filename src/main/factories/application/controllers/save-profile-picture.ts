import { Controller, SaveProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/domain/use-cases'

export const makeSaveProfilePictureController = (): Controller => {
  return new SaveProfilePictureController(makeChangeProfilePicture())
}
