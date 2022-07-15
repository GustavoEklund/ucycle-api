import { SignUp, SignUpUseCase } from '@/domain/use-cases'
import { makePgUserAccountRepo } from '@/main/factories/infra/repos/postgres'
import { makePgDocumentRepo } from '@/main/factories/infra/repos/postgres/document'
import { makePgContactRepo } from '@/main/factories/infra/repos/postgres/contact'
import { makeUuidHandler } from '@/main/factories/infra/gateways'
import { makeKeycloakApi } from '@/main/factories/infra/gateways/keycloak-api'

export const makeSignUpUseCase = (): SignUp => {
  return new SignUpUseCase(
    makePgUserAccountRepo(),
    makePgDocumentRepo(),
    makePgContactRepo(),
    makeUuidHandler(),
    makeKeycloakApi()
  )
}
