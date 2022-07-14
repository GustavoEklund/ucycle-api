import { Publisher } from '@/domain/events'
import { LoadContact, LoadDocument } from '@/domain/contracts/repos'
import { ContactAlreadyExistsError, DocumentAlreadyExistsError } from '@/domain/entities/errors'

export interface SignUp {
  perform: (input: SignUp.Input) => Promise<SignUp.Output>
}

export class SignUpUseCase extends Publisher implements SignUp {
  public constructor(
    private readonly documentRepo: LoadDocument,
    private readonly contactRepo: LoadContact
  ) {
    super()
  }

  public async perform({ account, profile }: SignUp.Input): Promise<SignUp.Output> {
    const document = await this.documentRepo.load({ number: account.document })
    if (document !== undefined) return new DocumentAlreadyExistsError(account.document)
    const emailContact = await this.contactRepo.load({ value: account.email })
    if (emailContact !== undefined) return new ContactAlreadyExistsError(account.email)
    const phoneContact = await this.contactRepo.load({ value: account.phone })
    if (phoneContact !== undefined) return new ContactAlreadyExistsError(account.phone)
  }
}

export namespace SignUp {
  export type Input = {
    account: {
      name: string
      email: string
      phone: string
      document: string
    }
    profile: {
      socialName: string
    }
  }
  export type Output = void | undefined | DocumentAlreadyExistsError
}
