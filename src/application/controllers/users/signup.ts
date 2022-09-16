import { HttpResponse } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { SignUp } from '@/domain/use-cases'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = {
  name: string
  email: string
  phone: string
  document: string
  password: string
  socialName: string
}

type Model = Error | undefined

export class SignUpController extends Controller {
  public constructor(private readonly signUp: SignUp) {
    super()
  }

  async perform({
    name,
    email,
    phone,
    document,
    password,
    socialName,
  }: HttpRequest): Promise<HttpResponse<Model>> {
    await this.signUp.perform({
      account: {
        name,
        password,
        email,
        document,
        phone,
      },
      profile: { socialName: socialName },
    })
    return HttpResponse.ok(undefined)
  }

  public override buildValidators({
    name,
    email,
    phone,
    document,
    password,
    socialName,
  }: any): Validator[] {
    return [
      ...ValidationBuilder.of({ value: name, fieldName: 'name' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: email, fieldName: 'email' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: phone, fieldName: 'phone' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: document, fieldName: 'document' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: password, fieldName: 'password' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: socialName, fieldName: 'socialName' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
