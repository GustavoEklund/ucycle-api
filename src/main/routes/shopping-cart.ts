import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeCreateShoppingCartController } from '@/main/factories/application/controllers/shopping-cart'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/shopping-cart', adapt(makeCreateShoppingCartController()))
}
