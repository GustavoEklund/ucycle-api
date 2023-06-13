import { adaptExpressRoute as adapt, adaptKeycloakProtect, adaptMulter } from '@/main/adapters'
import {
  makeAddProductController,
  makeLoadProductController,
  makeLoadProductsController,
} from '@/main/factories/application/controllers/products'

import { Router } from 'express'
import { env } from '@/main/config/env'

export default (router: Router): void => {
  router.get('/products', adapt(makeLoadProductsController()))
  router.get('/products/:id', adapt(makeLoadProductController()))
  router.post(
    '/products',
    adaptMulter,
    adaptKeycloakProtect(`realm:default-roles-${env.keycloak.realm}`),
    adapt(makeAddProductController())
  )
}
