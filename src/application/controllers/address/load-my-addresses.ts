import { Controller } from '@/application/controllers'
import { HttpResponse } from '@/application/helpers'
import { AddressType } from '@/domain/entities/address'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { LoadMyAddressesQuery } from '@/domain/query'

type HttpRequest = {
  userId: string
}

type Model = {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  neighbourhood: string
  buildingNumber: string | undefined
  landmark: string | undefined
  phoneContact:
    | {
        id: string
        value: string
      }
    | undefined
  type: AddressType
}

export class LoadMyAddressesController extends Controller {
  public constructor(private readonly address: LoadMyAddressesQuery) {
    super()
  }

  public async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model[] | Error[]>> {
    const addresses = await this.address.loadMyAddresses({ user: { id: httpRequest.userId } })
    return HttpResponse.ok(addresses)
  }

  public override buildValidators(httpRequest: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: httpRequest.userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
