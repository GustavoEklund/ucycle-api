import { HttpResponse } from '@/application/helpers'
import { ValidationComposite, Validator } from '@/application/validation'
import { DomainException } from '@/domain/entities/errors'

export abstract class Controller {
  public abstract perform(httpRequest: any): Promise<HttpResponse>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public buildValidators(httpRequest: any): Validator[] {
    return []
  }

  async handle(httpRequest: any): Promise<HttpResponse> {
    const errors = this.validate(httpRequest)
    if (errors.length > 0) return HttpResponse.badRequest(errors)
    try {
      return await this.perform(httpRequest)
    } catch (error) {
      if (error instanceof DomainException) return HttpResponse.badRequest([error])
      return HttpResponse.serverError(error)
    }
  }

  private validate(httpRequest: any): Error[] {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
