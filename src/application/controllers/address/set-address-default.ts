import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { SetAddressDefault } from '@/domain/use-cases/address'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { AddressDoesNotBelongToUserError } from '@/domain/entities/errors/address'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  userId: string
  addressId: string
}

export class SetAddressDefaultController extends Controller {
  public constructor(private readonly setAddressDefault: SetAddressDefault) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.setAddressDefault.perform({
      id: httpRequest.addressId,
      user: { id: httpRequest.userId },
    })
    if (output instanceof UserNotFoundError) return HttpResponse.unprocessableEntity([output])
    if (output instanceof AddressDoesNotBelongToUserError) return HttpResponse.forbidden([output])
    return HttpResponse.noContent()
  }

  public override buildValidators(httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.addressId, fieldName: 'addressId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
