import { AddContact } from '@/domain/use-cases'
import { HttpResponse } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  value: string
  label: string
  isPrivate: boolean
  userId: string
}

export class AddContactController extends Controller {
  public constructor(private readonly addContact: AddContact) {
    super()
  }

  public async perform({
    value,
    label,
    isPrivate,
    userId,
  }: HttpRequest): Promise<HttpResponse<undefined>> {
    await this.addContact.perform({
      contact: { value, label, isPrivate },
      user: { id: userId },
    })
    return HttpResponse.noContent()
  }

  public override buildValidators({ label, isPrivate, userId, value }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: userId, fieldName: 'userId' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: value, fieldName: 'value' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: isPrivate, fieldName: 'isPrivate' })
        .required(RequiredType.boolean)
        .build(),
      ...ValidationBuilder.of({ value: label, fieldName: 'label' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
