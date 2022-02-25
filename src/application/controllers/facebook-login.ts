import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'
import { FacebookAuthentication } from '@/domain/use-cases'
import { AuthenticationError } from '@/domain/entities/errors'

type HttpRequest = { token: string }
type Model = Error | { access_token: string }

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const access_token = await this.facebookAuthentication({ token })
      return ok(access_token)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      throw error
    }
  }

  override buildValidators({ token }: HttpRequest): Validator[] {
    return [...Builder.of({ value: token, fieldName: 'token' }).required().build()]
  }
}
