import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeDeleteProfilePictureController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.delete('/users/profile/picture', auth, adapt(makeDeleteProfilePictureController()))
}
