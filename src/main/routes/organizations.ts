import { Router } from 'express'
import { adaptExpressRoute as adapt } from '@/main/adapters'
import { addOrganizationsController } from '@/main/factories/application/controllers/organizations/add-organizations'

export default (router: Router): void => {
  router.post('/organizations', adapt(addOrganizationsController()))
}
