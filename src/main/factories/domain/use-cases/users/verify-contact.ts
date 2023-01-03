import { VerifyContact, VerifyContactUseCase } from '@/domain/use-cases'
import { makePgContactRepo, makePgUserAccountRepo } from '@/main/factories/infra/repos/postgres'
import { makeTwilioSdkGateway } from '@/main/factories/infra/gateways/sdks'
import { makeContactVerifiedHandler } from '@/main/factories/infra/event-handlers'

export const makeVerifyContact = (): VerifyContact => {
  const verifyContactUseCase = new VerifyContactUseCase(
    makePgUserAccountRepo(),
    makePgContactRepo(),
    makeTwilioSdkGateway()
  )
  verifyContactUseCase.subscribe(makeContactVerifiedHandler())
  return verifyContactUseCase
}
