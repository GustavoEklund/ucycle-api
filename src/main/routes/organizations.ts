import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import {
  makeAddOrganizationsController,
  makeLoadMyOrganizationsController,
} from '@/main/factories/application/controllers'

export default (router: Router): void => {
  router.post('/organizations', adapt(makeAddOrganizationsController()))
  router.get('/users/:userId/organizations', adapt(makeLoadMyOrganizationsController()))
}
