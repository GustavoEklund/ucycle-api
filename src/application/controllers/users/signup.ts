import { HttpResponse } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { SignUp } from '@/domain/use-cases'
import { RequiredType, ValidationBuilder, Validator } from '@/application/validation'
import { DocumentAlreadyExistsError } from '@/domain/entities/errors/user'
import { ContactAlreadyExistsError } from '@/domain/entities/errors/contact'

type HttpRequest = {
  name: string
  email: string
  password: string
}

type Model = undefined | Error[]

export class SignUpController extends Controller {
  public constructor(private readonly signUp: SignUp) {
    super()
  }

  async perform({ name, email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    const output = await this.signUp.perform({
      account: {
        name,
        password,
        email,
      },
    })
    if (output instanceof ContactAlreadyExistsError) return HttpResponse.conflict([output])
    return HttpResponse.noContent()
  }

  public override buildValidators({ name, email, password }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: name, fieldName: 'name' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: email, fieldName: 'email' })
        .required(RequiredType.string)
        .build(),
      ...ValidationBuilder.of({ value: password, fieldName: 'password' })
        .required(RequiredType.string)
        .build(),
    ]
  }
}
