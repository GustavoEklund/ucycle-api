import { FacebookAuthentication } from '@/domain/features'
import { FacebookAuthenticationUseCase } from '@/domain/use-cases'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepo } from '@/main/factories/repos'
import { makeJwtTokenGenerator } from '@/main/factories/crypto'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return new FacebookAuthenticationUseCase(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator()
  )
}
