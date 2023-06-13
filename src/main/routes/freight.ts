import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeCalculateFreightController } from '@/main/factories/application/controllers/freight'

import { Router } from 'express'

export default (router: Router): void => {
  router.get('/calculate-freight/:zipcode', adapt(makeCalculateFreightController()))
}
