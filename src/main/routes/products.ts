import { adaptExpressRoute as adapt } from '@/main/adapters'
import {
  makeLoadProductController,
  makeLoadProductsController,
} from '@/main/factories/application/controllers/products'

import { Router } from 'express'

export default (router: Router): void => {
  router.get('/products', adapt(makeLoadProductsController()))
  router.get('/products/:id', adapt(makeLoadProductController()))
}
