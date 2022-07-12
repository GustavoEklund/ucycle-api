import { env } from '@/main/config/env'
import { adaptExpressRoute as adapt, adaptKeycloakProtect } from '@/main/adapters'
import { makeApproveAdmissionProposalController } from '@/main/factories/application/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.post(
    '/admission-proposals/:admissionProposalId/approve',
    adaptKeycloakProtect(`realm:default-roles${env.keycloak.realm}`),
    adapt(makeApproveAdmissionProposalController())
  )
}
