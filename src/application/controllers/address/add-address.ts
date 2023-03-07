import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { AddAddress } from '@/domain/use-cases/address'
import { AddressType } from '@/domain/entities/address'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { UserNotFoundError } from '@/domain/entities/errors/user'

type HttpRequest = {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  neighbourhood: string
  buildingNumber?: string
  landmark?: string
  phoneContactId: string
  type: AddressType
  userId: string
}

export class AddAddressController extends Controller {
  public constructor(private readonly addAddress: AddAddress) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<undefined | Error[]>> {
    const output = await this.addAddress.perform(httpRequest)
    if (output instanceof UserNotFoundError) return HttpResponse.unprocessableEntity([output])
    return HttpResponse.noContent()
  }

  public override buildValidators(httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.street, fieldName: 'street' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.buildingNumber, fieldName: 'buildingNumber' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.neighbourhood, fieldName: 'neighbourhood' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.city, fieldName: 'city' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.state, fieldName: 'state' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.country, fieldName: 'country' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.zipCode, fieldName: 'zipCode' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.landmark, fieldName: 'landmark' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.phoneContactId, fieldName: 'phoneContactId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.phoneContactId, fieldName: 'phoneContactId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.type, fieldName: 'type' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: httpRequest.userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
