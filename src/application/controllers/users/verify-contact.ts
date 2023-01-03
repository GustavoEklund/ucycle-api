import { VerifyContact } from '@/domain/use-cases'
import { HttpResponse } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import {
  ContactDoesNotBelongToUserError,
  ContactNotFoundError,
  InvalidPhoneNumberVerificationCodeError,
} from '@/domain/entities/errors/contact'
import { UserNotFoundError } from '@/domain/entities/errors/user'

type HttpRequest = {
  userId: string
  contact: {
    value: string
    verificationCode: string
  }
}

type Model = Error[] | undefined

export class VerifyContactController extends Controller {
  public constructor(private readonly verifyContact: VerifyContact) {
    super()
  }

  public async perform({ userId, contact }: HttpRequest): Promise<HttpResponse<Model>> {
    const output = await this.verifyContact.perform({ user: { id: userId }, contact })
    if (output instanceof UserNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof ContactNotFoundError) return HttpResponse.notFound([output])
    if (output instanceof ContactDoesNotBelongToUserError) return HttpResponse.forbidden([output])
    if (output instanceof InvalidPhoneNumberVerificationCodeError)
      return HttpResponse.badRequest([output])
    return HttpResponse.noContent()
  }

  public override buildValidators({ userId, contact }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ fieldName: 'userId', value: userId })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ fieldName: 'contact.value', value: contact?.value })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({
        fieldName: 'contact.verificationCode',
        value: contact?.verificationCode,
      })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
