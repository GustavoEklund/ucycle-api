import { Controller, DeleteProfilePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/domain/use-cases'

export const makeDeleteProfilePictureController = (): Controller => {
  return new DeleteProfilePictureController(makeChangeProfilePicture())
}
