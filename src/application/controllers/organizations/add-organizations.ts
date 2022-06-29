import { HttpResponse, ok } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { AddOrganizations } from '@/domain/use-cases'
import { RequiredType, ValidationBuilder as Builder, Validator } from '@/application/validation'

type Address = {
  city: string
  state: string
  country: string
  street: string
  neighbourhood: string
  buildingNumber: number
}
type HttpRequest = { name: string; address: Address; userId: string }
type Model = Error | { id: string }

export class AddOrganizationsController extends Controller {
  public constructor(private readonly addOrganizations: AddOrganizations) {
    super()
  }

  public async perform({ userId, name, address }: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.addOrganizations({
      name,
      address,
      userId,
    })
    return ok(response)
  }

  public override buildValidators({ userId, name, address }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ fieldName: 'userId', value: userId }).required(RequiredType.string).build(),
      ...Builder.of({ fieldName: 'name', value: name }).required(RequiredType.string).build(),
      ...Builder.of({ fieldName: 'address.city', value: address?.city })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ fieldName: 'address.state', value: address?.state })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ fieldName: 'address.country', value: address?.country })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ fieldName: 'address.street', value: address?.street })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ fieldName: 'address.neighbourhood', value: address?.neighbourhood })
        .required(RequiredType.string)
        .build(),
      ...Builder.of({ fieldName: 'address.buildingNumber', value: address?.buildingNumber })
        .required(RequiredType.string)
        .build(),
    ]
  }
}

export class AddOrganizationsCLI {
  public constructor(private readonly addOrganizations: AddOrganizations) {}

  public async perform({ userId, name, address }: HttpRequest): Promise<HttpResponse<Model>> {
    const response = await this.addOrganizations({
      name,
      address,
      userId,
    })
    return ok(response)
  }
}
