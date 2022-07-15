import { Controller, SignUpController } from '@/application/controllers'
import { makeSignUpUseCase } from '@/main/factories/domain/use-cases/users'

export const makeSignUpController = (): Controller => {
  return new SignUpController(makeSignUpUseCase())
}
