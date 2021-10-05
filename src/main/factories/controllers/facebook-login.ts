import { Controller, FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthentication } from '@/main/factories/use-cases'

export const makeFacebookLoginController = (): Controller => {
  return new FacebookLoginController(makeFacebookAuthentication())
}
