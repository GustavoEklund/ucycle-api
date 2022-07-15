import { HttpResponse, ok } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { SignUp } from '@/domain/use-cases'

type HttpRequest = {
  name: string
  email: string
  phone: string
  document: string
  password: string
  socialName: string
}

type Model = Error | undefined

export class SignUpController extends Controller {
  constructor(private readonly signUp: SignUp) {
    super()
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    await this.signUp.perform({
      account: {
        name: httpRequest.name,
        password: httpRequest.password,
        email: httpRequest.email,
        document: httpRequest.document,
        phone: httpRequest.phone,
      },
      profile: {
        socialName: httpRequest.socialName,
      },
    })

    return ok(undefined)
  }
}
