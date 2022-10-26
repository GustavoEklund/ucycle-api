import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoadProductsController } from '@/main/factories/application/controllers/products'

import { Router } from 'express'

export default (router: Router): void => {
  router.get('/products', adapt(makeLoadProductsController()))
}
