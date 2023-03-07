import { Controller } from '@/application/controllers'
import { RemoveAddress } from '@/domain/use-cases/address/remove-address'
import { HttpResponse } from '@/application/helpers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { AddressDoesNotBelongToUserError } from '@/domain/entities/errors/address'

type HttpRequest = {
  userId: string
  addressId: string
}

export class RemoveAddressController extends Controller {
  public constructor(private readonly removeAddress: RemoveAddress) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.removeAddress.perform({
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
