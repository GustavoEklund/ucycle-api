import { RequiredStringValidator } from '@/application/validation'
import { forbidden, HttpResponse, ok } from '@/application/helpers'
import { Authorize } from '@/domain/use-cases'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }

export class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!AuthenticationMiddleware.validate({ authorization })) return forbidden()
    try {
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }

  private static validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
