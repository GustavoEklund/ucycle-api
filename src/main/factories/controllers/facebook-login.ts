import { Controller, FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationService } from '@/main/factories/services'

export const makeFacebookLoginController = (): Controller => {
  return new FacebookLoginController(makeFacebookAuthenticationService())
}
