import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { adaptExpressRoute as adapt, adaptMulter as upload } from '@/main/adapters'
import { makeSaveProfilePictureController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.put('/users/profile/picture', auth, upload, adapt(makeSaveProfilePictureController()))
  router.delete('/users/profile/picture', auth, adapt(makeSaveProfilePictureController()))
}
