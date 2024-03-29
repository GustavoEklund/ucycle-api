import { adaptExpressRoute as adapt } from '@/main/adapters'
import {
  makeAddProductToShoppingCartController,
  makeCreateShoppingCartController,
  makeLoadMyShoppingCartController,
} from '@/main/factories/application/controllers/shopping-cart'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/shopping-cart', adapt(makeCreateShoppingCartController()))
  router.put(
    '/shopping-cart/:shoppingCartId/add-product/:productId',
    adapt(makeAddProductToShoppingCartController())
  )
  router.get('/shopping-cart/:shoppingCartId', adapt(makeLoadMyShoppingCartController()))
}
