import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeAddPersonsController } from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/persons', adapt(makeAddPersonsController()))
}