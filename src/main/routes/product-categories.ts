import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoadProductCategoriesController } from '@/main/factories/application/controllers/product-category'

import { Router } from 'express'

export default (router: Router): void => {
  router.get('/product-categories', adapt(makeLoadProductCategoriesController()))
}
