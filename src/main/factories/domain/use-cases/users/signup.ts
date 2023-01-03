import { SignUp, SignUpUseCase } from '@/domain/use-cases'
import {
  makePgContactRepo,
  makePgDocumentRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'
import { makeUuidHandler } from '@/main/factories/infra/gateways'
import { makeKeycloakApi } from '@/main/factories/infra/gateways/keycloak-api'
import { makeUserSignedUpHandler } from '@/main/factories/infra/event-handlers'

export const makeSignUpUseCase = (): SignUp => {
  const signUpUseCase = new SignUpUseCase(
    makePgUserAccountRepo(),
    makePgDocumentRepo(),
    makePgContactRepo(),
    makeUuidHandler(),
    makeKeycloakApi()
  )
  signUpUseCase.subscribe(makeUserSignedUpHandler())
  return signUpUseCase
}
