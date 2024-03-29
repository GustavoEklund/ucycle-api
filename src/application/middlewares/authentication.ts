import { RequiredString } from '@/application/validation'
import { forbidden, HttpResponse, ok } from '@/application/helpers'
import { Middleware } from '@/application/middlewares'

type HttpRequest = { authorization: string }
type Model = Error[] | { userId: string }
type Authorize = (params: { token: string }) => Promise<string>

export class AuthenticationMiddleware implements Middleware {
  constructor(private readonly authorize: Authorize) {}

  private static validate({ authorization }: HttpRequest): boolean {
    const errors = new RequiredString(authorization, 'authorization').validate()
    return errors.length === 0
  }

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    if (!AuthenticationMiddleware.validate({ authorization })) return forbidden()
    try {
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch {
      return forbidden()
    }
  }
}
